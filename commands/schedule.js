const { format, add } = require('../util/pdate');
const { serverDateFormat } = require('../config');
const pschedule = require('../functions/schedule');

module.exports = {
  name: 'schedule',
  description: 'Расписание на сегодняшний день',
  aliases: ['s', 'расписание', 'р'],
  usage: '',
  arguments: [
    {
      name: 'tw',
      description: 'расписание на завтра',
    },
    {
      name: 'week',
      description: 'расписание на неделю',
    },
  ],
  async execute(ctx, args) {
    const today = format(new Date(), serverDateFormat);
    const tomorrow = format(add(new Date()), serverDateFormat);

    const [command] = args;

    const argsInstructions = {
      week: {
        name: 'неделю',
      },
      tw: {
        name: 'завтра',
        start: tomorrow,
        finish: tomorrow,
      },
      empty: {
        name: 'сегодня',
        start: today,
        finish: today,
      },
    };

    if (command && (command === 'empty' || !argsInstructions[command])) {
      ctx.reply(`не знаю, что за аргумент такой "${command}"`);
      return;
    }

    const selectedDate = argsInstructions[!args.length ? 'empty' : command];
    const { schedule } = await pschedule.get(selectedDate) || {};

    if (typeof schedule !== 'object' && !Array.isArray(schedule)) {
      await ctx.send('Ебаные сервера МЭИ снова не отвечают');
      return;
    }

    await ctx.send(`Расписание на ${selectedDate.name}`);

    // if schedule data exists
    if (Array.isArray(schedule) && schedule.length <= 0) {
      ctx.send('Занятий нет 😎');
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
