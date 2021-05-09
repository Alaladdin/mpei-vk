const schedule = require('node-schedule');
const { mailSchedule } = require('../config');
const { mailParser } = require('../functions/mailParser');
const { mpeiParserEnable } = require('../config');

module.exports = {
  name: 'commands',
  description: 'set mail parser',
  async init(vk) {
    if (mpeiParserEnable) {
      console.info({ mailSchedule });
      schedule.scheduleJob(mailSchedule, () => mailParser(vk));
    }
  },
};
