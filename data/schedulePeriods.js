const { texts } = require('./messages');
const { formatDate, addToDate } = require('../helpers');
const { serverDateFormat } = require('../config');

module.exports = {
  getSchedulePeriod(periodKey) {
    const schedulePeriods = this.getSchedulePeriods();

    return schedulePeriods[periodKey] || schedulePeriods.empty;
  },
  getSchedulePeriods() {
    const currDate = new Date();
    const today = formatDate(currDate, serverDateFormat);
    const tomorrow = formatDate(addToDate(currDate), serverDateFormat);
    const weekFinish = formatDate(addToDate(today, { weeks: 1 }), serverDateFormat);
    const monthFinish = formatDate(addToDate(today, { months: '1' }), serverDateFormat);

    return {
      tw: {
        name  : texts.tomorrow,
        start : tomorrow,
        finish: tomorrow,
      },
      week: {
        name  : texts.week,
        start : today,
        finish: weekFinish,
      },
      month: {
        name  : texts.month,
        start : today,
        finish: monthFinish,
      },
      empty: {
        name  : texts.today,
        start : today,
        finish: today,
      },
    };
  },
};
