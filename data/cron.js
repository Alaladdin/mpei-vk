const schedule = require('node-schedule');
const { format } = require('../util/pdate');
const pactuality = require('../functions/actuality');
const pschedule = require('../functions/schedule');
const rand = require('../util/random');
const { chatIds, serverDateFormat } = require('../config');

module.exports = {
  name: 'crons',
  description: 'set cron',
  async init(vk) {
    // actuality every day at 9:00:00
    schedule.scheduleJob('0 0 9 * * *', async () => {
      const { actuality } = await pactuality.get();

      if (actuality && 'content' in actuality) {
        const msg = [];
        msg.push(`Актуалити. Обновлено: ${format(actuality.date)}\n`);
        msg.push(`${actuality.content}`);

        chatIds.forEach((chat) => {
          vk.api.messages.send({
            peer_id: chat.peerId,
            random_id: rand.int(999),
            message: msg.join('\n'),
          });
        });
      }
    });

    // schedule every day at 9:05:00
    schedule.scheduleJob('0 5 9 * * *', async () => {
      const today = format(new Date(), serverDateFormat);
      const s = await pschedule.get({ start: today, finish: today });
      const scheduleToday = s.schedule || null;

      if (typeof scheduleToday !== 'object' && !Array.isArray(scheduleToday)) return;

      scheduleToday.forEach((item) => {
        const itemData = [];

        const {
          date,
          discipline,
          dayOfWeekString,
          kindOfWork,
          beginLesson,
          endLesson,
          lecturer,
        } = item;

        itemData.push(`[${dayOfWeekString}] ${discipline} - ${format(date)}`);
        itemData.push(kindOfWork);
        itemData.push(`${beginLesson} - ${endLesson}`);
        itemData.push(lecturer);

        chatIds.forEach((chat) => {
          vk.api.messages.send({
            peer_id: chat.peerId,
            random_id: rand.int(999),
            message: itemData.join('\n'),
          });
        });
      });
    });
  },
};
