const { serverAddress, authToken } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getStoreUrl: `${serverAddress}/getVKBotStore?authToken=${authToken}`,
  setStoreUrl: `${serverAddress}/setVKBotStore?authToken=${authToken}`,
  getActualityUrl: `${serverAddress}/getActuality`,
  getScheduleUrl: `${serverAddress}/getSchedule/`,
  getFAQUrl: `${serverAddress}/getFAQ?authToken=${authToken}`,
};
