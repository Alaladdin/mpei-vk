const rand = require('../util/random');

module.exports = {
  name: 'random',
  aliases: ['rand'],
  description: 'генератор случайных чисел',
  lowercaseArguments: false,
  arguments: [
    {
      name: 'min (int)',
      description: 'минимальное число',
    },
    {
      name: 'max (int)',
      description: 'максимальное число',
    },
  ],
  async execute(ctx, args) {
    const msg = [];
    const min = args[1] ? (parseInt(args[0], 10) || 0) : 0;
    const max = parseInt(args[1] || args[0], 10) || 10;
    const minVal = max > min ? min : max;
    const maxVal = max > min ? max : min;

    msg.push(`Генерируем число от ${minVal} до ${maxVal}`);
    msg.push(`Результат: ${rand.int({ min, max })}`);

    ctx.send(msg.join('\n'));
  },
};
