const schedule = require('node-schedule');
const { mainChat } = require('../config');
const { formatDate, getChatMembers, sendMessage, handleError } = require('../helpers');

module.exports = {
  async init(vk) {
    schedule.scheduleJob('0 0 6 * * *', async () => {
      const chatMembers = await getChatMembers(vk, { peerId: mainChat, fields: ['bdate'] })
        .catch((error) => handleError(error, vk))
        .catch(() => false);

      if (chatMembers) {
        const today = formatDate(new Date(), 'd.M');
        const todayBirthUsers = chatMembers.profiles.filter((profile) => {
          if (!profile.bdate) return false;

          return profile.bdate.split('.').slice(0, 2).join('.') === today;
        });

        todayBirthUsers.forEach((user) => {
          const userFullName = `${user.first_name} ${user.last_name}`;

          sendMessage(vk, {
            peerId        : mainChat,
            message       : `У @id${user.id} (${userFullName}) сегодня день рождения`,
            dontParseLinks: false,
          });
        });
      }
    });
  },
};
