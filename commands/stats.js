const { getters: storeGetters } = require('../store');
const { texts } = require('../data/messages');

const { stats: statsTexts } = texts;

module.exports = {
  name: 'stats',
  aliases: ['statistics', 'st'],
  description: statsTexts.description,
  async execute(ctx, args) {
    const msg = [`${statsTexts.description}\n`];
    const stats = await storeGetters.getCommandStats(args.length && args[0]);

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

    const sortedStats = stats && Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    Object.entries(sortedStats).forEach(([key, val]) => msg.push(`${key}: ${val}`));

    ctx.send(msg.join('\n'));
  },
};
