const express = require('express');
const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
//const debug = require('debug')('api:auth');

const router = express.Router();

const {
  AUTH_SECRET,
  SESSION_COOKIE_NAME,
  SESSION_DURATION,
  TOKEN_DURATION,
  ADMIN_USER_NAME,
  ADMIN_PASSWORD,
  ADMIN_ROLES,
} = require('../config');

const development = process.env.NODE_ENV === 'development';

const SESSION_COOKIE_BASE_OPTS = {
  sameSite: development ? 'lax' : 'strict',
  httpOnly: development ? false : true,
  secure: false,
  path: '/',
};

function makeToken(sub, duration, props = {}) {
  return jwt.sign(
    {
      sub,
      ...props,
    },
    AUTH_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: `${duration}s`,
    }
  );
}

//
// GET /auth/session
//
router.get('/session', function (req, res, next) {
  const sessionToken = req.cookies[SESSION_COOKIE_NAME];
  let session;
  try {
    session = jwt.verify(sessionToken, AUTH_SECRET);
  } catch {
    throw createHttpError(401); // Unauthorized
  }
  const user = session.sub;
  const accessToken = makeToken(user, TOKEN_DURATION, {
    roles: ADMIN_ROLES,
  });
  res.json({ user, roles: ADMIN_ROLES, token: accessToken });
});

//
// POST /auth/login
//
router.post('/login', function (req, res, next) {
  const user = (req.body.user || '').trim();
  const password = (req.body.password || '').trim();
  if (!(user === ADMIN_USER_NAME && password === ADMIN_PASSWORD)) {
    throw createHttpError(401); // Unauthorized
  }

  const cookieOpts = {
    ...SESSION_COOKIE_BASE_OPTS,
    expires: new Date(Date.now() + SESSION_DURATION * 1000),
  };

  const sessionToken = makeToken(user, SESSION_DURATION);
  res.cookie(SESSION_COOKIE_NAME, sessionToken, cookieOpts);

  const accessToken = makeToken(user, TOKEN_DURATION, {
    roles: ADMIN_ROLES,
  });

  res.json({ user, roles: ADMIN_ROLES, token: accessToken });
});

//
// POST /auth/logout
//
router.post('/logout', function (req, res, next) {
  res.clearCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_BASE_OPTS);
  res.json({ message: 'you have been logged out.' });
});

module.exports = router;
