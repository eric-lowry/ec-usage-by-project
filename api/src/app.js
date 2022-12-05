const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const assert = require('assert');
// const debug = require('debug')('api:app');

require('dotenv').config({ path: __dirname + '/../.env' });
assert(process.env.EC_API_KEY, 'no EC_API_KEY in environment');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/api', apiRouter);

// 404 error
apiRouter.use((req,res,next)=>{
    res.status(404).json({
        message: "resource not found"
    });
})

// other errors
app.use((err, req, res, next)=>{
    console.error(err);
    res.status(500).send('Something Broke!');
})

module.exports = app;
