const { serverAddress } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getStoreUrl    : `${serverAddress}/getVKBotStore`,
  setStoreUrl    : `${serverAddress}/setVKBotStore`,
  getActualityUrl: `${serverAddress}/getActuality`,
  getScheduleUrl : `${serverAddress}/getSchedule/`,
};
