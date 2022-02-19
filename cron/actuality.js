const schedule = require('node-schedule');
const { chats } = require('../config');
const { getters: storeGetters } = require('../store');
const { getActuality, sendAsImage } = require('../functions');
const { handleError } = require('../helpers');

module.exports = {
  async init(vk) {
    schedule.scheduleJob('0 0 9 * * *', async () => {
      const isActualityAutopostingEnabled = storeGetters.getIsActualityAutopostingEnabled();
      const actuality = await getActuality();

      if (isActualityAutopostingEnabled && actuality && actuality.content) {
        sendAsImage({ message: actuality.content, peerId: chats.main, vk })
          .catch((error) => handleError(error, vk));
      }
    });
  },
};
