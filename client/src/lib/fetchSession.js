//
// fetchSession() - Fetch a fresh accessToken
//
import handleFetchResponse from './handleFetchResponse';
import fetchOptions from './fetchOptions';

const AUTH_HOST =
  process.env.REACT_APP_AUTH_HOST || process.env.REACT_APP_API_HOST || '';

export default function fetchSession() {
  return fetch(`${AUTH_HOST}/auth/session`, fetchOptions()).then(
    handleFetchResponse
  );
}
