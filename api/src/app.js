const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const assert = require('assert');
const cors = require('cors');
const debug = require('debug')('api:app');

require('dotenv').config({ path: __dirname + '/../.env' });

const { EC_API_KEY } = require('./config');

assert(EC_API_KEY, 'no EC_API_KEY in environment');

const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

const app = express();
require('express-async-errors');

app.use(
  cors({
    // use a cors "dynamic origin"
    //origin: function (origin, callback) {
    //  callback(undefined, origin);
    //},
    origin: "http://127.0.0.1:3000",
    credentials: true,
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// 404 error - //todo figure out how to serve
app.use((req, res, next) => {
  res.status(404).json({
    message: 'resource not found',
  });
});

// global error handler (will catch exceptions)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).send({
    error: err.message,
    status,
  });
});

module.exports = app;
