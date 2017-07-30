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
        Question.hasMany(models.Response, { as: 'responses' });
        Question.hasMany(models.Result, { as: 'results' });
      }
    }
  });
  return Question;
};
