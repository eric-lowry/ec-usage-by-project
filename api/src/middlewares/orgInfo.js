//
// orgInfo.js
//
// express js middleware to inject organization info into requests
//
const debug = require('debug')('api:orgInfo');
const fetchAPI = require('../lib/fetchAPI');

const { EC_ORG_ID, EC_ORG_NAME } = process.env;

let orgID = EC_ORG_ID;
let orgName = EC_ORG_NAME;

//
// orgInfo(req,res,next)
//
// Injects:
//   res.locals.orgID
//   res.locals.orgName
//
const orgInfo = (req, res, next) => {
  if (orgID && orgName) {
    res.locals.orgID = orgID;
    res.locals.orgName = orgName;
    next();
  } else {
    debug('caching orgID, orgName');
    fetchAPI('/api/v1/organizations')
      .then(data => {
        const org = data.organizations[0];
        orgID = org.id;
        orgName = org.name;
        res.locals.orgID = orgID;
        res.locals.orgName = orgName;
        next();
      })
      .catch(next); // will pass any error to next()
  }
};

module.exports = orgInfo;
