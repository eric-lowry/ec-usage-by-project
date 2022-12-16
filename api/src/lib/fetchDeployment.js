const fetchAPI = require('./fetchAPI');

//
// fetchDeployment(id) - returns a promose for a "raw" deployment
//
const fetchDeployment = deploymentID =>
  fetchAPI(`/api/v1/deployments/${deploymentID}`);

module.exports = fetchDeployment;
