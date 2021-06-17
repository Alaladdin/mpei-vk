const { Keyboard } = require('vk-io');
const isAdmin = require('../functions/isAdmin');

module.exports = {
  name: 'hide',
  description: 'скрывает клавиатуру',
  async execute(ctx) {
    if (!isAdmin(ctx.senderId) && ctx.peerType !== 'user') return;

    await ctx.send({
      message: 'Клавиатура выключена',
      keyboard: Keyboard.builder(),
    });
  },
};
