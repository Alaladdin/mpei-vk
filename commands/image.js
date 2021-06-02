const fs = require('fs');
const path = require('path');
const { texts } = require('../data/messages');
const { execute: createImage } = require('../functions/createImage');
const rand = require('../util/random');

const { image: imageTexts } = texts;

module.exports = {
  name: 'image',
  aliases: ['p', 'photo'],
  description: 'Создает картинку с заданным текстом',
  lowercaseArguments: false,
  async execute(ctx, args, vk) {
    const { upload } = vk;
    const { peerId } = ctx;

    if (!args.length) {
      await ctx.reply(imageTexts.status.noArgument);
      return;
    }

    const theme = ['light', 'dark'].find((key) => key === args.slice(-1)[0]);

    if (theme) args.pop();

    await createImage({
      text: args.join(' '),
      fontSize: 128,
      theme,
    });

    const fileData = await fs.promises.readFile(path.resolve(__dirname, '../files/userCreated.jpg'));

    const uploadedImage = await upload.messagePhoto({
      peer_id: peerId,
      source: {
        value: fileData,
      },
    });

    await vk.api.messages.send({
      peer_id: peerId,
      random_id: rand.int(999),
      attachment: `photo${uploadedImage.ownerId}_${uploadedImage.id}`,
      dont_parse_links: true,
    });
  },
};
