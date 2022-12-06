const fetchAPI = require('./fetchAPI');
const { EC_TAG_NAME } = require('./config');

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

  module.exports = fetchDeploymentDetails;