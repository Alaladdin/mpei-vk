const schedule = require('node-schedule');
const pdate = require('../utility/pdate');
const pactuality = require('../functions/actuality');
const pschedule = require('../functions/schedule');
const rand = require('../utility/random');
const { trolleos } = require('./trolleos');
const { chatIds } = require('../config');

module.exports = {
  name: 'crons',
  description: 'set cron',
  async init(vk) {
    // actuality every day at 9:00:00
    schedule.scheduleJob('0 0 9 * * *', async () => {
      const { actuality } = await pactuality.get();

      if (actuality && 'content' in actuality) {
        const msg = [];
        msg.push(`Актуалочка. Обновлено: ${pdate.format(actuality.date, 'ru-RU')}\n`);
        msg.push(`${actuality.content}`);

        chatIds.forEach((chat) => {
          console.log(1);
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
      const today = pdate.format(new Date().toString());
      const s = await pschedule.get({ start: today, finish: today });
      const scheduleToday = s.schedule || null;

      if (typeof scheduleToday !== 'object' && !Array.isArray(scheduleToday)) {
        return;
      }

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

        itemData.push(`[${dayOfWeekString}] ${discipline} - ${pdate.format(date, 'ru-RU')}`);
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

    // voronin trolleo every day at 9:10:00
    schedule.scheduleJob('0 10 9 * * *', () => {
      const randIndex = (arr) => rand.int(arr.length);

      chatIds.forEach(async (chat) => {
        await vk.api.messages.send({
          peer_id: chat.peerId,
          random_id: rand.int(999),
          message: trolleos[randIndex(trolleos)],
        });
      });
    });
  },
};
