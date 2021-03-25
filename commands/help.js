module.exports = {
  name: 'help',
  description: 'Получает информацию по командам',
  aliases: ['h', 'commands'],
  async execute(ctx, args, vk) {
    const { commands } = vk;
    const data = [];

    data.push('Список моих командуcов:\n');
    commands.forEach((c) => data.push(`/${c.name} - ${c.description}`));

    return ctx.send(data.join('\n'));
  },
};
