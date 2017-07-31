/**
 * todo: start with getting API up and running
 * [ ] get a survey question via REST call to API
 * [ ] answer a survey question via REST call to API w/ static user id
 * [x] add a survey question  via REST call to API
 */

var _ = require('lodash');
var express = require('express');

var db = require('../models/index');

var router = express.Router();

// ///////// Start of helper functions
function getNextSurveyId(userId) {
  var getSurveyId = _.flow(_.difference, _.sample);

  return db.Question.findAll({
    attributes: ['id']
  }).then(function findAllSurveys(surveys) {
    return _.map(surveys, function mapSurveys(survey) {
      return survey.dataValues.id;
    });
  }).then(function findAllIds(allIds) {
    return db.Tally.findAll({
      where: { UserId: userId },
      attributes: ['QuestionId']
    }).then(function returnResults(results) {
      var answered = _.map(results, function mapResults(result) {
        return result.dataValues.QuestionId;
      });

      return getSurveyId(allIds, answered);
    });
  });
}

function insertAnswer(res, questionId, answerString) {
  db.Answer.create({
    answer: answerString,
    QuestionId: questionId
  }).then(function saveAnswer(newAnswer) {
    // eslint-disable-next-line no-console
    console.log('Added answer', newAnswer.dataValues);
  }).catch(function saveAnswerErr(err) {
    // eslint-disable-next-line no-console
    console.log('Problem saving answer', err);
    res.send({ message: 'Problem saving answer ' + answerString });
  });
}

function parseResults(resultsArr) {
  return _.map(resultsArr, function mapResults(result) {
    var question = result.question;
    var counts = _.map(result.answers, function resultCount(resp) {
      return {
        response: resp.answer,
        count: _.filter(result.results, function filterResults(r) {
          return r.AnswerId === resp.id;
        }).length
      };
    });
    return {
      question: question,
      counts: counts
    };
  });
}

// ///////// End helper functions

// ///////// Start of routes

router.get('/surveys', function getSurveys(req, res) {
  db.Question.findAll({
    include: [
      { model: db.Answer, as: 'answers' },
      { model: db.Tally, as: 'tallies' }
    ]
  }).then(function getThen(surveys) {
    console.log('surveys is', surveys);
    return surveys.length
      ? res.send({
        surveyResults: parseResults(surveys)
      })
      : res.send([]);
  }).catch(function getErr(err) {
    throw new Error(err);
  });
});

router.post('/surveys', function postSurveys(req, res, next) {
  var question = req.body.question;

  // todo: Handle when there are more/fewer than 3 answers;
  //       this should also include the UI.
  var answers = _.compact([
    req.body.answer1,
    req.body.answer2,
    req.body.answer3
  ]);

  db.Question.create({
    question: question
  }).then(function createThen(newQuestion) {
    var questionId = newQuestion.id;
    _.forEach(answers, function eachAnswer(answer) {
      insertAnswer(res, questionId, answer);
    });
    next();
  }).catch(function eachAnswerErr(err) {
    // eslint-disable-next-line no-console
    console.log('Problem saving question', err);
    res.send({ message: 'Problem saving question.' });
  });

  req.flash('surveyMessage', 'Question recorded!');
  res.redirect('back');
});

router.get('/survey/:id', function getSurvey(req, res) {
  db.Question.find({
    where: { id: req.params.id },
    include: [{ model: db.Answer, as: 'answers' }]
  }).then(function find(question) {
    var answers = _.map(question.answers, function mapAnswers(obj) {
      return {
        id: obj.dataValues.id,
        text: obj.dataValues.answer
      };
    });

    res.send({
      id: question.id,
      question: question.question,
      answers: answers
    });
  })
  .catch(function findErr(err) {
    res.send(err);
  });
});

router.post('/results', function postResults(req, res) {
  // todo: compare `userId` to `req.user.dataValues.id`
  // for user confirmation
  var userId = parseInt(req.body.userId, 10);
  var respId = parseInt(req.body.answerId, 10);
  var surveyId = parseInt(req.body.surveyId, 10);

  try {
    db.Tally.addTally(userId, respId, surveyId, function addTally(result) {
      // eslint-disable-next-line no-console
      console.log('Saved tally', _.size(result));
      res.send('Successfully recorded tally.');
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Err recording tally', err);
    req.flash('surveyMessage', 'Error!');
    res.redirect('back');
  }
});

router.get('/result/:surveyId', function getResult(req, res) {
  var surveyId = req.params.surveyId;

  db.Tally.getTallies(surveyId, function getResults(err, count) {
    if (err) {
      res.send(err);
    } else {
      res.send({ count: count });
    }
  });
});

router.get('/user', function getUser(req, res) {
  res.send({ user: req.user.dataValues });
});

router.get('/survey/user/:userId', function getUserId(req, res) {
  var userId = req.params.userId;

  getNextSurveyId(userId)
    .then(function getNextSurvey(nextId) {
      res.send({ nextId: nextId });
    })
    .catch(function nextSurveyErr(err) {
      // eslint-disable-next-line no-console
      console.log('Error getting ID for next survey', err);
    });
});

module.exports = router;
