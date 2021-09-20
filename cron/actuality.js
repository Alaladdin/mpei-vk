const schedule = require('node-schedule');
const { chats } = require('../config');
const { getters: storeGetters } = require('../store');
const getActuality = require('../functions/getActuality');
const { sendMessage } = require('../helpers');

module.exports = {
  getIsAutopostingEnabled() {
    const actualityAutoposting = storeGetters.getActualityAutoposting();

    return actualityAutoposting.isEnabled;
  },
  async execute(vk) {
    const { main: mainChat, spam: spamChat } = chats;

    schedule.scheduleJob('0 0 9 * * *', async () => {
      const isEnabled = this.getIsAutopostingEnabled();
      const actuality = await getActuality();

      if (!isEnabled || !actuality) return;

      [mainChat, spamChat].forEach((peerId) => {
        sendMessage(vk, { peerId, message: `Актуалити\n${actuality.content}` });
      });
    });
  },
};
