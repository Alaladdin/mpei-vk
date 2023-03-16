const { minBy, each } = require('lodash');
const fs = require('node:fs/promises');
const path = require('node:path');
const { getRandomArrayItem } = require('../../helpers');

const usedDataPath = path.resolve(__dirname, 'ignore.usedData.json');

module.exports = {
  async loadUsedData() {
    return fs.readFile(usedDataPath, 'utf-8')
      .then((rawUsedData) => {
        const usedData = JSON.parse(rawUsedData);

        each(this.audioMessages, (audios) => {
          each(audios, (audio) => {
            // eslint-disable-next-line no-param-reassign
            audio.usedData = usedData[audio.file] || 0;
          });
        });
      })
      .catch(this.updateUsedFile);
  },
  async getAudioMessage(userId) {
    const { [userId]: userSpecificAudios, default: defaultAudios } = this.audioMessages;
    const audiosList = userSpecificAudios || defaultAudios;
    const audioMessage = minBy(audiosList, 'usedData') || getRandomArrayItem(audiosList);

    audioMessage.usedData = (audioMessage.usedData || 0) + 1;

    await this.updateUsedFile();

    return audioMessage.file;
  },
  updateUsedFile() {
    const usedData = {};

    each(this.audioMessages, (audios) => {
      each(audios, (audio) => {
        usedData[audio.file] = audio.usedData || 0;
      });
    });

    return fs.writeFile(usedDataPath, JSON.stringify(usedData));
  },
  audioMessages: {
    default: [
      { file: 'default_1.mp3' },
      { file: 'default_2.ogg' },
      { file: 'default_3.ogg' },
      { file: 'default_4.ogg' },
      { file: 'default_5.ogg' },
    ],
    161372337: [
      { file: 'tabriz_1.ogg' },
      { file: 'tabriz_2.ogg' },
    ],
    425704393: [
      { file: 'drobot_1.ogg' },
    ],
  },
};
