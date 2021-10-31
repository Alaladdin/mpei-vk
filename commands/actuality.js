const { texts } = require('../data/messages');
const { getActuality, sendAsImage } = require('../functions');

module.exports = {
  name       : 'actuality',
  description: 'актуалочка',
  aliases    : ['a', 'act', 'акт'],
  arguments  : [{ name: 'lazy', description: 'несрочная актуалочка' }],
  getActualityOutputData(contentType) {
    const actualityData = {
      content: {
        title     : 'Актуалити',
        emptyTitle: 'Актуалочка пуста 😔',
      },
      lazyContent: {
        title     : 'Несрочное актуалити',
        emptyTitle: 'Несрочная актуалочка пуста 😔',
      },
    };

    return actualityData[contentType];
  },
  async execute(ctx, args, vk) {
    const [command] = args;
    const isLazy = !!command && command.toLowerCase() === 'lazy';
    const content = isLazy ? 'lazyContent' : 'content';
    const { title: actualityTitle, emptyTitle: actualityEmptyTitle } = this.getActualityOutputData(content);
    const actuality = await getActuality();

    if (!actuality) return ctx.send(texts.databaseError);
    if (!actuality[content]) return ctx.send(actualityEmptyTitle);

    return sendAsImage({
      message: actuality[content],
      title  : actualityTitle,
      peerId : ctx.peerId,
      vk,
    })
      .catch(() => ctx.send(texts.totalCrash));
  },
};
