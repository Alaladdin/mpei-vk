const fs = require('fs');
const text2png = require('text2png');
const themes = require('../data/createImageThemes');
const { outImagePath } = require('../config');
const { getRandomArrayItem } = require('../helpers');

const getThemeByHour = () => {
  const currentHour = new Date().getHours();
  const isNight = currentHour > 20 || currentHour < 6;
  const themeStyle = isNight ? 'dark' : 'light';

  return getRandomArrayItem(themes[themeStyle]);
};

module.exports = async (text) => {
  if (!text) return false;

  const themeMap = getThemeByHour();

  return fs.writeFileSync(outImagePath, text2png(text, {
    ...themeMap,
    padding      : 20,
    lineSpacing  : 10,
    borderWidth  : 7,
    font         : '30px Calibri',
    localFontPath: 'Calibri',
  }));
};