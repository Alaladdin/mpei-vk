const pdate = require('../utility/pdate');
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
    const today = pdate.format(new Date().toString());
    const tomorrow = pdate.format(new Date().setDate(new Date().getDate() + 1));
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
      await ctx.send('Ошибка при попытке получить расписание 😢');
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

      itemData.push(`[${dayOfWeekString}] ${discipline} - ${pdate.format(date, 'ru-RU')}`);
      itemData.push(kindOfWork);
      itemData.push(`${beginLesson} - ${endLesson}`);
      itemData.push(lecturer);

      return ctx.send(itemData.join('\n'));
    });
  },
};
