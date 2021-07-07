const { prefix, chats } = require('../config');
const { getters: storeGetters, setters: storeSetters } = require('../store');
const notAllowedMessages = require('../functions/notAllowedMessages');
const isAdmin = require('../functions/isAdmin');
const sendMessage = require('../functions/sendMessage');
const getUsers = require('../functions/getUsers');
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
    const { forwards, replyMessage } = ctx;
    const chatName = Object.keys(chats).find((key) => (chats[key] === ctx.peerId));
    const isListenMessages = storeGetters.getIsListenMessages();
    const isAdminPrivateChat = isAdmin(ctx.peerId);
    const mess = [];

    const hasForwardsMessage = forwards.length && forwards[0].text;
    const hasReplyMessage = replyMessage && replyMessage.text;
    const hasNoMessageText = !ctx.text && !hasForwardsMessage && !hasReplyMessage;

    if ((hasNoMessageText) || !ctx.isUser || !isListenMessages || isAdminPrivateChat) return;

    const users = await getUsers(vk, { userIds: ctx.senderId });

    if (users) {
      const getUserFullNameWithLink = (user) => `@id${user.id} (${user.first_name} ${user.last_name})`;

      mess.push(`Chat: ${chatName || ctx.peerId}`);
      mess.push(`Sender: ${getUserFullNameWithLink(users[0])}`);

      if (hasForwardsMessage) forwards.map((f) => f.text && mess.push(`Forwards: ${f.text}`));

      if (hasReplyMessage) {
        if (replyMessage.senderType === 'user') {
          const replyMessageUsers = await getUsers(vk, { userIds: replyMessage.senderId });
          if (replyMessageUsers) mess.push(`Replied to user: ${getUserFullNameWithLink(replyMessageUsers[0])}`);
        }
        mess.push(`Replied mess: ${replyMessage.text}`);
      }
      if (ctx.text) mess.push(`Message: ${ctx.text}`);
    } else {
      mess.push('[Error] users get');
    }

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
