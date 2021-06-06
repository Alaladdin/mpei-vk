const findCommand = require('../util/findCommand');
const { texts } = require('../data/messages');
const priority = require('../data/priority');

const { commands: commandsTexts } = texts;

module.exports = {
  name: 'help',
  description: 'Получает информацию по командам',
  aliases: ['h', 'commands'],
  arguments: [
    {
      name: 'all',
      description: 'выводит полный список команд',
    },
  ],
  async execute(ctx, args, vk) {
    const { commands } = vk;
    const data = [];
    const isAdminRequest = priority.admin.map((a) => a.userId).includes(ctx.peerId);
    const showAllCommandsForce = isAdminRequest && args[0] === 'all';
    if (!args.length || args[0] === 'all') {
      data.push(`${commandsTexts.commandsList}:\n`);

      commands.forEach((c) => (showAllCommandsForce || !c.hidden) && data.push(`/${c.name} - ${c.description}`));
      return ctx.send(data.join('\n'));
    }

    const requestedCommand = args[0];
    const command = findCommand(requestedCommand, commands);

    if (!command || (command.hidden && !isAdminRequest)) {
      return ctx.send(commandsTexts.unknownCommand);
    }

    data.push(`Name: ${command.name}`);
    if (command.description) data.push(`Description: ${command.description}`);
    if (command.aliases) data.push(`Aliases: ${command.aliases.join(', ')}`);

    if (command.arguments) {
      if (typeof command.arguments[0] === 'string') {
        data.push(`Arguments: \n${command.arguments.join(', ')}`);
      } else {
        const commandArgs = [];

        command.arguments.forEach((c) => {
          commandArgs.push(`${c.name} - ${c.description}`);
        });

        data.push(`Arguments: \n${commandArgs.join('\n')}`);
      }
    }

    return ctx.send(data.join('\n'));
  },
};
