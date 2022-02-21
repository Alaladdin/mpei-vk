const schedule = require('node-schedule');
const { each } = require('lodash');
const { serverDateFormat } = require('../config');
const { formatDate, getDateDiffInMinutes, handleError } = require('../helpers');
const { getters: storeGetters } = require('../store');
const { getSchedule: getRawSchedule, getFormattedSchedule, sendAsImage } = require('../functions');

module.exports = {
  async init(vk) {
    schedule.scheduleJob('*/30 * * * *', async () => {
      const scheduleSubscribers = storeGetters.getScheduleSubscribers();

      if (scheduleSubscribers.length) {
        const scheduleData = await this.getTodayRawSchedule(vk);

        if (scheduleData && scheduleData.length) {
          const dateDiff = this.getDiffDateFromLesson(scheduleData[0].beginLesson);

          if (dateDiff >= 0 && dateDiff < 30)
            await this.sendSchedule(vk);
        }
      }
    });
  },
  getDiffDateFromLesson(beginLessonTime) {
    const todayDate = this.getTodayDate();
    const lessonDate = new Date(`${todayDate} ${beginLessonTime}`);

    return getDateDiffInMinutes(lessonDate, new Date());
  },
  async sendSchedule(vk) {
    const scheduleSubscribers = storeGetters.getScheduleSubscribers();
    const scheduleData = await this.getTodaySchedule();

    if (!scheduleData) {
      await handleError('No schedule data', vk);
    } else {
      each(scheduleSubscribers, (chatId) => {
        sendAsImage({ message: scheduleData, peerId: chatId, vk })
          .catch((err) => handleError(err, vk));
      });
    }
  },
  async getTodayRawSchedule(vk) {
    const todayDate = this.getTodayDate();

    return getRawSchedule(todayDate, todayDate)
      .catch((err) => handleError(err, vk));
  },
  async getTodaySchedule() {
    const todayDate = this.getTodayDate();

    return getFormattedSchedule(['all'], { start: todayDate, finish: todayDate });
  },
  getTodayDate() {
    return formatDate(new Date(), serverDateFormat);
  },
};
