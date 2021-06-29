const schedule = require('node-schedule');
const { mailSchedule } = require('../config');
const { mailParser } = require('../functions/mailParser');
const { mailParserEnabled } = require('../config');

module.exports = {
  name: 'commands',
  description: 'set mail parser',
  async init(vk) {
    if (mailParserEnabled) {
      console.info({ mailSchedule });
      schedule.scheduleJob(mailSchedule, () => mailParser(vk));
    }
  },
};
