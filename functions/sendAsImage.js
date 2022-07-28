const text2png = require('text2png');
const { sendMessage, getRandomArrayItem } = require('../helpers');
const themes = require('../data/imageThemes');

const getThemeByHour = () => {
  const currentHour = new Date().getHours();
  const isNight = currentHour > 20 || currentHour < 6;
  const theme = isNight ? 'dark' : 'light';

  return getRandomArrayItem(themes[theme]);
};

const getImageFromText = (text) => text2png(text, {
  padding      : 20,
  lineSpacing  : 10,
  borderWidth  : 7,
  font         : '30px Calibri',
  localFontPath: 'Calibri',
  ...getThemeByHour(),
});

module.exports = async ({ message, title, peerId, vk }) => {
  if (!message || !message.trim()) throw 'No "message" provided';

  const imageBuffer = getImageFromText(message);

  return vk.upload.messagePhoto({ peer_id: peerId, source: { value: imageBuffer } })
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
