'use strict';
module.exports = function main(sequelize, DataTypes) {
  var Tally = sequelize.define('Tally', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    classMethods: {
      getTallies: function get(surveyId, callback) {
        Tally.findById(surveyId)
          .then(function findThen(Tallies) {
            callback(null, Tallies);
          });
      },
      addTally: function addTally(userId, respId, surveyId) {
        // todo: add verification that user has not already
        // entered a selection for this survey question
        Tally.create({
          UserId: userId,
          ResponseId: respId,
          SurveyId: surveyId
        }).then(function createThen(input) {
          // eslint-disable-next-line no-console
          console.log('\n\nAdded Tally:', input);
        }).catch(function createErr(err) {
          // eslint-disable-next-line no-console
          console.log('Error in addTally', err);
        });
      }
    }
  });

  return Tally;
};
