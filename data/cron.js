const actualitySchedule = require('../cron/actuality');
const scheduleSchedule = require('../cron/schedule');
const birthdaySchedule = require('../cron/birthday');

module.exports = {
  name: 'crons',
  description: 'set cron',
  async init(vk) {
    await actualitySchedule.execute(vk);
    await scheduleSchedule.execute(vk);
    await birthdaySchedule.execute(vk);
  },
};
