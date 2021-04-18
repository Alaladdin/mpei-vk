const rand = require('../utility/random');
const trollings = require('../data/trollings');

module.exports = {
  name: 'troll',
  description: 'Троллит, притом жейско. Используйте с осторожностью, вы запросто можете ранить чьи-то чувства',
  aliases: ['t'],
  async execute(ctx, args) {
    let s = trollings.default; // selected trolligns array
    const randomTrolling = () => s[rand.int(s.length)];

    if (!args || !args.length) {
      ctx.send(randomTrolling());
      return;
    }

    s = trollings.all;
    ctx.send(`${args.join(' ')} ${randomTrolling()}`);
  },
};
