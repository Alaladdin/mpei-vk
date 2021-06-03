const rand = require('../util/random');

module.exports = {
  name: 'random',
  aliases: ['rand'],
  description: 'Генератор случайных чисел',
  lowercaseArguments: false,
  async execute(ctx, args) {
    const msg = [];
    const maxNum = args[0] || 10;

    msg.push(`Генерируем число от 0 до ${maxNum}`);
    msg.push(`Результат: ${rand.int(maxNum)}`);

    ctx.send(msg.join('\n'));
  },
};
