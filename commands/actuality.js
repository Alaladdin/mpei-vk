const { format } = require('../util/pdate');
const pactuality = require('../functions/actuality');

module.exports = {
  name: 'actuality',
  description: 'Получает "актуалочку"',
  aliases: ['a', 'act', 'news', 'акт'],
  arguments: [
    {
      name: 'lazy',
      description: 'несрочная актуалочка',
    },
  ],
  async execute(ctx, args) {
    const { actuality } = await pactuality.get().catch(() => ctx.send('Непредвиденская ошибка. Кто-то украл данные из БД'));
    const [command] = args;
    const msg = [];

    if (!actuality) return;

    if (command && command.toLowerCase() === 'lazy') {
      msg.push('Несрочное актуалити\n');
      msg.push(actuality.lazyContent);

      ctx.send(msg.join('\n'));
      return;
    }

    msg.push(`Актуалити. Обновлено: ${format(actuality.date)}\n`);
    msg.push(`${actuality.content}`);

    ctx.send(msg.join('\n'));
  },
};
