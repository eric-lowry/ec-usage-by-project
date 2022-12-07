const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const assert = require('assert');
const cors = require('cors');
const debug = require('debug')('api:app');

require('dotenv').config({ path: __dirname + '/../.env' });
const { EC_API_KEY, CLIENT_PATH } = require('./lib/config');
assert(EC_API_KEY, 'no EC_API_KEY in environment');

if (CLIENT_PATH) {
  debug(`serving client from ${CLIENT_PATH}`);
}

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (CLIENT_PATH) {
  app.use(express.static(CLIENT_PATH));
}

app.use('/', indexRouter);

app.use('/api', apiRouter);

if (CLIENT_PATH) {
  app.use('*', (req,res) =>{
    res.sendFile( path.join(CLIENT_PATH, "index.html"));
  })
} else {
// 404 error
app.use((req, res, next) => {
  res.status(404).json({
    message: 'resource not found',
  });
});
}

// other errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something Broke!');
});

module.exports = app;
