const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

module.exports = async ({
                          text = 'Гера воняет',
                          width = '1000',
                          height = '1000',
                          image = null,
                          theme = 'dark',
                          fontSize = '128',
                          fontFamily = null,
                          textColor = null,
                          bgColor = null,
                          textAlign = 'center',
                          textPosX = null,
                          textPosY = null,
                        }) => {
  const imgWidth = image ? image.width : parseInt(width, 10);
  const imgHeight = image ? image.height : parseInt(height, 10);
  const canvas = createCanvas(imgWidth, imgHeight);
  const ctx = canvas.getContext('2d');
  const createImageFile = () => {
    const filesPath = path.join(__dirname, '../files');
    const buffer = canvas.toBuffer('image/png');

    fs.writeFileSync(path.resolve(filesPath, 'userCreated.png'), buffer);
  };
  const themes = {
    light: { textColor: '121212', bgColor: 'f2f2f2' },
    dark: { textColor: 'f2f2f2', bgColor: '121212' },
  };
  const selectedTheme = themes[Object.keys(themes).find((key) => key === theme) || 'dark'];
  const config = {
    textColor: textColor || selectedTheme.textColor,
    bgColor: bgColor || selectedTheme.bgColor,
    fontFamily: fontFamily || 'Calibri',
    fontSize: parseInt(fontSize, 10),
    textAlign,
    textPosition: {
      x: parseInt(textPosX, 10) || (imgWidth / 2),
      y: parseInt(textPosY, 10) || (imgHeight / 2) + (parseInt(fontSize, 10) / 4),
    },
  };

  ctx.fillStyle = `#${config.bgColor}`;
  ctx.fillRect(0, 0, imgWidth, imgHeight);
  ctx.fillStyle = `#${config.textColor}`;
  ctx.font = `${config.fontSize}px ${config.fontFamily}`;
  ctx.textAlign = textAlign;
  ctx.fillText(text, config.textPosition.x, config.textPosition.y);

  if (!image) return createImageFile();

  return loadImage(image.url)
    .then((img) => {
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
      ctx.fillText(text, config.textPosition.x, config.textPosition.y);

      createImageFile();
    });
};
