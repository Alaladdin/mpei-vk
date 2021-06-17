const fs = require('fs');
const path = require('path');
const { texts } = require('../data/messages');
const { options: optionsRegex } = require('../data/regex');
const sendMessage = require('../functions/sendMessage');
const createImage = require('../functions/createImage');

const { image: imageTexts } = texts;

module.exports = {
  name: 'image',
  aliases: ['p', 'photo'],
  description: 'создает картинку с заданным текстом',
  lowercaseArguments: false,
  arguments: [
    {
      name: 'width',
      description: '(int) ширина',
    },
    {
      name: 'height',
      description: '(int) высота',
    },
    {
      name: 'theme',
      description: ['dark', 'light'].join(', '),
    },
    {
      name: 'fontSize',
      description: '(int - px) размер шрифта',
    },
    {
      name: 'fontFamily',
      description: 'шрифт',
    },
    {
      name: 'textColor',
      description: '(int - hex) цвет шрифта (без #)',
    },
    {
      name: 'bgColor',
      description: '(int - hex) цвет фона (без #)',
    },
    {
      name: 'textAlign',
      description: ['left', 'right', 'center', 'start', 'end'].join(', '),
    },
    {
      name: 'textPosX',
      description: '(int) координаты текста по X',
    },
    {
      name: 'textPosY',
      description: '(int) координаты текста по Y',
    },
  ],
  async execute(ctx, args, vk) {
    const { upload } = vk;
    const { peerId, attachments } = ctx;
    const configBlackListOptions = ['text', 'image'];
    let filteredArgs = args;
    const getAttachImage = () => {
      const { sizes } = attachments[0];
      const maxAttachWidth = Math.max(...sizes.map((obj) => obj.width));

      return sizes.find((obj) => obj.width === maxAttachWidth);
    };

    const config = {
      image: attachments.length && getAttachImage(),
    };

    if (!args.length) {
      await ctx.reply(imageTexts.status.noArgument);
      return;
    }

    const argsConfig = args.join(' ').match(optionsRegex);

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
      ctx.reply(texts.status.crashError);
    }
    const fileData = await fs.promises.readFile(path.resolve(__dirname, '../files/userCreated.png'));

    const uploadedImage = await upload.messagePhoto({
      peer_id: peerId,
      source: {
        value: fileData,
      },
    });

    await sendMessage(vk, {
      peerId,
      attachment: `photo${uploadedImage.ownerId}_${uploadedImage.id}`,
    });
  },
};
