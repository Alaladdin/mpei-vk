const fetch = require('node-fetch');
const { serverAddress } = require('../config');

module.exports = {
  name: 'a',
  description: 'Получает "актуалочку"',
  aliases: ['actuality', 'act', 'news', 'акт'],
  async execute(bot, ctx) {
    const { actuality } = await this.get(ctx) || {};

    // if actuality data exists
    if (actuality && 'content' in actuality) {
      ctx.reply(actuality.content);
    } else {
      ctx.reply('Непредвиденская ошибка. Кто-то украл данные из БД');
    }
  },
  async get(ctx) {
    // get actuality data
    return fetch(`${serverAddress}/api/getActuality`)
      .then(async (res) => {
        const json = await res.json();

        // if request error
        if (!res.ok) {
          if (res.status === 404) return ctx.reply(json.error);
          throw new Error(json.error);
        }
        return json;
      })
      .catch(async (err) => {
        console.error(err);
        await ctx.reply('Ошибка при попытке получить актуалочку');
      });
  },
};
