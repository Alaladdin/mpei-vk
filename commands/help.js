module.exports = {
  name: 'h',
  aliases: ['help', 'commands'],
  async execute(bot, ctx) {
    const { commands } = bot;
    const data = [];

    data.push('Список моих командуcов:');
    commands.forEach((c) => data.push(`/${c.name}`));

    return ctx.reply(data.join('\n'));
  },
};
