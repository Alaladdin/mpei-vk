const schedule = require('node-schedule');
const { each } = require('lodash');
const { serverDateFormat } = require('../config');
const { formatDate, handleError, removeFromDate, getDateDiffInMinutes } = require('../helpers');
const { getters: storeGetters } = require('../store');
const { getSchedule, getFormattedSchedule, sendAsImage } = require('../functions');

module.exports = {
  currentScheduleJob: null,
  async init(vk) {
    await this.createTodaySchedule(vk);

    schedule.scheduleJob('0 30 8 * * *', () => this.createTodaySchedule(vk));
  },
  async createTodaySchedule(vk) {
    const scheduleSubscribers = storeGetters.getScheduleSubscribers();

    if (scheduleSubscribers.length) {
      const todayDate = this.getTodayDate();
      const scheduleData = await getSchedule(todayDate, todayDate).catch((err) => handleError(err, vk));

      if (scheduleData && scheduleData.length) {
        const lessonDate = new Date(`${todayDate} ${scheduleData[0].beginLesson}`);
        const lessonDateWithOffset = removeFromDate(lessonDate, { minutes: 10 });
        const diffDate = getDateDiffInMinutes(new Date(), lessonDateWithOffset);

        schedule.cancelJob(this.currentScheduleJob);

        if (diffDate >= 0 && diffDate <= 10)
          await this.sendSchedule(vk);
        else
          this.currentScheduleJob = schedule.scheduleJob(lessonDateWithOffset, () => this.sendSchedule(vk));
      }
    }
  },
  async sendSchedule(vk) {
    const scheduleSubscribers = storeGetters.getScheduleSubscribers();
    const scheduleData = await this.getTodaySchedule();

    if (!scheduleData)
      return handleError('[SCHEDULE SUBSCRIBERS CRON] No schedule data', vk);

    return each(scheduleSubscribers, (chatId) => {
      sendAsImage({ message: scheduleData, peerId: chatId, vk })
        .catch((err) => handleError(err, vk));
    });
  },
  async getTodaySchedule() {
    const todayDate = this.getTodayDate();

    return getFormattedSchedule(['all'], { start: todayDate, finish: todayDate });
  },
  getTodayDate() {
    return formatDate(new Date(), serverDateFormat);
  },
};
