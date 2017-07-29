var Sequelize = require('sequelize');

var sequelize = new Sequelize('dohyo', process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(function () {
    console.log('Connection has been established successfully!');
  })
  .catch(function (err) {
    console.error('Unable to connect to the database:', err);
  });
