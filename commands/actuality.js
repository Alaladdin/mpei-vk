const { texts } = require('../data/messages');
const { getActuality, sendAsImage } = require('../functions');

const actualityInfo = {
  content: {
    title     : 'Актуалити',
    emptyTitle: 'Актуалочка пуста 😔',
  },
  lazyContent: {
    title     : 'Несрочное актуалити',
    emptyTitle: 'Несрочная актуалочка пуста 😔',
  },
};

module.exports = {
  name       : 'actuality',
  description: 'актуалочка',
  aliases    : ['a', 'act', 'акт'],
  arguments  : [{ name: 'lazy', description: 'несрочная актуалочка' }],
  async execute(ctx, args, vk) {
    const actualityData = await this.getActualityData(args);

    if (!actualityData.message)
      return ctx.send(actualityData.emptyTitle);

    return sendAsImage({
      message: actualityData.message,
      title  : actualityData.title,
      peerId : ctx.peerId,
      vk,
    })
      .catch(() => ctx.send(texts.totalCrash));
  },
  async getActualityData(args) {
    const actuality = await getActuality();
    const actualityContent = args[0] === 'lazy' ? 'lazyContent' : 'content';

    return {
      message: actuality && actuality[actualityContent].replaceAll('`', '').trim(),
      ...actualityInfo[actualityContent],
    };
  },
};
