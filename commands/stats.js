const { getters: storeGetters } = require('../store');
const { texts } = require('../data/messages');

const { stats: statsTexts, status: statusTexts } = texts;

module.exports = {
  name: 'stats',
  aliases: ['statistics', 'st'],
  description: statsTexts.description,
  async execute(ctx, args) {
    const msg = [`${statsTexts.description}\n`];
    const stats = await storeGetters.getCommandStats(args.length && args[0])
      .catch(async () => {
        ctx.reply(statusTexts.databaseError);
        return false;
      });

    if (!stats) return;

    if (args.length && !Number.isInteger(stats)) {
      ctx.reply(statsTexts.status.noCommandStats);
      return;
    }

    if (!args.length && stats && Object.keys(stats).length === 0) {
      ctx.reply(statsTexts.status.noStats);
      return;
    }

    if (args.length) {
      ctx.send(`command stats\n\nname: ${args[0]}\ncalls: ${stats}`);
      return;
    }

    Object.entries(stats).forEach(([key, val]) => {
      const value = [];

      Object.entries(val).forEach(([k, v]) => {
        value.push(`\n- ${k}: ${v}`);
      });

      msg.push(`# ${key}: ${value.join('')}`);
    });

    ctx.send(msg.join('\n\n'));
  },
};
