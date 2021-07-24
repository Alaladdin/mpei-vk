const { format } = require('../util/pdate');
const pactuality = require('../functions/actuality');
const { texts } = require('../data/messages');

const {
  actuality: actualityTexts,
  status: statusTexts,
} = texts;

module.exports = {
  name: 'actuality',
  description: 'актуалочка',
  aliases: ['a', 'act', 'акт'],
  arguments: [
    {
      name: 'lazy',
      description: actualityTexts.arguments.lazy,
    },
  ],
  async execute(ctx, args) {
    pactuality.get()
      .then((actuality) => {
        const [command] = args;
        const msg = [];

        if (command && command.toLowerCase() === 'lazy') {
          msg.push('Несрочное актуалити\n');
          msg.push(actuality.lazyContent);
        } else {
          msg.push(`Актуалити. Обновлено: ${format(actuality.date)}\n`);
          msg.push(`${actuality.content}\n`);
        }

        ctx.send(msg.join('\n'));
      })
      .catch(() => {
        ctx.send(statusTexts.databaseError);
      });
  },
};
