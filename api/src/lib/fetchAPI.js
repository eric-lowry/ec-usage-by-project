const fetch = require('node-fetch');
const createError = require('http-errors');
const { EC_API_URL, EC_API_KEY } = require('../config');

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
    .then(res => {
      if (!res.ok) throw createError(res.status,res.statusText);
      return res.json();
    });

module.exports = fetchAPI;
