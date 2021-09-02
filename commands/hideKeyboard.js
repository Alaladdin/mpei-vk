const { Keyboard } = require('vk-io');
const { isAdmin } = require('../helpers');

module.exports = {
  name: 'hide',
  description: 'скрывает клавиатуру',
  hidden: true,
  async execute(ctx) {
    if (!isAdmin(ctx.senderId) && ctx.peerType !== 'user') return;

    await ctx.send({
      message: 'Клавиатура выключена',
      keyboard: Keyboard.builder(),
    });
  },
};
