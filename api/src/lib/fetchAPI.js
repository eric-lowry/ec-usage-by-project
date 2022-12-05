const fetch = require('node-fetch');
const { handleHttpErrors } = require('fetch-http-errors');
const { EC_API_URL, EC_API_KEY } = require('./config');

//
// fetch(API)
//
// Fetch a result
//
const fetchAPI = (uri, opts = {}) =>
  fetch(`${EC_API_URL}${uri}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `ApiKey ${EC_API_KEY}`,
    },
    ...opts,
  })
    .then(handleHttpErrors)
    .then(res => {
      return res.json();
    });

module.exports = fetchAPI;
