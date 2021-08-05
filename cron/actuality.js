const schedule = require('node-schedule');
const { chats } = require('../config');
const { getters: storeGetters } = require('../store');
const { get: getActuality } = require('../functions/actuality');
const sendMessage = require('../functions/sendMessage');
const { format: formatDate } = require('../util/pdate');

module.exports = {
  async execute(vk) {
    const actualityConfig = () => storeGetters.getActualityConfig();
    const { main: mainChat, spam: spamChat } = chats;

    schedule.scheduleJob('0 0 9 * * *', async () => {
      if (!actualityConfig().enabled) return;
      const { actuality } = await getActuality();
      if (actuality) {
        const msg = [];

        msg.push(`Актуалити. Обновлено: ${formatDate(actuality.date)}\n`);
        msg.push(`${actuality.content}`);

        [mainChat, spamChat].forEach((chat) => {
          sendMessage(vk, {
            peerId: chat,
            message: msg.join('\n'),
          });
        });
      }
    });
  },
};
