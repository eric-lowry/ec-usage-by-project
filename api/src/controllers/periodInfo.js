const fetchCosts = require('../lib/fetchCosts');
const fetchDeploymentCosts = require('../lib/fetchDeploymentCosts');
const fetchDeploymentDetails = require('../lib/fetchDeploymentDetails');
const orgInfo = require('../middlewares/orgInfo');
const debug = require('debug')('api:periodInfo');

const defaultDateRange = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const dom = today.getDate().toString().padStart(2, '0');
  const fromDate = year + '-' + month + '-01';
  const toDate = year + '-' + month + '-' + dom;
  return [fromDate, toDate];
};

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

    const { hourly_rate: hourlyRate, total_costs: totalCosts } =
      await fetchCosts(orgID);

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
        };
      })
      .sort((a, b) => b.costs - a.costs);

    res.json({
      orgID,
      orgName,
      fromDate,
      toDate,
      hourlyRate,
      totalCosts,
      deployments,
    });
  },
];

module.exports = periodInfo;
