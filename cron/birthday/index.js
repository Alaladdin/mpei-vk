const schedule = require('node-schedule');
const path = require('path');
const fs = require('fs');
const { each, filter } = require('lodash');
const { mainChat, assetsPath, adminsChatIds } = require('../../config');
const { formatDate, getChatMembers, sendMessage, handleError, getRandomArrayItem, addToDate } = require('../../helpers');
const metadata = require('./metadata');

module.exports = {
  async init(vk) {
    await metadata.loadUsedData();

    schedule.scheduleJob('0 0 6 * * *', async () => {
      const chatMembers = await getChatMembers(vk, { peerId: mainChat, fields: ['first_name_gen', 'last_name_gen', 'bdate'] })
        .catch((error) => handleError(error, vk))
        .catch(() => false);

      if (chatMembers) {
        const today = formatDate(new Date(), 'd.M');
        const dayAfterTomorrow = formatDate(addToDate(new Date(), { days: 2 }), 'd.M');

        each(chatMembers.profiles, async (user) => {
          if (!user.bdate) return;

          const birthdayDate = user.bdate.split('.').slice(0, 2).join('.')

          if (birthdayDate === dayAfterTomorrow)
            this.handleAfterTomorrowBirthday(user, vk);

          if (birthdayDate === today)
            await this.handleTodayBirthday(user, vk);
        });
      }
    });
  },
  handleAfterTomorrowBirthday(user, vk) {
    each(adminsChatIds, (chatId) => {
      sendMessage(vk, {
        peerId: chatId,
        message: `У @id${user.id} (${user.first_name_gen}) день рождения через два дня`,
      })
        .catch((err) => handleError(err, vk));
    });
  },
  async handleTodayBirthday(user, vk) {
    const userFullName = `${user.first_name_gen} ${user.last_name_gen}`;
    const audioFileName = await metadata.getAudioMessage(user.id)
    const audioMessage = await vk.upload.audioMessage({
      peer_id: mainChat,
      source: { value: fs.readFileSync(path.resolve(assetsPath, audioFileName)) },
    })
      .then((audio) => `audio_message${audio.ownerId}_${audio.id}`)
      .catch((err) => {
        handleError(err, vk);
        return null;
      });

    await sendMessage(vk, {
      peerId: mainChat,
      message: `У @id${user.id} (${userFullName}) сегодня день рождения`,
      attachment: audioMessage,
    });
  },
};
