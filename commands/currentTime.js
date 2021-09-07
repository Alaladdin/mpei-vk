const { formatDate } = require('../helpers');

module.exports = {
  name              : 'time',
  description       : 'текущее время по МСК',
  arguments         : [{ name: 'format', description: 'Формат вывода https://date-fns.org/v2.23.0/docs/format' }],
  lowercaseArguments: false,
  execute(ctx, args) {
    const [format] = args;
    const today = formatDate(Date.now(), format || 'HH:mm');

    ctx.send(`${today}`);
  },
};
