const fetchDeployment = require('../lib/fetchDeployment');
const debug = require('debug')('api:tagDeployment');
const { EC_TAG_NAME } = require('../config');
const fetchAPI = require('../lib/fetchAPI');

//
// tagDeployment() Controller
//
const tagDeployment = async (req, res, next) => {
  const { deploymentId } = req.params;
  const deployment = await fetchDeployment(deploymentId);
  debug(deployment.metadata);
  const tags = (deployment.metadata.tags || []).filter(
    tag => tag.key !== EC_TAG_NAME
  );
  const { tag: tagValue } = req.body;

  if (tagValue) {
    tags.push({ key: EC_TAG_NAME, value: tagValue });
  }
  debug(tags);

  const results = await fetchAPI(
    `/api/v1/deployments/${deploymentId}?hide_pruned_orphans=false&skip_snapshot=false&validate_only=false`,
    {
      method: 'PUT',
      body: JSON.stringify({
        prune_orphans: false,
        metadata: {
          tags,
        },
      }),
    }
  );
  debug(results);

  res.json({ ok: true });
};

module.exports = tagDeployment;
