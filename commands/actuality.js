const { formatDate } = require('../helpers');
const getActuality = require('../functions/getActuality');
const { texts } = require('../data/messages');

module.exports = {
  name: 'actuality',
  description: 'актуалочка',
  aliases: ['a', 'act', 'акт'],
  arguments: [{ name: 'lazy', description: 'несрочная актуалочка' }],
  getActualityOutputData(contentType, actualityDate) {
    const actualityData = {
      content: {
        title: `Актуалити. Обновлено: ${formatDate(actualityDate)}`,
        emptyTitle: 'Актуалочка пуста 😔',
      },
      lazyContent: {
        title: 'Несрочное актуалити',
        emptyTitle: 'Несрочная актуалочка пуста 😔',
      },
    };

    return actualityData[contentType];
  },
  async execute(ctx, args) {
    getActuality()
      .then((actuality) => {
        const [command] = args;
        const isLazy = !!command && command.toLowerCase() === 'lazy';
        const content = isLazy ? 'lazyContent' : 'content';
        const selectedActualityData = this.getActualityOutputData(content, actuality.date);
        const msg = [];

        if (!actuality[content]) {
          msg.push(selectedActualityData.emptyTitle);
        } else {
          msg.push(selectedActualityData.title);
          msg.push(actuality[content]);
        }

        return ctx.send(msg.join('\n'));
      })
      .catch(() => {
        ctx.send(texts.databaseError);
      });
  },
};
