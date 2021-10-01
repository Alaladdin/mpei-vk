const schedule = require('node-schedule');
const { chats, serverDateFormat } = require('../config');
const getSchedule = require('../functions/getSchedule');
const { formatDate, sendMessage } = require('../helpers');

module.exports = {
  async execute(vk) {
    const { main: mainChat, spam: spamChat } = chats;

    schedule.scheduleJob('0 5 9 * * *', async () => {
      const today = formatDate(new Date(), serverDateFormat);
      const scheduleData = await getSchedule(today, today);

      if (!scheduleData) return;

      scheduleData.forEach((i) => {
        const itemData = [];

        itemData.push(`[${i.dayOfWeekString}] ${i.date} - ${i.disciplineAbbr}`);
        itemData.push(`Тип: ${i.kindOfWork}`);
        itemData.push(`Время: ${i.beginLesson} - ${i.endLesson}`);
        itemData.push(`Препод: ${i.lecturer}`);
        if (i.building !== '-') itemData.push(`Кабинет: ${i.auditorium} (${i.building})`);
        if (i.group) itemData.push(`Группа: ${i.group}`);

        [mainChat, spamChat].forEach((peerId) => {
          sendMessage(vk, { peerId, message: itemData.join('\n') });
        });
      });
    });
  },
};
