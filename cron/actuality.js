const schedule = require('node-schedule');
const fs = require('fs');
const { chats, outImagePath } = require('../config');
const { getters: storeGetters } = require('../store');
const { getActuality, createImage } = require('../functions');
const { sendMessage } = require('../helpers');

module.exports = {
  getIsAutopostingEnabled() {
    const actualityAutoposting = storeGetters.getActualityAutoposting();

    return actualityAutoposting.isEnabled;
  },
  async execute(vk) {
    schedule.scheduleJob('0 0 9 * * *', async () => {
      const isEnabled = this.getIsAutopostingEnabled();
      const actuality = await getActuality().catch(() => {});

      if (isEnabled && actuality) {
        await createImage(actuality.content);
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
