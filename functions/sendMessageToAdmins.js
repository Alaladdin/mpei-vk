const { admins } = require('../data/priority');
const sendMessage = require('./sendMessage');

module.exports = async (vk, message) => {
  Object.values(admins).forEach((user) => {
    sendMessage(vk, {
      peerId: user.userId,
      message: message.toString(),
    });
  });
};
