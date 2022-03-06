const { compact } = require('lodash');
const { getters:  storeGetters } = require('../store');
const { texts } = require('../data/messages');
const { getActuality, sendAsImage } = require('../functions');

module.exports = {
  name       : 'actuality',
  description: 'актуалочка',
  aliases    : ['a', 'act', 'акт'],
  arguments  : [{ name: 'lazy', description: 'несрочная актуалочка' }],
  async execute(ctx, args, vk) {
    const { actuality, sendData } = await this.getActualityData(args);

    if (!actuality) return ctx.send(texts.databaseError);
    if (!sendData.message) return ctx.send(sendData.emptyTitle);

    return sendAsImage({
      message: sendData.message,
      title  : sendData.title,
      peerId : ctx.peerId,
      vk,
    })
      .catch(() => ctx.send(texts.totalCrash));
  },
  async getActualityData(args) {
    const actuality = await getActuality();
    const sendData = storeGetters.getIsConcatActualities()
      ? this.getConcatenatedActualitiesMessageData(actuality)
      : this.getActualityMessageData(actuality, args);

    return { actuality, sendData };
  },
  getConcatenatedActualitiesMessageData(actuality) {
    const mainAct = actuality.content ? `// Актуалочка\n\n${actuality.content}` : '';
    const lazyAct = actuality.lazyContent ? `// Несрочная актуалочка\n\n${actuality.lazyContent}` : '';
    const message = compact([mainAct, lazyAct]).join('\n\n\n');

    return {
      message,
      title     : 'Актуалочки',
      emptyTitle: 'Актуалочки пусты 😔',
    };
  },
  getActualityMessageData(actuality, args) {
    const actualityContent = args[0] === 'lazy' ? 'lazyContent' : 'content';
    const { title, emptyTitle } = this.getActualityOutputData(actualityContent);

    return {
      message: actuality[actualityContent],
      title,
      emptyTitle,
    };
  },
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
};
