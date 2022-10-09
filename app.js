var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var auth = require('./middlewares/auth')


//connecting to Database
mongoose.connect( process.env.MONGO_CONNECTION_STRING ,(err)=>{
  console.log( err ? err : 'Connection to DB established');
})

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler so that if the incoming request does not match with any route it will throw a 404 error
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // send the error code and the error message
  return res.status(err.status || 500).json({"error": err.message});
});

module.exports = app;
