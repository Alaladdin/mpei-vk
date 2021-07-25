const rand = require('../util/random');
const trollings = require('../data/trollings');

module.exports = {
  name: 'troll',
  description: 'троллит, притом жейско. Используйте с осторожностью, вы запросто можете ранить чьи-то чувства',
  aliases: ['t'],
  lowercaseArguments: false,
  getRandomTrolling(list = trollings.all) {
    const randIndex = rand.int({ max: list.length - 1 });
    return list[randIndex];
  },
  async execute(ctx, args) {
    if (!args.length) {
      ctx.reply('Кого троллить то?');
    } else if (args[0] === '_') {
      ctx.send(this.getRandomTrolling(trollings.voron));
    } else {
      ctx.send(`${args.join(' ')} ${this.getRandomTrolling()}`);
    }
  },
};
