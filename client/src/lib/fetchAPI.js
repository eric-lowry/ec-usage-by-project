import createError from 'http-errors';
import fetchOptions from './fetchOptions';

const API_HOST = process.env.REACT_APP_API_HOST || '';

const fetchAPI = (uri, opts = {}) => {
  const _opts = fetchOptions({
    accessToken: sessionStorage.getItem('accessToken'),
    ...opts,
  });
  // console.log(_opts);
  return fetch(`${API_HOST}${uri}`, _opts).then(req => {
    if (!req.ok) throw createError(req.status, req.statusText);
    return req.json();
  });
};

export default fetchAPI;
