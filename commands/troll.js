const rand = require('../util/random');
const trollings = require('../data/trollings');
const { german: germanPattern } = require('../data/regex');
const getUsers = require('../functions/getUsers');

module.exports = {
  name: 'troll',
  description: 'троллит, притом жейско. Используйте с осторожностью, вы запросто можете ранить чьи-то чувства',
  aliases: ['t'],
  lowercaseArguments: false,
  getRandomTrolling(list = trollings.all) {
    const randIndex = rand.int({ max: list.length - 1 });
    return list[randIndex];
  },
  async execute(ctx, args, vk) {
    if (!args.length) return ctx.reply('Кого троллить то?');
    if (args[0] === '_') return ctx.send(this.getRandomTrolling(trollings.voron));

    const name = args.join(' ');

    if (name.match(germanPattern)) {
      const userToTroll = await getUsers(vk, { userIds: ctx.senderId }).catch(() => {
      });
      const userName = userToTroll && userToTroll.length && userToTroll[0].first_name;
      return ctx.reply(`${userName || 'Сегодня никто не'} воняет`);
    }

    return ctx.send(`${name} ${this.getRandomTrolling()}`);
  },
};
