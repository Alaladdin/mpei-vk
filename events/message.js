const { prefix } = require('../config');
const { getters: storeGetters, setters: storeSetters } = require('../store');
const { execute: notAllowedMessages } = require('../functions/notAllowedMessages');
const isAdmin = require('../functions/isAdmin');
const findCommand = require('../util/findCommand');
const priority = require('../data/priority');

module.exports = {
  name: 'message',
  async execute(ctx, next, vk) {
    const { messagePayload, text } = ctx;
    const isAdminMess = isAdmin(ctx.senderId);
    const isDisabled = !isAdminMess && !storeGetters.getBotStatus();
    const hasMessagePrefix = text && prefix.includes(text[0]);
    const isBlackListedUser = priority.blackList.includes(ctx.senderId);

    if (isDisabled || (!messagePayload && !text) || !ctx.isUser) return;
    if (!isAdminMess) await notAllowedMessages(ctx, text);
    if ((!hasMessagePrefix && !messagePayload) || isBlackListedUser) return;

    const commandBody = (messagePayload && messagePayload.command)
      ? messagePayload.command.slice(1)
      : text.slice(1);

    let args = commandBody.split(' ').filter((arg) => arg);
    const commandName = args.shift().toLowerCase();

    // get command by name or alias
    const command = findCommand(commandName, vk.commands);

    // call command
    if (command) {
      // update command stats
      if (!isAdminMess && command.stats !== false) {
        await storeSetters.incrementCommandStats(command.name, commandName);
      }

      if (command.lowercaseArguments !== false) args = args.map((arg) => arg.toLowerCase());

      command.execute(ctx, args, vk);
    }
  },
};
