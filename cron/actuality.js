const schedule = require('node-schedule');
const { chats } = require('../config');
const { getters: storeGetters } = require('../store');
const { getActuality, sendAsImage } = require('../functions');

module.exports = {
  getIsAutopostingEnabled() {
    const actualityAutoposting = storeGetters.getActualityAutoposting();

    return actualityAutoposting.isEnabled;
  },
  async init(vk) {
    schedule.scheduleJob('0 0 9 * * *', async () => {
      const isEnabled = this.getIsAutopostingEnabled();
      const actuality = await getActuality().catch(() => {});

      if (isEnabled && actuality) {
        sendAsImage({
          message: actuality.content,
          peerId : chats.main,
          vk,
        }).catch(console.error);
      }
    });
  },
};
