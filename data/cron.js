const actualitySchedule = require('../cron/actuality');
const scheduleSchedule = require('../cron/schedule');
const birthdaySchedule = require('../cron/birthday');

module.exports = {
  name       : 'crons',
  description: 'set crons',
  async init(vk) {
    await actualitySchedule.init(vk);
    await scheduleSchedule.init(vk);
    await birthdaySchedule.init(vk);
  },
};
