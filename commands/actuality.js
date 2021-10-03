const fs = require('fs');
const { outImagePath } = require('../config');
const { texts } = require('../data/messages');
const { getActuality, createImage } = require('../functions');

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
    const actuality = await getActuality().catch(() => {});

    if (!actuality) return ctx.send(texts.databaseError);
    if (!actuality[content]) return ctx.send(actualityEmptyTitle);

    await createImage(actuality[content]);

    const fileData = await fs.promises.readFile(outImagePath);

    return vk.upload.messagePhoto({ peer_id: ctx.peerId, source: { value: fileData } })
      .then((image) => {
        ctx.send({
          message   : actualityTitle,
          attachment: `photo${image.ownerId}_${image.id}`,
        });
      })
      .catch((e) => {
        console.error(e);
        ctx.send(texts.totalCrash);
      });
  },
};
