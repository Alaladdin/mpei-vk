const { getCommand, isAdmin } = require('../helpers');
const { texts } = require('../data/messages');

module.exports = {
  name       : 'help',
  description: 'информация по командам',
  aliases    : ['h', 'commands'],
  arguments  : [{ name: 'all', description: 'выводит полный список команд' }],
  getAllCommandsInfo(ctx, args, vk) {
    const showAllCommandsForce = args[0] === 'all';
    const msg = [];

    msg.push(`${texts.commandsList}:\n`);

    vk.commands.forEach((c) => (showAllCommandsForce || !c.hidden) && msg.push(`/${c.name} - ${c.description}`));
    return ctx.send(msg.join('\n'));
  },
  getCommandInfo(ctx, args, vk) {
    const command = getCommand(vk.commands, args[0]);
    const msg = [];

    msg.push(`Команда: ${command.name}`);
    msg.push(`Описание: ${command.description}`);

    if (command.aliases) msg.push(`Алиасы: ${command.aliases.join(', ')}`);

    if (command.arguments) {
      if (typeof command.arguments[0] === 'string') {
        msg.push(`Аргументы: \n${command.arguments.join(', ')}`);
      } else {
        const commandArgs = [];

        command.arguments.forEach((c) => {
          commandArgs.push(`${c.name} - ${c.description}`);
        });

        msg.push(`Аргументы: \n${commandArgs.join('\n')}`);
      }
    }

    return ctx.send(msg.join('\n'), { dont_parse_links: true });
  },
  async execute(ctx, args, vk) {
    const command = getCommand(vk.commands, args[0]);
    const isUnknownCommand = !command || (command.hidden && !isAdmin(ctx.peerId));

    if (!args.length || args[0] === 'all') return this.getAllCommandsInfo(ctx, args, vk);
    if (isUnknownCommand) return ctx.send(texts.unknownCommand);

    return this.getCommandInfo(ctx, args, vk);
  },
};
