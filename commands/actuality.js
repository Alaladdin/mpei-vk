const fetch = require('node-fetch');
const { serverAddress } = require('../config');
const pdate = require('../utility/pdate');

module.exports = {
  name: 'actuality',
  description: 'Получает "актуалочку"',
  aliases: ['a', 'act', 'news', 'акт'],
  async execute(ctx) {
    ctx.send('Получаю данные с сервера');

    const { actuality } = await this.get() || {};
    const msg = [];

    // check, exists actuality data or not
    if (actuality && 'content' in actuality) {
      msg.push(`Актуалочка. Обновлено: ${pdate.format(actuality.date, 'ru-RU')}\n`);
      msg.push(`${actuality.content}`);
    } else {
      msg.push('Непредвиденская ошибка. Кто-то украл данные из БД');
    }

    ctx.send(msg.join('\n'));
  },
  async get() {
    // get actuality data
    return fetch(`${serverAddress}/api/getActuality`)
      .then(async (res) => {
        const json = await res.json();

        // if request error
        if (!res.ok) throw new Error(json.error);

        return json;
      })
      .catch(console.error);
  },
};
