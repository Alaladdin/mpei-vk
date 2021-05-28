const rand = require('../util/random');
const trollings = require('../data/trollings');

module.exports = {
  name: 'troll',
  description: 'Троллит, притом жейско. Используйте с осторожностью, вы запросто можете ранить чьи-то чувства',
  aliases: ['t'],
  lowercaseArguments: false,
  async execute(ctx, args) {
    let s = trollings.default; // selected trolligns array
    const randomTrolling = () => s[rand.int(s.length)];

    if (!args || !args.length) {
      ctx.reply('Кого троллить то?');
      return;
    }

    if (args && args[0] === '_') {
      ctx.send(randomTrolling());
      return;
    }

    s = trollings.all;
    ctx.send(`${args.join(' ')} ${randomTrolling()}`);
  },
};
