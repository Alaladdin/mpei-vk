const Markup = require('node-vk-bot-api/lib/markup');
const keyboard = require('../data/keyboard');

module.exports = {
  name: 's',
  aliases: ['start'],
  description: 'Инициализация',

  execute(bot, ctx) {
    ctx.reply('Клавиатура включена', null,
      Markup.keyboard(keyboard, { columns: 2 }));
  },
};
