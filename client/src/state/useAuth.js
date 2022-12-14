//
// useAuth() - Authentication/Authorization State Manager
//
import { createContext, useContext, useEffect, useState } from 'react';
import handleFetchResponse from '../lib/handleFetchResponse';
import fetchOptions from '../lib/fetchOptions';
import fetchSession from '../lib/fetchSession';

const AUTH_HOST = process.env.REACT_APP_AUTH_HOST || process.env.REACT_APP_API_HOST || '';

const Ctx = createContext();

// on page load, ensure that we don't have a token
sessionStorage.setItem('accessToken', '');

//
// Provider
//
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [profile, setProfile] = useState();

  useEffect(() => {
    fetchSession()
      .then(data => {
        // console.log(data);
        sessionStorage.setItem('accessToken', data.token);
        setProfile({ user: data.user, roles: data.roles });
      })
      .catch(err => {
        if (!(err.status === 401)) setError(err); // show unexpected errors
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function clearAuthState() {
    setProfile();
    sessionStorage.setItem('accessToken', '');
  }

  async function login(user, password) {
    console.log('logging in');
    clearAuthState();

    return fetch(
      `${AUTH_HOST}/auth/login`,
      fetchOptions({ method: 'POST', body: { user, password } })
    )
      .then(handleFetchResponse)
      .then(resJSON => {
        // console.log(resJSON);
        const { user, roles, token } = resJSON;
        setProfile({ user, roles });
        sessionStorage.setItem('accessToken', token);
        return true;
      })
      .catch(() => false);
  }

  function logout() {
    clearAuthState();
    return fetch(`${AUTH_HOST}/auth/logout`, fetchOptions({ method: 'POST' }))
      .then(() => true)
      .catch(() => false);
  }

  return (
    <Ctx.Provider value={{ isLoading, error, profile, login, logout }}>
      {children}
    </Ctx.Provider>
  );
};

//
// Consumer
//
export default function useAuth() {
  return useContext(Ctx);
}