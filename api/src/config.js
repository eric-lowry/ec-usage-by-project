//
// config.js
//
module.exports = {
  EC_API_KEY: process.env.EC_API_KEY,
  EC_API_URL: process.env.EC_API_URL || 'https://api.elastic-cloud.com',
  EC_TAG_NAME: process.env.EC_TAG_NAME || 'project',

  CLIENT_PATH: process.env.CLIENT_PATH,

  AUTH_SECRET: process.env.AUTH_SECRET || process.env.EC_API_KEY || 'change-me!',

  SESSION_COOKIE_NAME: process.env.COOKIE_NAME || 'st',
  SESSION_DURATION: Number( process.env.SESSION_DURATION || 48 * 60 * 60), // 48 hours as seconds
  TOKEN_DURATION:  Number( process.env.TOKEN_DURATION || 30 * 60), // 30 minutes as seconds

  ADMIN_USER_NAME: process.env.ADMIN_USER_NAME || 'elastic',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || process.env.EC_API_KEY,
  ADMIN_ROLES: [ 'user', 'admin' ],
};
