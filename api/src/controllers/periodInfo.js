const fetchAPI = require('../lib/fetchAPI');
const orgInfo = require('../middlewares/orgInfo');
const debug = require('debug')('api:periodInfo');
const { EC_TAG_NAME } = require('../lib/config');

const defaultDateRange = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const dom = today.getDate().toString().padStart(2, '0');
  const fromDate = year + '-' + month + '-01';
  const toDate = year + '-' + month + '-' + dom;

  return [fromDate, toDate];
};

const fetchCosts = (orgID, fromDate, toDate) => {
  const uri =
    fromDate && toDate
      ? `/api/v1/billing/costs/${orgID}?from=${fromDate}&to=${toDate}` // period range
      : `/api/v1/billing/costs/${orgID}`; // current period
  return fetchAPI(uri).then(json => ({
    hourly_rate: json.hourly_rate,
    total_costs: json.costs.total,
  }));
};

//
// fetchCurrentCosts(id,from,to) - returns a promise for the org's current period's high level costs
//
const fetchCurrentCosts = (orgID, fromDate, toDate) =>
  fetchAPI(`/api/v1/billing/costs/${orgID}?from=${fromDate}&to=${toDate}`).then(
    json => ({
      total_hourly_rate: json.hourly_rate,
      total_costs: json.costs.total,
    })
  );

const fetchDeploymentCosts = (orgID, fromDate, toDate) =>
  fetchAPI(
    `/api/v1/billing/costs/${orgID}/deployments?from=${fromDate}&to=${toDate}`
  );

//
// fetchDeploymentDetails(id) - returns a promose for a deployments important meta-data
//
const fetchDeploymentDetails = deploymentID =>
  fetchAPI(`/api/v1/deployments/${deploymentID}`).then(json => {
    const matchingTag = json.metadata.tags.find(tag => tag.key === EC_TAG_NAME);
    return {
      id: json.id,
      name: json.name,
      tag: matchingTag?.value || 'not-tagged',
      state: json.metadata.hidden
        ? 'hidden'
        : json.healthy
        ? 'healthy'
        : 'unhealthy',
    };
  });

//
// periodInfo() Controller
//
const periodInfo = [
  orgInfo,
  async (req, res, next) => {
    const { orgID, orgName } = res.locals;
    const [defaultFromDate, defaultToDate] = defaultDateRange();

    const fromDate = req.query.from || defaultFromDate;
    const toDate = req.query.to || defaultToDate;

    const currentPeriod = !(req.query.from && req.query.to);

    let hourlyRate;
    let totalCosts;

    if (currentPeriod) {
      const { hourly_rate, total_costs } = await fetchCosts(orgID);
      hourlyRate = hourly_rate;
      totalCosts = total_costs;
    } else {
      const { hourly_rate, total_costs } = await fetchCosts(
        orgID,
        fromDate,
        toDate
      );
      hourlyRate = hourly_rate;
      totalCosts = total_costs;
    }

    const deploymentCosts = await fetchDeploymentCosts(orgID, fromDate, toDate);

    // get the details for every deployment in this billing cycle
    const currentDeployments = await Promise.all(
      deploymentCosts.deployments.map(deployment => {
        return fetchDeploymentDetails(deployment.deployment_id);
      })
    );

    res.json({
      orgID,
      orgName,
      fromDate,
      toDate,
      hourlyRate,
      totalCosts,
      deploymentCosts,
      currentDeployments
    });
  },
];

module.exports = periodInfo;
