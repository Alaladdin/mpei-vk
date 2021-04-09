const pdate = require('../utility/pdate');
const pactuality = require('../functions/actuality');

module.exports = {
  name: 'actuality',
  description: 'Получает "актуалочку"',
  aliases: ['a', 'act', 'news', 'акт'],
  async execute(ctx, args, vk) {
    const { id } = await ctx.send('Получаю данные с сервера...');
    const { actuality } = await pactuality.get() || {};
    const msg = [];

    // check, exists actuality data or not
    if (actuality && 'content' in actuality) {
      msg.push(`Актуалочка. Обновлено: ${pdate.format(actuality.date, 'ru-RU')}\n`);
      msg.push(`${actuality.content}`);
    } else {
      msg.push('Непредвиденская ошибка. Кто-то украл данные из БД');
    }

    // deletes message "getting actuality", but only in chat with user
    if (ctx.isFromUser) {
      await vk.api.messages.delete({
        message_ids: id,
        delete_for_all: true,
      });
    }

    ctx.send(msg.join('\n'));
  },
};
