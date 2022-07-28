const { apiUrl } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${apiUrl}/${query}`,
  getScheduleUrl : `${apiUrl}/getSchedule`,
};
