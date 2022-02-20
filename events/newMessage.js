const { prefix } = require('../config');
const { getCommand, isAdmin } = require('../helpers');

module.exports = {
  name: 'message_new',
  isPassedConditions(ctx) {
    const { text } = ctx;
    if (!text || text.length <= 1) return false;

    const hasMessagePrefix = prefix.includes(text[0]);

    return ctx.isUser && hasMessagePrefix;
  },
  async execute(ctx, next, vk) {
    if (!this.isPassedConditions(ctx)) return;

    const commandBody = ctx.text.slice(1);
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
