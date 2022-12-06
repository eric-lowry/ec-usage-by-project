import { handleHttpErrors } from 'fetch-http-errors';

const fetchAPI = (uri, opts = {}) =>
  fetch(uri, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...opts,
  })
    .then(handleHttpErrors)
    .then(res => {
      return res.json();
    });

export default fetchAPI;
