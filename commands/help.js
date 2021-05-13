const findCommand = require('../util/findCommand');

module.exports = {
  name: 'help',
  description: 'Получает информацию по командам',
  aliases: ['h', 'commands'],
  async execute(ctx, args, vk) {
    const { commands } = vk;
    const data = [];

    if (!args.length) {
      data.push('Список моих командуcов:\n');
      commands.forEach((c) => data.push(`/${c.name} - ${c.description}`));
      return ctx.send(data.join('\n'));
    }

    const requestedCommand = args[0];
    const command = findCommand(requestedCommand, commands);

    if (!command) return ctx.send('Я не нашел эту команду в своем крутейшем списке');

    data.push(`Name: ${command.name}`);
    if (command.description) data.push(`Description: ${command.description}`);
    if (command.aliases) data.push(`Aliases: ${command.aliases.join(', ')}`);

    if (command.arguments) {
      const commandArgs = [];
      Object.values(command.arguments).forEach((c) => {
        commandArgs.push(`${c.name} - ${c.description}`);
      });

      data.push(`Arguments: \n${commandArgs.join('\n')}`);
    }

    return ctx.send(data.join('\n'));
  },
};
