const { getRandomArrayItem } = require('../helpers');
const { trollings } = require('../data/messages');

module.exports = {
  name              : 'troll',
  description       : 'троллит, притом жейско. Используйте с осторожностью, вы запросто можете ранить чьи-то чувства',
  aliases           : ['t'],
  lowercaseArguments: false,
  async execute(ctx, args) {
    if (!args.length) return ctx.reply('Кого троллить то?');

    const name = args.join(' ');
    const trolling = getRandomArrayItem(trollings);

    return ctx.send(trolling.replace('{name}', name));
  },
};
