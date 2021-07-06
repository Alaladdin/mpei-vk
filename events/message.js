const { prefix, chats } = require('../config');
const { getters: storeGetters, setters: storeSetters } = require('../store');
const notAllowedMessages = require('../functions/notAllowedMessages');
const sendMessage = require('../functions/sendMessage');
const isAdmin = require('../functions/isAdmin');
const findCommand = require('../util/findCommand');
const priority = require('../data/priority');

module.exports = {
  name: 'message',
  isPassedConditions(ctx) {
    const { messagePayload, text } = ctx;
    const hasMessagePrefix = text && prefix.includes(text[0]);
    const isDisabled = !isAdmin(ctx.senderId) && !storeGetters.getBotStatus();

    return !isDisabled && ctx.isUser && (hasMessagePrefix || messagePayload);
  },
  async execute(ctx, next, vk) {
    const { messagePayload, text } = ctx;

    await this.listenMessages(ctx, vk);
    await notAllowedMessages.execute(ctx, text, vk);

    if (!this.isPassedConditions(ctx)) return;

    const commandBody = (messagePayload && messagePayload.command)
      ? messagePayload.command.slice(1)
      : text.slice(1);
    let args = commandBody.split(' ').filter((arg) => arg);
    const commandAlias = args.shift().toLowerCase();
    const command = findCommand(commandAlias, vk.commands);

    // call command
    if (command) {
      if (command.adminOnly && !isAdmin(ctx.senderId)) return;

      await this.updateCommandStats(ctx, command, commandAlias);

      if (command.lowercaseArguments !== false) args = args.map((arg) => arg.toLowerCase());

      command.execute(ctx, args, vk);
    }
  },
  async listenMessages(ctx, vk) {
    const mess = [];
    const chatName = Object.keys(chats).find((key) => (chats[key] === ctx.peerId));
    const isListenMessages = storeGetters.getIsListenMessages();
    const isAdminPrivateChat = isAdmin(ctx.peerId);

    if (!ctx.text || !ctx.isUser || !isListenMessages || isAdminPrivateChat) return;

    mess.push(`@id${ctx.senderId}(Sender)`);
    mess.push(`Chat: ${chatName || ctx.peerId}`);
    mess.push(`Message: ${ctx.text}`);

    await sendMessage(vk, {
      peerId: priority.admins.AL,
      message: mess.join('\n'),
    });
  },
  async updateCommandStats(ctx, command, alias) {
    if (isAdmin(ctx.senderId) || command.stats === false) return;

    await storeSetters.incrementCommandStats(command.name, alias);
  },
};
