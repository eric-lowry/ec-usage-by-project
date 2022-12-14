//import createError from 'http-errors';
import fetchOptions from './fetchOptions';
import handleFetchResponse from './handleFetchResponse';
import fetchSession from './fetchSession';

const API_HOST = process.env.REACT_APP_API_HOST || '';
const AUTH_HOST =
  process.env.REACT_APP_AUTH_HOST || process.env.REACT_APP_API_HOST;

const fetchAPI = (uri, opts = {}) => {
  const _opts = fetchOptions({
    accessToken: sessionStorage.getItem('accessToken'),
    ...opts,
  });
  // console.log(_opts);
  return fetch(`${API_HOST}${uri}`, _opts)
    .then(handleFetchResponse)
    .catch(err => {
      if (err.status !== 401) throw err; // re-throw unexpected errors

      return fetchSession().then((json) => {
          console.log('key refresh');
          const { token } = json;
          sessionStorage.setItem('accessToken', token);
          const _opts = fetchOptions({
            accessToken: token,
            ...opts,
          });
          // try again with the new accessToken
          return fetch(`${API_HOST}${uri}`, _opts).then(handleFetchResponse);
        });
    });
};

export default fetchAPI;
