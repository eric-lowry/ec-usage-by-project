const fetchAPI = require('./fetchAPI');

const fetchDeploymentCosts = (orgID, fromDate, toDate) =>
  fetchAPI(
    `/api/v1/billing/costs/${orgID}/deployments?from=${fromDate}&to=${toDate}`
  );

module.exports = fetchDeploymentCosts;
