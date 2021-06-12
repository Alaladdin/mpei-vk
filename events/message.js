const { prefix } = require('../config');
const { getters: storeGetters, setters: storeSetters } = require('../store');
const { execute: notAllowedMessages } = require('../functions/notAllowedMessages');
const isAdmin = require('../functions/isAdmin');
const priority = require('../data/priority');

module.exports = {
  name: 'message',
  async execute(ctx, next, vk) {
    const { messagePayload, text } = ctx;

    const isDisabled = !storeGetters.getBotStatus() && !isAdmin(ctx.senderId);

    if (isDisabled || (!messagePayload && !text) || !ctx.isUser) return;

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

      return null;
    };

    // get command by name or alias
    const command = vk.commands.get(commandName) || findCommand(vk.commands, commandName);

    if (command && command.lowercaseArguments && command.lowercaseArguments !== false) {
      args = args.map((arg) => arg.toLowerCase());
    }

    // call command
    if (command) {
      // update command stats
      if (isAdmin(ctx.senderId) && command.stats !== false) {
        await storeSetters.incrementCommandStats(command.name, commandName);
      }

      command.execute(ctx, args, vk);
    }
  },
};
