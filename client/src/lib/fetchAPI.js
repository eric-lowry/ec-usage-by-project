import { handleHttpErrors } from 'fetch-http-errors';

const API_HOST = process.env.REACT_APP_API_HOST || '';

const fetchAPI = (uri, opts = {}) =>
  fetch(`${API_HOST}${uri}`, {
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
