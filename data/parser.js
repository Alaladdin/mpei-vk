const schedule = require('node-schedule');
const { mailSchedule } = require('../config');
const { mailParser } = require('../functions/mailParser');

module.exports = {
  name: 'commands',
  description: 'set mail parser',
  async init(vk) {
    console.info({ mailSchedule });
    schedule.scheduleJob(mailSchedule, () => mailParser(vk));
  },
};
