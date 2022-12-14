const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('api:isAuth');

const { AUTH_SECRET } = require('../config');

//
// isAuth - authentication/authorization middleware
//
// used to protect a route to authenticated users,
// stores the user's authorization in req.authorization
//
function isAuth(req, res, next) {
  // first look for an authorization in the url...
  let token = req.query.authorization;
  if (!token) {
    // ...second, look for an authorizaiton in the headers
    const bearerToken = req.header('Authorization');
    if (!bearerToken) throw createError(401); // Unauthorized
    const [prefix, _token] = bearerToken.split(' ');
    if (prefix.toLowerCase() !== 'bearer' || !_token) {
      debug(`malformed authorization header: ${bearerToken}`);
      throw createError(401); // Unauthorized
    }
    token = _token;
  }
  let authorization;
  try {
    authorization = jwt.verify(token, AUTH_SECRET);
  } catch (err) {
    debug(err);
    throw createError(401); // Unauthorized
  }
  debug(authorization);
  req.authorization = authorization;
  next();
}

module.exports = isAuth;
