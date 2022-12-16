const fetchDeploymentCosts = require('../lib/fetchDeploymentCosts');
const fetchDeploymentDetails = require('../lib/fetchDeploymentDetails');
const orgInfo = require('../middlewares/orgInfo');
//const debug = require('debug')('api:csvFile');

//
// csvFile() Controller
//
const csvFile = [
  orgInfo,
  async (req, res, next) => {
    const { orgID, orgName } = res.locals;

    const fromDate = req.params.fromDate;
    const toDate = req.params.toDate;

    const deploymentCosts = await fetchDeploymentCosts(orgID, fromDate, toDate);

    // get the details for every deployment in this billing cycle,
    // including decomissioned deployments
    const deploymentDetails = await Promise.all(
      deploymentCosts.deployments.map(deployment => {
        return fetchDeploymentDetails(deployment.deployment_id);
      })
    );

    const deployments = deploymentCosts.deployments
      .map(deployment => {
        const detail = deploymentDetails.find(
          detail => detail.id === deployment.deployment_id
        );

        return {
          id: deployment.deployment_id,
          name: deployment.deployment_name,
          state: detail.state,
          tag: detail.tag,
          costs: deployment.costs.total,
          rate: deployment.hourly_rate,
          // from: deployment.period.start,
          // to: deployment.period.end,
        };
      })
      .sort((a, b) => b.costs - a.costs);

    res
      .header('Content-type', 'application/csv')
      .header(
        'Content-disposition',
        `attachment; filename=ec-usage-${fromDate}-to-${toDate}.csv`
      )
      .send(
        `"deployment_id","name","state","tag","rate","costs"\n` +
          deployments
            .map(
              ({ id, name, state, tag, rate, costs }) =>
                `"${id}","${name}","${state}","${tag}",${rate},${costs}`
            )
            .join('\n')
      );
  },
];

module.exports = csvFile;
