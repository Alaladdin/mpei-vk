const Markup = require('node-vk-bot-api/lib/markup');

module.exports = {
  name: 'hide',
  description: 'Скрывает клавиатуру',

  execute(bot, ctx) {
    ctx.reply('Клавиатура скрыта', null,
      Markup.keyboard([]));
  },
};
