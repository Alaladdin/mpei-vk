const { getCommand } = require('../helpers');
const { texts } = require('../data/messages');
const { sendAsImage } = require('../functions');

module.exports = {
  name       : 'help',
  description: 'информация по командам',
  aliases    : ['h', 'commands'],
  getAllCommandsInfo(ctx, args, vk) {
    const msg = [];

    msg.push(`${texts.commandsList}:\n`);

    vk.commands.forEach((c) => {
      msg.push(`/${c.name} - ${c.description}`);
    });

    return sendAsImage({ message: msg.join('\n'), peerId: ctx.peerId, vk })
      .catch(() => ctx.send(texts.totalCrash));
  },
  async getCommandInfo(ctx, args, vk) {
    const command = getCommand(vk.commands, args[0]);
    const msg = [];

    msg.push(`Команда: ${command.name}`);
    msg.push(`Описание: ${command.description}`);

    if (command.aliases)
      msg.push(`Алиасы: ${command.aliases.join(', ')}`);

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

    return sendAsImage({ message: msg.join('\n'), peerId: ctx.peerId, vk })
      .catch(() => ctx.send(texts.totalCrash));
  },
  async execute(ctx, args, vk) {
    const command = getCommand(vk.commands, args[0]);

    if (!args.length)
      return this.getAllCommandsInfo(ctx, args, vk);

    if (!command)
      return ctx.send(texts.unknownCommand);

    return this.getCommandInfo(ctx, args, vk);
  },
};
