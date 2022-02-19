const schedule = require('node-schedule');
const { each } = require('lodash');
const { serverDateFormat } = require('../config');
const { formatDate, removeFromDate } = require('../helpers');
const { getters: storeGetters } = require('../store');
const { getSchedule: getRawSchedule, getFormattedSchedule, sendAsImage } = require('../functions');

module.exports = {
  currentSchedule: null,
  async init(vk) {
    schedule.scheduleJob('0 30 * * *', async () => {
      const scheduleSubscribers = storeGetters.getScheduleSubscribers();

      if (scheduleSubscribers.length) {
        const scheduleData = await this.getTodayRawSchedule();

        if (scheduleData) {
          const { beginLesson } = scheduleData[0];
          const todayDate = formatDate(new Date(), 'yyyy.MM.dd');
          const todayFullDate = new Date(`${todayDate} ${beginLesson}`);
          const notifyDate = removeFromDate(todayFullDate, { minutes: 10 });

          await this.createSchedule(notifyDate, vk);
        }
      }
    });
  },
  async createSchedule(date, vk) {
    const scheduleSubscribers = storeGetters.getScheduleSubscribers();
    const scheduleData = await this.getTodaySchedule();

    schedule.cancelJob(this.currentSchedule);

    this.currentSchedule = schedule.scheduleJob(date, () => {
      each(scheduleSubscribers, (chatId) => {
        sendAsImage({ message: scheduleData, peerId: chatId, vk })
          .catch(console.error);
      });

      schedule.cancelJob(this.currentSchedule);
    });
  },
  async getTodayRawSchedule() {
    const today = formatDate(new Date(), serverDateFormat);

    return getRawSchedule(today, today);
  },
  async getTodaySchedule() {
    const today = formatDate(new Date(), serverDateFormat);

    return getFormattedSchedule(['all'], { start: today, finish: today });
  },
};
