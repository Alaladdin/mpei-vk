const { chats } = require('../config');
const { sendMessage } = require('../helpers');
const { sendAsImage } = require('../functions');
const { texts } = require('../data/messages');

module.exports = {
  name              : 'sm',
  description       : 'отправляет сообщение через бота',
  hidden            : true,
  adminOnly         : true,
  lowercaseArguments: false,
  arguments         : [{ name: 'chats', description: 'выводит доступных чатов' }],
  noArgumentsReply(ctx, isChatPassed) {
    ctx.reply(`Необходимо сообщение ${!isChatPassed ? 'и чат' : ''} для отправки`);
  },
  chatListReply(ctx, vk) {
    const chatList = Object.keys(chats).map((chatName) => `- ${chatName}`);

    return sendAsImage({ message: chatList.join('\n'), peerId: ctx.peerId, vk })
      .catch(() => ctx.send(texts.totalCrash));
  },
  sendMessageToChat(message, chatName, peerId, ctx, vk) {
    sendMessage(vk, { peerId, message })
      .then(() => {
        const msg = ['Сообщение отправлено', `Чат: ${chatName}`, `Сообщение: ${message}`].join('\n');

        ctx.reply(msg);
      })
      .catch((e) => {
        console.error(e);
        ctx.reply('Сообщение не отправлено');
      });
  },
  async execute(ctx, args, vk) {
    if (args.length && args[0].toLowerCase() === 'chats') return this.chatListReply(ctx, vk);
    if (!args.length || !args[1]) return this.noArgumentsReply(ctx, !!args[0]);

    const selectedChatName = args[0].toLowerCase();
    const selectedChat = chats[selectedChatName];
    const messageToSend = args.slice(1).join(' ');

    if (!selectedChat) return ctx.reply(`Чат "${selectedChatName}" не найден`);

    return this.sendMessageToChat(messageToSend, selectedChatName, selectedChat, ctx, vk);
  },
};
