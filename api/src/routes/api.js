var express = require('express');
var router = express.Router();
const { version: pkgVersion } = require('../../package.json');
const orgInfo = require('../middlewares/orgInfo');
const periodInfo = require('../controllers/periodInfo');
const csvFile = require('../controllers/csvFile');

const isAuth = require('../middlewares/isAuth');

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
router.get('/org-info', isAuth, orgInfo, function (req, res, next) {
  res.json({
    id: res.locals.orgID,
    name: res.locals.orgName,
  });
});

router.get('/period-info', isAuth, periodInfo);

router.get('/csv/:fromDate/:toDate/ec-usage-export.csv', isAuth, csvFile);

router.use((req, res, next) => {
  res.status(404).json({
    message: 'api resource not found',
  });
});

module.exports = router;
