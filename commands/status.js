const fetch = require('node-fetch');
const { version } = require('../package.json');
const { getUniversalUrl } = require('../data/requests');
const { prefix, isProd } = require('../config');
const { sendAsImage } = require('../functions');
const { texts } = require('../data/messages');

module.exports = {
  name       : 'status',
  description: 'информация о боте',
  aliases    : ['i', 'info'],
  hidden     : true,
  getServerData(query) {
    return fetch(getUniversalUrl(query))
      .then(async (res) => {
        const json = await res.json();

        if (!res.ok) throw (json.error);

        return Object.values(json)[0];
      })
      .catch((e) => {
        console.error(e);
        return 'error';
      });
  },
  async execute(ctx, args, vk) {
    const prefixText = !Array.isArray(prefix) ? prefix : prefix.join(', ');
    const serverVersion = await this.getServerData('version');
    const msg = [];

    // bot info
    msg.push('# Bot info');
    msg.push(`· version: ${version}`);
    msg.push(`· prefix: "${prefixText}"`);
    msg.push(`· isProd: ${isProd}`);

    // server info
    msg.push('\n# Server info');
    msg.push(`· version: ${serverVersion}`);

    return sendAsImage({ message: msg.join('\n'), peerId: ctx.peerId, vk })
      .catch(() => ctx.send(texts.totalCrash));
  },
};
