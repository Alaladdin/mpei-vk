const { prefix } = require('../config');
const priority = require('../data/priority');

module.exports = {
  name: 'message',
  async execute(ctx, next, vk) {
    const { messagePayload, text } = ctx;
    if ((!messagePayload && (!text || !text.startsWith(prefix))) || !ctx.isUser) return;

    // check for user id in black list
    if (priority.blackList.includes(ctx.senderId)) return;

    const commandBody = (messagePayload && messagePayload.command)
      ? messagePayload.command.slice(prefix.length)
      : text.slice(prefix.length);

    const args = commandBody.split(' ');
    const commandName = args.shift().toLowerCase();

    const findCommand = (commandsList, lookingCommand) => {
      const newMap = new Map([...commandsList]
        .filter(([k, v]) => v.aliases && v.aliases.includes(lookingCommand)));

      const arr = Array.from(newMap);

      if (arr.length) return arr[0][1];
    };

    // get command by name or alias
    const command = vk.commands.get(commandName) || findCommand(vk.commands, commandName);

    // call command
    if (command) command.execute(ctx, args, vk);
  },
};
