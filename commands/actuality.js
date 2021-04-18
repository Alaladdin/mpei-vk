const pdate = require('../utility/pdate');
const pactuality = require('../functions/actuality');

module.exports = {
  name: 'actuality',
  description: 'Получает "актуалочку"',
  aliases: ['a', 'act', 'news', 'акт'],
  async execute(ctx) {
    const { actuality } = await pactuality.get() || {};
    const msg = [];

    // check, exists actuality data or not
    if (actuality && 'content' in actuality) {
      msg.push(`Актуалити. Обновлено: ${pdate.format(actuality.date, 'ru-RU')}\n`);
      msg.push(`${actuality.content}`);
    } else {
      msg.push('Непредвиденская ошибка. Кто-то украл данные из БД');
    }

    ctx.send(msg.join('\n'));
  },
};
