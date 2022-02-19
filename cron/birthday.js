const schedule = require('node-schedule');
const { chats } = require('../config');
const { formatDate, getChatMembers, sendMessage, handleError } = require('../helpers');

module.exports = {
  async init(vk) {
    schedule.scheduleJob('0 10 9 * * *', async () => {
      const chatMembers = await getChatMembers(vk, { peerId: chats.main, fields: ['bdate'] })
        .catch((error) => handleError(error, vk))
        .catch(() => false);

      if (!chatMembers) return;

      const today = formatDate(new Date(), 'd.M');
      const todayBirthUsers = chatMembers.profiles.filter(
        (profile) => profile.bdate && profile.bdate.split('.').slice(0, 2).join('.') === today,
      );

      todayBirthUsers.forEach((user) => {
        const userFullName = `${user.first_name} ${user.last_name}`;

        sendMessage(vk, {
          peerId        : chats.main,
          message       : `У @id${user.id} (${userFullName}) сегодня день рождения`,
          dontParseLinks: false,
        });
      });
    });
  },
};
