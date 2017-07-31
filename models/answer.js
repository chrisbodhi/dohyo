'use strict';

module.exports = function main(sequelize, DataTypes) {
  var Answer = sequelize.define('Answer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    answer: DataTypes.STRING
  }, {
    classMethods: {
      associate: function assoc(models) {
        Answer.hasMany(models.Tally, { as: 'tallies' });
      }
    }
  });
  return Answer;
};
