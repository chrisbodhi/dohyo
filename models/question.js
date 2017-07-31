'use strict';

module.exports = function main(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    question: DataTypes.STRING
  }, {
    classMethods: {
      associate: function assoc(models) {
        Question.hasMany(models.Answer, { as: 'answers' });
        Question.hasMany(models.Tally, { as: 'tallies' });
      }
    }
  });
  return Question;
};
