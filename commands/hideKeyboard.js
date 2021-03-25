const { Keyboard } = require('vk-io');

module.exports = {
  name: 'hide',
  description: 'Скрывает клавиатуру',
  async execute(ctx) {
    await ctx.send({
      message: 'Клавиатура выключена',
      keyboard: Keyboard.builder(),
    });
  },
};
