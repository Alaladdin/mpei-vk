const { mailParser } = require('../functions/mailParser');

module.exports = {
  name: 'commands',
  description: 'set mail parser',
  async init(vk) {
    await mailParser(vk);
  },
};
