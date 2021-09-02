const { getRandomArrayItem } = require('../helpers');
const { compliments } = require('../data/messages');

module.exports = {
  name: 'compliment',
  description: 'утопляет комплиментами. Осторожно, чрезмерное использование может привести к дружелюбной обстановке',
  aliases: ['c'],
  lowercaseArguments: false,
  async execute(ctx, args) {
    if (!args.length) return ctx.reply('Кому направить комплимент?');

    const name = args.join(' ');
    const compliment = getRandomArrayItem(compliments);

    return ctx.send(compliment.replace('{name}', name));
  },
};
