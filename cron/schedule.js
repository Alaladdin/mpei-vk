const schedule = require('node-schedule');
const { chats, serverDateFormat } = require('../config');
const pschedule = require('../functions/schedule');
const sendMessage = require('../functions/sendMessage');
const { format: formatDate } = require('../util/pdate');

module.exports = {
  async execute(vk) {
    const { main: mainChat, spam: spamChat } = chats;

    schedule.scheduleJob('0 5 9 * * *', async () => {
      const today = formatDate(new Date(), serverDateFormat);
      const s = await pschedule.get({ start: today, finish: today });
      const scheduleToday = s.schedule || null;

      if (typeof scheduleToday !== 'object' && !Array.isArray(scheduleToday)) return;

      scheduleToday.forEach((item) => {
        const itemData = [];

        itemData.push(`[${item.dayOfWeekString}] ${item.discipline} - ${formatDate(item.date)}`);
        itemData.push(item.kindOfWork);
        itemData.push(`${item.beginLesson} - ${item.endLesson}`);
        itemData.push(item.lecturer);

        [mainChat, spamChat].forEach((chat) => {
          sendMessage(vk, {
            peerId: chat.peerId,
            message: itemData.join('\n'),
          });
        });
      });
    });
  },
};
