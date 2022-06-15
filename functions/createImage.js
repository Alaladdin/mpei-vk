const fs = require('fs');
const text2png = require('text2png');
const themes = require('../data/createImageThemes');
const { tempImagePath } = require('../config');
const { getRandomArrayItem } = require('../helpers');

const getThemeByHour = () => {
  const currentHour = new Date().getHours();
  const isNight = currentHour > 20 || currentHour < 6;
  const themeStyle = isNight ? 'dark' : 'light';

  return getRandomArrayItem(themes[themeStyle]);
};

module.exports = async (text) => {
  if (!text || !text.trim()) return false;

  const selectedTheme = getThemeByHour();

  return fs.writeFileSync(tempImagePath, text2png(text, {
    padding      : 20,
    lineSpacing  : 10,
    borderWidth  : 7,
    font         : '30px Calibri',
    localFontPath: 'Calibri',
    ...selectedTheme,
  }));
};
