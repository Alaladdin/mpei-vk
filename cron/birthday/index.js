const schedule = require('node-schedule');
const path = require('path');
const fs = require('fs');
const { each } = require('lodash');
const { mainChat, assetsPath } = require('../../config');
const { formatDate, getChatMembers, sendMessage, handleError } = require('../../helpers');
const metadata = require('./metadata');

module.exports = {
  async init(vk) {
    await metadata.loadUsedData();

    schedule.scheduleJob('0 0 0 * * *', async () => {
      const chatMembers = await getChatMembers(vk, { peerId: mainChat, fields: ['first_name_gen', 'last_name_gen', 'bdate'] })
        .catch((error) => handleError(error, vk))
        .catch(() => false);

      if (chatMembers) {
        const today = formatDate(new Date(), 'd.M');

        each(chatMembers.profiles, async (user) => {
          if (!user.bdate) return;

          const birthdayDate = user.bdate.split('.').slice(0, 2).join('.');

          if (birthdayDate === today)
            await this.handleTodayBirthday(user, vk);
        });
      }
    });
  },
  async handleTodayBirthday(user, vk) {
    const userFullName = `${user.first_name_gen} ${user.last_name_gen}`;
    const audioFileName = await metadata.getAudioMessage(user.id);
    const audioMessage = await vk.upload.audioMessage({
      peer_id: mainChat,
      source : { value: fs.readFileSync(path.resolve(assetsPath, audioFileName)) },
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
  },
};
