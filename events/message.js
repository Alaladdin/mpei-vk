const { prefix } = require('../config');
const { commandsStatsSetters } = require('../data/commandsStats');
const { execute: notAllowedMessages } = require('../functions/notAllowedMessages');
const priority = require('../data/priority');

module.exports = {
  name: 'message',
  async execute(ctx, next, vk) {
    const { messagePayload, text } = ctx;

    if ((!messagePayload && !text) || !ctx.isUser) return;

    const messagePrefix = text && prefix.includes(text[0]) && text[0];

    await notAllowedMessages(ctx, text);

    if (!messagePrefix) return;

    // check for user id in black list
    if (priority.blackList.includes(ctx.senderId)) return;

    const commandBody = (messagePayload && messagePayload.command)
      ? messagePayload.command.slice(messagePrefix.length)
      : text.slice(messagePrefix.length);

    let args = commandBody.split(' ').filter((arg) => arg);
    const commandName = args.shift().toLowerCase();

    const findCommand = (commandsList, lookingCommand) => {
      const newMap = new Map([...commandsList]
        .filter(([, v]) => v.aliases && v.aliases.includes(lookingCommand)));

      const arr = Array.from(newMap);

      if (arr.length) return arr[0][1];
    };

    // get command by name or alias
    const command = vk.commands.get(commandName) || findCommand(vk.commands, commandName);

    if (command && command.lowercaseArguments && command.lowercaseArguments !== false) args = args.map((arg) => arg.toLowerCase());

    // call command
    if (command) {
      await commandsStatsSetters.incrementCommandStats(command.name);
      command.execute(ctx, args, vk);
    }
  },
};
