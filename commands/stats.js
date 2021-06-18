const isAdmin = require('../functions/isAdmin');
const { getters: storeGetters, setters: storeSetters } = require('../store');
const { texts } = require('../data/messages');

const { stats: statsTexts, status: statusTexts } = texts;

module.exports = {
  name: 'stats',
  aliases: ['statistics', 'st'],
  description: statsTexts.description,
  arguments: [
    {
      name: 'reset',
      description: 'чистит статистику',
    },
  ],
  async execute(ctx, args) {
    const msg = [`${statsTexts.description}\n`];
    const stats = await storeGetters.getCommandStats()
      .catch(async () => {
        ctx.reply(statusTexts.databaseError);
        return false;
      });

    if (args[0] === 'reset' && isAdmin(ctx.senderId)) {
      await storeSetters.resetCommandStats();
      ctx.reply(statsTexts.status.statsCleared);
    }

    if (!stats) return;

    if (stats && Object.keys(stats).length === 0) {
      ctx.reply(statsTexts.status.noStats);
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
