const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

module.exports = {
  name: 'createImage',
  async execute(
    {
      width = 1000,
      height = 1000,
      text = 'Гера воняет',
      fontSize = 128,
      theme = 'dark',
    },
  ) {
    const canvas = createCanvas(width, height);
    const filesPath = path.join(__dirname, '../files');
    const ctx = canvas.getContext('2d');
    const themes = {
      light: {
        fontFamily: 'Calibri',
        textColor: '#fff',
        bgColor: '#222222',
      },
      dark: {
        fontFamily: 'Calibri',
        textColor: '#121212',
        bgColor: '#f2f2f2',
      },
    };
    const selectedTheme = themes[Object.keys(themes).find((key) => key === theme) || 'dark'];

    ctx.fillStyle = selectedTheme.textColor;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = selectedTheme.bgColor;
    ctx.font = `${fontSize}px ${selectedTheme.fontFamily}`;
    ctx.textAlign = 'center';

    ctx.fillText(text, width / 2, height / 2);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.resolve(filesPath, 'userCreated.jpg'), buffer);
  },
};
