const { chats } = require('../config');
const sendMessage = require('../functions/sendMessage');

module.exports = {
  name: 'sm',
  description: 'Отправляет сообщение от имени бота',
  hidden: true,
  adminOnly: true,
  stats: false,
  lowercaseArguments: false,
  getChatsList(ctx) {
    const msg = [];
    Object.keys(chats).forEach((key) => msg.push(`${key} - ${chats[key]}`));

    ctx.reply(msg.join('\n'));
  },
  async execute(ctx, args, vk) {
    if (args[0].toLowerCase() === 'chats') {
      this.getChatsList(ctx);
      return;
    }

    if (!args.length || (!args[1])) {
      ctx.reply(`Необходимо сообщение ${!args[0] ? 'и чат' : ''} для отправки`);
      return;
    }

    if (args[0] === 'chats') {
      this.getChatsList(ctx);
      return;
    }

    const selectedChatName = args[0].toLowerCase();
    const selectedChat = chats[selectedChatName];
    const messageToSend = args.slice(1).join(' ');

    if (!selectedChat) {
      ctx.reply('Чат не найден');
      return;
    }

    sendMessage(vk, {
      peerId: selectedChat,
      message: messageToSend,
    })
      .then(() => {
        ctx.reply(`Сообщение отправлено в чат ${selectedChatName}:\n${messageToSend}`);
      })
      .catch((e) => {
        console.error(e);
        ctx.reply(`Сообщение не отправлено в чат ${selectedChatName}:\n${messageToSend}`);
      });
  },
};
