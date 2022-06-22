require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const multer = require("multer");

const usersRouter = require('../react-express-app/routes/users');
const postsRouter = require('../react-express-app/routes/posts');
const alertsRouter = require('../react-express-app/routes/notifications');
const chatRouter = require('../react-express-app/routes/chat');  


const URL = process.env.MONGODB_URI;
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Added to serve client static files
app.use(express.static(path.resolve(__dirname, 'client/build')));

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/alerts', alertsRouter);
app.use('/chat', chatRouter);   


app.get("*",(req, res)=> {
  res.send()
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;