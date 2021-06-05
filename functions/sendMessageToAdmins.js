const { admin: admins } = require('../data/priority');
const sendMessage = require('./sendMessage');

module.exports = async (vk, message) => {
  console.log(message);
  admins.forEach((user) => {
    sendMessage(vk, {
      peerId: user.userId,
      message: message.toString(),
    });
  });
};
