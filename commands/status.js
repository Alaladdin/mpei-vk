const fetch = require('node-fetch');
const { version } = require('../package.json');
const { getUniversalUrl } = require('../data/requests');
const {
  serverAddress,
  prefix,
  isProd,
} = require('../config');

module.exports = {
  name       : 'status',
  description: 'информация о боте',
  aliases    : ['info'],
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
  async execute(ctx) {
    const prefixText = !Array.isArray(prefix) ? prefix : prefix.join(', ');
    const serverVersion = await this.getServerData('version');
    const msg = [];

    // bot info
    msg.push('- Bot info');
    msg.push(`· version: ${version}`);
    msg.push(`· prefix: "${prefixText}"`);
    msg.push(`· isProduction: ${isProd}`);

    // server info
    msg.push('\n- Server info');
    msg.push(`· address: ${serverAddress}`);
    msg.push(`· version: ${serverVersion}`);

    ctx.send(msg.join('\n'), { dont_parse_links: true });
  },
};
