const { each } = require('lodash');
const { adminsChatIds } = require('../config');
const { sendMessage, getUsers, handleError } = require('../helpers');

module.exports = {
  name: 'group_join',
  async execute(ctx, next, vk) {
    getUsers(vk, { userIds: [ctx.userId] })
      .then(async (users) => {
        const joinedUser = users[0];
        const userLink = `@id${ctx.userId}(${joinedUser.first_name} ${joinedUser.last_name})`;

        each(adminsChatIds, (chatId) => {
          sendMessage(vk, {
            peerId : chatId,
            message: `${userLink} подписался на группу`,
          }).catch((err) => handleError(err, vk));
        });
      })
      .catch((err) => handleError(err, vk));
  },
};
