const { chats } = require('../config');
const sendMessage = require('../functions/sendMessage');

module.exports = {
  name: 'sm',
  description: 'отправляет сообщение через бота',
  hidden: true,
  adminOnly: true,
  stats: false,
  lowercaseArguments: false,
  noArgumentsReply(ctx, isChatPassed) {
    ctx.reply(`Необходимо сообщение ${!isChatPassed ? 'и чат' : ''} для отправки`);
  },
  chatListReply(ctx) {
    const chatList = Object.keys(chats).map((chatName) => `- ${chatName}`);
    ctx.reply(chatList.join('\n'));
  },
  sendMessageToChat(vk, ctx, peerId, chatName, message) {
    sendMessage(vk, { peerId, message })
      .then(() => {
        ctx.reply(`Сообщение отправлено в чат "${chatName}":\n${message}`);
      })
      .catch((e) => {
        console.error(e);
        ctx.reply(`Сообщение не отправлено в чат "${chatName}":\n${message}`);
      });
  },
  async execute(ctx, args, vk) {
    if (!args.length || (!args[1])) return this.noArgumentsReply(ctx, !!args[0]);
    if (args[0].toLowerCase() === 'chats') return this.chatListReply(ctx);

    const selectedChatName = args[0].toLowerCase();
    const selectedChat = chats[selectedChatName];
    const messageToSend = args.slice(1).join(' ');

    if (!selectedChat) return ctx.reply(`Чат с именем "${selectedChatName}" не найден`);

    return this.sendMessageToChat(vk, ctx, selectedChat, selectedChatName, messageToSend);
  },
};
