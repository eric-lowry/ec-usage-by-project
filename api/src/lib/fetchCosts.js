const fetchAPI = require('./fetchAPI');

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
  
  module.exports = fetchCosts;
  