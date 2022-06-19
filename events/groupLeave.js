const { each } = require('lodash');
const { adminsChatIds } = require('../config');
const { sendMessage, getUsers, handleError } = require('../helpers');

module.exports = {
  name: 'group_leave',
  async execute(ctx, next, vk) {
    getUsers(vk, { userIds: [ctx.userId] })
      .then(async (users) => {
        const leavedUser = users[0];
        const userLink = `@id${ctx.userId}(${leavedUser.first_name} ${leavedUser.last_name})`;

        each(adminsChatIds, (chatId) => {
          sendMessage(vk, {
            peerId : chatId,
            message: `${userLink} отписался от группы`,
          }).catch((err) => handleError(err, vk));
        });
      })
      .catch((err) => handleError(err, vk));
  },
};
