const schedule = require('node-schedule');
const fs = require('fs');
const { chats, serverDateFormat, outImagePath } = require('../config');
const { formatDate, sendMessage } = require('../helpers');
const { getFormattedSchedule, createImage } = require('../functions');

module.exports = {
  async execute(vk) {
    schedule.scheduleJob('0 5 9 * * *', async () => {
      const today = formatDate(new Date(), serverDateFormat);
      const scheduleData = await getFormattedSchedule([], { start: today, finish: today });

      if (scheduleData) {
        await createImage(scheduleData);
        const fileData = await fs.promises.readFile(outImagePath);

        vk.upload.messagePhoto({ peer_id: chats.main, source: { value: fileData } })
          .then(async (image) => {
            await sendMessage(vk, {
              peerId    : chats.main,
              attachment: `photo${image.ownerId}_${image.id}`,
            });
          })
          .catch(console.error);
      }
    });
  },
};
