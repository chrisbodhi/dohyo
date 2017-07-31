var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

var api = require('./routes/api');
var routes = require('./routes/index')(router);

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', api);
app.use('/', routes);

// Catch 404 and forward to error handler
app.use(function fourohfour(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function errRes(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
