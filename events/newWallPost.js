const { mainChat } = require('../config');
const { sendMessage } = require('../helpers');

module.exports = {
  name: 'wall_post_new',
  async execute(ctx, next, vk) {
    const { id, ownerId } = ctx.wall;
    const postLink = `https://vk.com/wall${ownerId}_${id}`;

    await sendMessage(vk, {
      peerId        : mainChat,
      message       : ['Новый мемес', postLink].join('\n\n'),
      dontParseLinks: false,
    });
  },
};
