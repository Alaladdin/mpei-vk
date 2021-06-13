const { serverAddress, authToken } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getStoreUrl: `${serverAddress}/getVKBotStore?authToken=${authToken}`,
  setStoreUrl: `${serverAddress}/setVKBotStore?authToken=${authToken}`,
  getActualityUrl: `${serverAddress}/getActuality`,
  setActualityUrl: `${serverAddress}/setActuality?authToken=${authToken}`,
  getScheduleUrl: `${serverAddress}/getSchedule/`,
  getFAQUrl: `${serverAddress}/getFAQ?authToken=${authToken}`,
  setFAQUrl: `${serverAddress}/setFAQ?authToken=${authToken}`,
  removeFAQUrl: `${serverAddress}/deleteFAQ?authToken=${authToken}`,
};
