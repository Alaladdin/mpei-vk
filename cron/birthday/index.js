const schedule = require('node-schedule');
const path = require('path');
const fs = require('fs');
const { each, filter } = require('lodash');
const { mainChat, assetsPath, adminsChatIds } = require('../../config');
const {
  formatDate, getChatMembers, sendMessage, handleError, getRandomArrayItem, addToDate,
} = require('../../helpers');
const { audioMessages } = require('./metadata');

const getUserBirthdayDate = (user) => user.bdate.split('.').slice(0, 2).join('.');

module.exports = {
  async init(vk) {
    schedule.scheduleJob('0 0 6 * * *', async () => {
      const chatMembers = await getChatMembers(vk, { peerId: mainChat, fields: ['first_name_gen', 'last_name_gen', 'bdate'] })
        .catch((error) => handleError(error, vk))
        .catch(() => false);

      if (chatMembers) {
        const today = formatDate(new Date(), 'd.M');
        const dayAfterTomorrow = formatDate(addToDate(new Date(), { days: 2 }), 'd.M');
        const todayBirthUsers = filter(chatMembers.profiles, (user) => {
          if (!user.bdate) return false;

          return getUserBirthdayDate(user) === today;
        });

        each(chatMembers.profiles, (user) => {
          if (!user.bdate) return false;

          const birthdayDate = getUserBirthdayDate(user);

          if (birthdayDate === dayAfterTomorrow) {
            each(adminsChatIds, (chatId) => {
              sendMessage(vk, {
                peerId : chatId,
                message: `У @id${user.id} (${user.first_name_gen}) день рождения через два дня`,
              }).catch((err) => handleError(err, vk));
            });
          }
        });

        each(todayBirthUsers, async (user) => {
          const userFullName = `${user.first_name_gen} ${user.last_name_gen}`;
          const audioMessagesArray = audioMessages[user.id] || audioMessages.default;
          const audioMessageFileName = getRandomArrayItem(audioMessagesArray);
          const audioMessage = await vk.upload.audioMessage({
            peer_id: mainChat,
            source : { value: fs.readFileSync(path.resolve(assetsPath, audioMessageFileName)) },
          })
            .then((audio) => `audio_message${audio.ownerId}_${audio.id}`)
            .catch((err) => {
              handleError(err, vk);
              return null;
            });

          await sendMessage(vk, {
            peerId    : mainChat,
            message   : `У @id${user.id} (${userFullName}) сегодня день рождения`,
            attachment: audioMessage,
          });
        });
      }
    });
  },
};
