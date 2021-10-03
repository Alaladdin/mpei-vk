const fs = require('fs');
const text2png = require('text2png');
const path = require('path');

const outPath = path.resolve(__dirname, '../files/userCreated.png');

module.exports = async (text) => {
  if (!text) return false;

  return fs.writeFileSync(outPath, text2png(text, {
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
