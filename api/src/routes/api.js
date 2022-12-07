var express = require('express');
var router = express.Router();
const { version: pkgVersion } = require('../../package.json');
// const fetchAPI = require('../lib/fetchAPI');
const orgInfo = require('../middlewares/orgInfo');
const periodInfo = require('../controllers/periodInfo');
const csvFile = require('../controllers/csvFile');

//
// GET /api/version
//
router.get('/version', function (req, res, next) {
  res.json({ version: pkgVersion });
});

//
// GET /api/org-info
//
// returns: { id: "...", name: "..." }
//
router.get('/org-info', orgInfo, function (req, res, next) {
  res.json({
    id: res.locals.orgID,
    name: res.locals.orgName,
  });
});

router.get('/period-info', periodInfo);

router.get('/csv/:fromDate/:toDate/ec-usage-export.csv', csvFile);

module.exports = router;
