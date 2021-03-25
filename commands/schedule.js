const fetch = require('node-fetch');
const pdate = require('../utility/pdate');
const { serverAddress } = require('../config');

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
    const today = new Date();
    const todayFormatted = pdate.format(today.toString());
    const tomorrow = pdate.format(new Date().setDate(today.getDate() + 1));

    const [command] = args;
    let [start, finish] = ['', ''];

    if (!args.length) {
      // check today's schedule
      [start, finish] = [todayFormatted, todayFormatted];
    } else if (['week', 'tw'].includes(command)) {
      // check tomorrow's schedule
      if (command === 'tw') [start, finish] = [tomorrow, tomorrow];
    } else {
      ctx.reply(`Не знаю, что за аргумент такой "${command}"`);
      return;
    }

    ctx
      .send('Получаю данные с сервера')
      .then(async () => {
        const { schedule } = await this.get(start, finish) || {};

        if (typeof schedule !== 'object' && !Array.isArray(schedule)) {
          await ctx.send('Ошибка при попытке получить расписание');
          return;
        }
        const scheduleDate = start === todayFormatted
          ? 'сегодня' : start === tomorrow
            ? 'завтра' : 'неделю';

        await ctx.send(`Расписание на ${scheduleDate}`);

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
            building,
            beginLesson,
            endLesson,
            lecturer,
          } = item;

          // itemData.push(`Группа: ${item.stream.replace(',', ', ')}`);
          itemData.push(`[${dayOfWeekString}] ${discipline} - ${pdate.format(date, 'ru-RU')}`);
          itemData.push(kindOfWork);
          if (building && building !== '-') itemData.push(`Здание: ${building}`);
          itemData.push(`${beginLesson} - ${endLesson}`);
          itemData.push(lecturer);

          return ctx.send(itemData.join('\n'));
        });
      });
  },
  async get(start, finish) {
    const url = new URL(`${serverAddress}/api/getSchedule/`);

    if (start) url.searchParams.append('start', start);
    if (finish) url.searchParams.append('finish', finish);

    return fetch(url.href)
      .then(async (res) => {
        const json = await res.json();

        // if request error
        if (!res.ok) throw new Error(json.error);

        return json;
      })
      .catch(console.error);
  },
};
