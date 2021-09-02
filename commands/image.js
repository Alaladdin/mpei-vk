const fs = require('fs');
const path = require('path');
const { texts } = require('../data/messages');
const { options: optionsRegex } = require('../data/regex');
const { sendMessage } = require('../helpers');
const createImage = require('../functions/createImage');

module.exports = {
  name: 'image',
  aliases: ['i', 'p', 'photo'],
  description: 'создает картинку с заданным текстом',
  lowercaseArguments: false,
  arguments: [
    { name: 'width', description: '(int) ширина' },
    { name: 'height', description: '(int) высота' },
    { name: 'theme', description: ['dark', 'light'].join(', ') },
    { name: 'fontSize', description: '(int - px) размер шрифта' },
    { name: 'fontFamily', description: 'шрифт' },
    { name: 'textColor', description: '(int - hex) цвет шрифта (без #)' },
    { name: 'bgColor', description: '(int - hex) цвет фона (без #)' },
    { name: 'textAlign', description: ['left', 'right', 'center', 'start', 'end'].join(', ') },
    { name: 'textPosX', description: '(int) координаты текста по X' },
    { name: 'textPosY', description: '(int) координаты текста по Y' },
  ],
  getAttachImage(attachments) {
    const { sizes } = attachments[0];
    const maxAttachWidth = Math.max(...sizes.map((obj) => obj.width));

    return sizes.find((obj) => obj.width === maxAttachWidth);
  },
  async execute(ctx, args, vk) {
    const { peerId, attachments } = ctx;
    const configBlackListOptions = ['text', 'image'];
    const config = { image: attachments.length && this.getAttachImage(attachments) };

    if (!args.length) return ctx.reply(texts.imageTextRequired);

    const argsConfig = args.join(' ').match(optionsRegex);
    let filteredArgs = args;

    if (argsConfig) {
      argsConfig.forEach((option) => {
        const optionArr = option.split(':');
        const key = optionArr[0];

        filteredArgs = filteredArgs.filter((val) => val !== option);

        // eslint-disable-next-line prefer-destructuring
        if (!configBlackListOptions.includes(key)) config[key] = optionArr[1];
      });
    }

    config.text = filteredArgs.join(' ');

    try {
      await createImage(config);
    } catch (e) {
      ctx.reply(texts.totalCrash);
    }

    const fileData = await fs.promises.readFile(path.resolve(__dirname, '../files/userCreated.png'));
    const uploadedImage = await vk.upload.messagePhoto(
      { peer_id: peerId, source: { value: fileData } },
    ).catch(console.error);

    if (!uploadedImage) return ctx.reply(texts.totalCrash);

    return sendMessage(vk, {
      peerId, attachment: `photo${uploadedImage.ownerId}_${uploadedImage.id}`,
    });
  },
};
