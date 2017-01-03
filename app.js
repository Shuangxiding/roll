var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var result = require('./routes/result');


var template = require('art-template');
template.config('views', ''); //指定模版目录
template.config('extname', '.html'); //指定模板后缀名
template.config('cache', false); //关闭缓存


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', template.__express); //设置模版引擎
app.set('view engine', 'html'); //设置模版引擎

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/index', routes);
app.use('/result', result);

//前端分开写的，先扔一边...--Javan
app.use(express.static(path.join(__dirname, 'frontEnd/dst')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
