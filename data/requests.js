const { serverAddress, authToken } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getConfigUrl: `${serverAddress}/getVKBotConfig?authToken=${authToken}`,
  setConfigUrl: `${serverAddress}/setVKBotConfig?authToken=${authToken}`,
  getActualityUrl: `${serverAddress}/getActuality`,
  setActualityUrl: `${serverAddress}/setActuality?authToken=${authToken}`,
  getScheduleUrl: `${serverAddress}/getSchedule/`,
};
