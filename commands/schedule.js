const { startOfISOWeek, endOfISOWeek } = require('date-fns');
const { format, add } = require('../util/pdate');
const { serverDateFormat } = require('../config');
const pschedule = require('../functions/schedule');
const { texts } = require('../data/messages');

const {
  status: statusTexts,
  schedule: scheduleTexts,
  commands: commandsTexts,
} = texts;

module.exports = {
  name: 'schedule',
  description: scheduleTexts.arguments.tomorrowFull,
  aliases: ['s', 'расписание', 'р'],
  arguments: [
    {
      name: 'tw',
      description: scheduleTexts.arguments.tomorrowFull.toLowerCase(),
    },
    {
      name: 'week',
      description: scheduleTexts.arguments.weekFull.toLowerCase(),
    },
    {
      name: 'nextWeek',
      description: scheduleTexts.arguments.nextWeekFull.toLowerCase(),
    },
    {
      name: 'month',
      description: scheduleTexts.arguments.monthFull.toLowerCase(),
    },
  ],
  async execute(ctx, args) {
    const today = format(new Date(), serverDateFormat);
    const tomorrow = format(add(new Date()), serverDateFormat);

    const [command] = args;

    const argsInstructions = {
      tw: {
        name: scheduleTexts.arguments.tomorrow,
        start: tomorrow,
        finish: tomorrow,
      },
      week: {
        name: scheduleTexts.arguments.week,
      },
      nextWeek: {
        name: scheduleTexts.arguments.nextWeek,
        start: format(startOfISOWeek(add(today, { weeks: 1 })), serverDateFormat),
        finish: format(endOfISOWeek(add(today, { weeks: 1 })), serverDateFormat),
      },
      month: {
        name: scheduleTexts.arguments.month,
        start: today,
        finish: format(add(today, { months: '1' }), serverDateFormat),
      },
      empty: {
        name: scheduleTexts.arguments.today,
        start: today,
        finish: today,
      },
    };

    if (command && (command === 'empty' || !argsInstructions[command])) {
      ctx.reply(`${commandsTexts.unknownArgument} "${command}"`);
      return;
    }

    const selectedDate = argsInstructions[!args.length ? 'empty' : command];
    const { schedule } = await pschedule.get(selectedDate) || {};

    if (typeof schedule !== 'object' && !Array.isArray(schedule)) {
      await ctx.send(statusTexts.mpeiServerError);
      return;
    }

    await ctx.send(`${scheduleTexts.scheduleFor} ${selectedDate.name}`);

    // if schedule data exists
    if (Array.isArray(schedule) && schedule.length <= 0) {
      ctx.send(scheduleTexts.noClasses);
      return;
    }

    schedule.forEach((item) => {
      const itemData = [];
      const {
        date,
        discipline,
        dayOfWeekString,
        kindOfWork,
        beginLesson,
        endLesson,
        lecturer,
      } = item;

      itemData.push(`[${dayOfWeekString}] ${discipline} - ${format(date)}`);
      itemData.push(kindOfWork);
      itemData.push(`${beginLesson} - ${endLesson}`);
      itemData.push(lecturer);

      return ctx.send(itemData.join('\n'));
    });
  },
};
