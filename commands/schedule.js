const { startOfISOWeek, endOfISOWeek } = require('date-fns');
const { format, add } = require('../util/pdate');
const { serverDateFormat } = require('../config');
const pschedule = require('../functions/schedule');
const { texts } = require('../data/messages');

const { schedule: scheduleTexts } = texts;

module.exports = {
  name: 'schedule',
  description: scheduleTexts.description,
  aliases: ['s', 'расписание', 'р'],
  arguments: [
    {
      name: 'tw',
      description: scheduleTexts.arguments.tomorrowFull,
    },
    {
      name: 'week',
      description: scheduleTexts.arguments.weekFull,
    },
    {
      name: 'nextWeek',
      description: scheduleTexts.arguments.nextWeekFull,
    },
    {
      name: 'month',
      description: scheduleTexts.arguments.monthFull,
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
      nextweek: {
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

    if (command && (command === 'empty' || !argsInstructions[command])) return ctx.reply(`${texts.commands.unknownArgument} "${command}"`);

    const selectedDate = argsInstructions[!args.length ? 'empty' : command];

    return pschedule.get(selectedDate)
      .then(async ({ schedule }) => {
        if (!schedule.length) return ctx.send(scheduleTexts.noClasses);

        await ctx.send(`${scheduleTexts.scheduleFor} ${selectedDate.name}`);

        return schedule.forEach((item) => {
          const itemData = [];

          itemData.push(`[${item.dayOfWeekString}] ${item.discipline} - ${format(item.date)}`);
          itemData.push(item.kindOfWork);
          itemData.push(`${item.beginLesson} - ${item.endLesson}`);
          itemData.push(item.lecturer);

          return ctx.send(itemData.join('\n'));
        });
      })
      .catch(() => {
        ctx.send(texts.status.mpeiServerError);
      });
  },
};
