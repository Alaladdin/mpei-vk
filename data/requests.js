const { serverAddress } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getActualityUrl: `${serverAddress}/getActuality`,
  getScheduleUrl : `${serverAddress}/getSchedule`,
};
