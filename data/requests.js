const { serverAddress } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getScheduleUrl : `${serverAddress}/getSchedule`,
};
