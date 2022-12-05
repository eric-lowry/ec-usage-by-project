//
// config.js
//
module.exports = {
    EC_API_KEY: process.env.EC_API_KEY,
    EC_API_URL: process.env.EC_API_URL || 'https://api.elastic-cloud.com',
    EC_TAG_NAME: process.env.EC_TAG_NAME || 'billing-project',
}
