const { startOfISOWeek, endOfISOWeek } = require('date-fns');
const { formatDate, addToDate } = require('../helpers');
const { serverDateFormat } = require('../config');
const getSchedule = require('../functions/getSchedule');
const { texts } = require('../data/messages');

module.exports = {
  name       : 'schedule',
  description: texts.schedule,
  aliases    : ['s', 'расписание', 'р'],
  arguments  : [
    { name: 'tw', description: texts.forTomorrow },
    { name: 'week', description: texts.forWeek },
    { name: 'nextWeek', description: texts.forNextWeekFull },
    { name: 'month', description: texts.forMonth },
    { name: 'all', description: texts.all },
  ],
  async execute(ctx, args) {
    const today = formatDate(new Date(), serverDateFormat);
    const tomorrow = formatDate(addToDate(new Date()), serverDateFormat);
    const [command] = args;
    const argsInstructions = {
      tw: {
        name  : texts.tomorrow,
        start : tomorrow,
        finish: tomorrow,
      },
      week    : { name: texts.week },
      nextweek: {
        name  : texts.nextWeek,
        start : formatDate(startOfISOWeek(addToDate(today, { weeks: 1 })), serverDateFormat),
        finish: formatDate(endOfISOWeek(addToDate(today, { weeks: 1 })), serverDateFormat),
      },
      month: {
        name  : texts.month,
        start : today,
        finish: formatDate(addToDate(today, { months: '1' }), serverDateFormat),
      },
      empty: {
        name  : texts.today,
        start : today,
        finish: today,
      },
    };

    const showAllFields = args.includes('all');
    const selectedDate = argsInstructions[command] || argsInstructions.empty;
    const { start, finish } = selectedDate;

    return getSchedule(start, finish)
      .then(async (schedule) => {
        if (!schedule.length) return ctx.send(texts.noClasses);

        await ctx.send(`${texts.scheduleFor} ${selectedDate.name}`);

        return schedule.forEach((i) => {
          const itemData = [];

          itemData.push(`[${i.dayOfWeekString}] ${i.date} - ${i.disciplineAbbr}`);
          itemData.push(`Тип: ${i.kindOfWork}`);
          if (showAllFields) itemData.push(`Время: ${i.beginLesson} - ${i.endLesson}`);
          if (showAllFields) itemData.push(`Препод: ${i.lecturer}`);
          if (i.building !== '-') itemData.push(`Кабинет: ${i.auditorium} (${i.building})`);
          if (i.group) itemData.push(`Группа: ${i.group}`);

          return ctx.send(itemData.join('\n'));
        });
      })
      .catch(() => ctx.send(texts.mpeiServerError));
  },
};
