const { version } = require('../package.json');
const { prefixes, isProd } = require('../config');
const { sendAsImage } = require('../functions');
const { texts } = require('../data/messages');

const DEFAULT_USER = {
  domain    : 'unknown',
  first_name: 'unknown',
  last_name : 'unknown',
  is_closed : 'unknown',
};

const USER_FIELDS = [
  'domain',
  'status',
  'bdate',
];

module.exports = {
  name       : 'debug',
  description: 'отладочная информация',
  hidden     : true,
  async execute(ctx, args, vk) {
    const msg = [];
    const sender = await vk.api.users.get({ user_ids: [ctx.senderId], fields: USER_FIELDS })
      .then((users) => users[0] || DEFAULT_USER)
      .catch((error) => {
        console.error(error);

        return DEFAULT_USER;
      });

    msg.push('# bot');
    msg.push(`version: ${version}`);
    msg.push(`prefixes: "${prefixes.join('" "')}"`);
    msg.push(`isProduction: ${isProd}`);

    msg.push('\n# chat');
    msg.push(`id: ${ctx.peerId}`);
    msg.push(`type: ${ctx.peerType}`);

    msg.push('\n# user');
    msg.push(`id: ${ctx.senderId}`);
    msg.push(`domain: ${sender.domain}`);

    if (sender.status)
      msg.push(`status: ${sender.status}`);

    msg.push(`firstName: ${sender.first_name}`);
    msg.push(`lastName: ${sender.last_name}`);

    if (sender.bdate)
      msg.push(`birthdatDate: ${sender.bdate}`);

    msg.push(`isPagePrivate: ${sender.is_closed}`);

    return sendAsImage({ message: msg.join('\n'), peerId: ctx.peerId, vk })
      .catch(() => ctx.send(texts.totalCrash));
  },
};
