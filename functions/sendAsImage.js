const fs = require('fs');
const createImage = require('./createImage');
const { outImagePath } = require('../config');
const { texts } = require('../data/messages');

module.exports = async ({ message, title, ctx, vk }) => {
  await createImage(message);

  const fileData = await fs.promises.readFile(outImagePath);

  return vk.upload.messagePhoto({ peer_id: ctx.peerId, source: { value: fileData } })
    .then((image) => {
      ctx.send({ message: title, attachment: `photo${image.ownerId}_${image.id}` });
    })
    .catch((e) => {
      console.error(e);
      ctx.send(texts.totalCrash);
    });
};
