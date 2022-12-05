var express = require('express');
var router = express.Router();

//
// Note: in a properly configured environment, this should never be called directly.
//
router.get('/', function(req, res, next) {
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Error</title>
    <style>
      body { padding-top: 50px; padding-left: 50px; }
    </style>
  </head>
  <body>
    <h1>Bad Application Proxy</h1>
    <p>
      This application's proxy is misconfigured,
      please see the instructions for help.
    </p>
  </body>
  </html>
`)
});

module.exports = router;
