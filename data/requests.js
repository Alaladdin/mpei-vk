const { serverAddress } = require('../config');

module.exports = {
  getUniversalUrl: (query) => `${serverAddress}/${query}`,
  getStoreUrl    : `${serverAddress}/vk/getStore`,
  setStoreUrl    : `${serverAddress}/vk/setStore`,
  getActualityUrl: `${serverAddress}/getActuality`,
  getScheduleUrl : `${serverAddress}/getSchedule/`,
};
