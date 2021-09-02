const { Keyboard } = require('vk-io');
const { isAdmin } = require('../helpers');

module.exports = {
  name: 'start',
  description: 'включает клавиатуру',
  hidden: true,
  async execute(ctx) {
    if (!isAdmin(ctx.senderId) && ctx.peerType !== 'user') return;

    await ctx.send({
      message: 'Клавиатура включена',
      keyboard: Keyboard
        .builder()
        .urlButton({ label: 'Открыть сайт', url: 'https://mpei.space' })
        .urlButton({ label: 'Win-клиент актуалочки', url: 'https://mpei.space/win' })
        .row()
        .textButton({ label: 'Актуалочка', payload: { command: '/actuality' } })
        .textButton({ label: 'Ленивая актуалочка', payload: { command: '/actuality lazy' } })
        .row()
        .textButton({ label: 'Расписание', payload: { command: '/schedule' } }),
    });
  },
};
