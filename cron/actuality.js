const schedule = require('node-schedule');
const { chats } = require('../config');
const { getters: storeGetters } = require('../store');
const getActuality = require('../functions/getActuality');
const { formatDate, sendMessage } = require('../helpers');

module.exports = {
  getIsAutopostingEnabled() {
    const actualityAutoposting = storeGetters.getActualityAutoposting();

    return actualityAutoposting.isEnabled;
  },
  async execute(vk) {
    const { main: mainChat, spam: spamChat } = chats;

    schedule.scheduleJob('0 0 9 * * *', async () => {
      const isEnabled = this.getIsAutopostingEnabled();

      if (!isEnabled) return;

      const actuality = await getActuality();

      if (actuality) {
        const msg = [];

        msg.push(`Актуалити. Обновлено: ${formatDate(actuality.date)}\n`);
        msg.push(`${actuality.content}`);

        [mainChat, spamChat].forEach((peerId) => {
          sendMessage(vk, { peerId, message: msg.join('\n') });
        });
      }
    });
  },
};
