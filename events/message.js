const { prefix } = require('../config');
const { getters: storeGetters } = require('../store');
const { getCommand, isAdmin } = require('../helpers');

module.exports = {
  name: 'message',
  isPassedConditions(ctx) {
    const { messagePayload, text } = ctx;
    const hasMessagePrefix = text && prefix.includes(text[0]);
    const isDisabled = !isAdmin(ctx.senderId) && !storeGetters.getBotStatus();

    return !isDisabled && ctx.isUser && text.length > 1 && (hasMessagePrefix || messagePayload);
  },
  async execute(ctx, next, vk) {
    const { messagePayload, text } = ctx;

    if (!this.isPassedConditions(ctx)) return;

    const commandBody = (messagePayload && messagePayload.command)
      ? messagePayload.command.slice(1)
      : text.slice(1);
    let args = commandBody.split(' ').filter((arg) => arg);
    const commandAlias = args.shift().toLowerCase();
    const command = getCommand(vk.commands, commandAlias);

    // call command
    if (command) {
      if (command.adminOnly && !isAdmin(ctx.senderId)) return;

      if (command.lowercaseArguments !== false) args = args.map((arg) => arg.toLowerCase());

      command.execute(ctx, args, vk);
    }
  },
};
