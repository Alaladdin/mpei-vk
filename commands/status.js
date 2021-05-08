const fetch = require('node-fetch');
const { version } = require('../package.json');
const {
  serverAddress,
  prefix,
  mailSchedule,
  isProd,
} = require('../config');

module.exports = {
  name: 'status',
  description: 'Выводит информацию о боте',
  aliases: ['info', 'i'],
  async execute(ctx) {
    const msg = [];
    const serverData = (query) => fetch(`${serverAddress}/${query}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(res.statusText);
        return Object.values(json)[0];
      })
      .catch((err) => {
        console.error(err);
        return 'error';
      });

    // bot info
    msg.push('- Bot info');
    msg.push(`· version: ${version}`);
    msg.push(`· prefix: "${prefix}"`);
    msg.push(`· mailSchedule: "${mailSchedule}"`);

    // server info
    msg.push('\n- Server info');
    msg.push(`· address: ${serverAddress}`);
    msg.push(`· isProduction: ${isProd}`);
    msg.push(`· version: ${await serverData('version')}`);
    msg.push(`· health: ${await serverData('health')}`);
    msg.push(`· ping: ${await serverData('ping')}`);

    ctx.send(msg.join('\n'), {
      dont_parse_links: true,
    });
  },
};
