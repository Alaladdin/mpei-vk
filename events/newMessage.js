const { prefixes } = require('../config');
const { getCommand } = require('../helpers');

module.exports = {
  name: 'message_new',
  isPassedConditions(ctx) {
    const { text } = ctx;
    if (!text || text.length <= 1)
      return false;

    return ctx.isUser && prefixes.includes(text[0]);
  },
  async execute(ctx, next, vk) {
    if (!this.isPassedConditions(ctx)) return;

    const commandBody = ctx.text.slice(1);
    let args = commandBody.split(' ').filter((arg) => arg);
    const commandAlias = args.shift().toLowerCase();
    const command = getCommand(vk.commands, commandAlias);

    // call command
    if (command) {
      if (command.lowercaseArguments !== false)
        args = args.map((arg) => arg.toLowerCase());

      command.execute(ctx, args, vk);
    }
  },
};
