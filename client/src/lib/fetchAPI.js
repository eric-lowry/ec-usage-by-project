
import createError from 'http-errors';

const API_HOST = process.env.REACT_APP_API_HOST || '';

const fetchAPI = (uri, opts = {}) =>
  fetch(`${API_HOST}${uri}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...opts,
  })
    .then(req => {
      if (!req.ok) throw createError(req.status,req.statusText);
      return req.json();
    });

export default fetchAPI;
