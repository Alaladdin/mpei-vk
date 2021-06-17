const { Keyboard } = require('vk-io');
const isAdmin = require('../functions/isAdmin');

module.exports = {
  name: 'start',
  description: 'включает клавиатуру',
  async execute(ctx) {
    if (!isAdmin(ctx.senderId) && ctx.peerType !== 'user') return;

    await ctx.send({
      message: 'Клавиатура включена',
      keyboard: Keyboard
        .builder()
        .urlButton({
          label: 'Открыть сайт',
          url: 'https://mpei.space',
        })
        .urlButton({
          label: 'Скачать win-клиент',
          url: 'https://mpei.space/win',
        })
        .row()
        .textButton({
          label: 'Ленивая актуалочка',
          payload: {
            command: '/actuality lazy',
          },
        })
        .textButton({
          label: 'Актуалочка',
          payload: {
            command: '/actuality',
          },
        })
        .row()
        .textButton({
          label: 'Расписание',
          payload: {
            command: '/schedule',
          },
        }),
    });
  },
};
