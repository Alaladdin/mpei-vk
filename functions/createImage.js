const fs = require('fs');
const text2png = require('text2png');
const { outImagePath } = require('../config');

module.exports = async (text) => {
  if (!text) return false;

  return fs.writeFileSync(outImagePath, text2png(text, {
    color          : 'teal',
    backgroundColor: 'linen',
    padding        : 20,
    lineSpacing    : 10,
    borderWidth    : 5,
    borderColor    : 'teal',
    font           : '30px Calibri',
    localFontPath  : 'Calibri',
  }));
};
