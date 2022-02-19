const schedule = require('node-schedule');
const { chats, serverDateFormat } = require('../config');
const { formatDate, handleError } = require('../helpers');
const { getFormattedSchedule, sendAsImage } = require('../functions');

module.exports = {
  async init(vk) {
    schedule.scheduleJob('0 5 9 * * *', async () => {
      const today = formatDate(new Date(), serverDateFormat);
      const scheduleData = await getFormattedSchedule([], { start: today, finish: today });

      if (scheduleData) {
        sendAsImage({ message: scheduleData, title: 'Расписание на сегодня', peerId: chats.main, vk })
          .catch((error) => handleError(error, vk));
      }
    });
  },
};
