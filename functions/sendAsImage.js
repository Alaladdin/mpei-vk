const fs = require('fs');
const createImage = require('./createImage');
const { sendMessage } = require('../helpers');
const { outImagePath } = require('../config');

module.exports = async ({ message, title, peerId, vk }) => {
  await createImage(message);

  const fileData = await fs.promises.readFile(outImagePath);

  return vk.upload.messagePhoto({ peer_id: peerId, source: { value: fileData } })
    .then((image) => {
      sendMessage(vk, {
        peerId,
        message   : title,
        attachment: `photo${image.ownerId}_${image.id}`,
      });
    })
    .catch((err) => {
      console.error(err);

      throw err;
    });
};
