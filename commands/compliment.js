const rand = require('../util/random');
const compliments = require('../data/compliments');

module.exports = {
  name: 'compliment',
  description: 'Утопляет комплиментами. Осторожно, чрезмерное использование может привести к дружелюбной обстановке',
  aliases: ['c'],
  lowercaseArguments: false,
  getRandomCompliment(list = compliments.all) {
    const randIndex = rand.int({ max: list.length - 1 });
    return list[randIndex];
  },
  async execute(ctx, args) {
    if (!args.length) return ctx.reply('Кому направить комплимент?');

    const name = args.join(' ');
    const compliment = this.getRandomCompliment();

    return ctx.send(compliment.replace('{name}', name));
  },
};
