const { get: getFAQ } = require('../functions/FAQ');

module.exports = {
  name: 'faq',
  description: 'FAQ',
  aliases: ['f', 'qa'],
  async execute(ctx) {
    getFAQ()
      .then(({ faq }) => {
        const msg = [];

        if (faq.length) {
          msg.push('FAQ\n');
          faq.forEach((item) => {
            msg.push(item.question, `${item.answer}\n`);
          });
        } else {
          msg.push('FAQ пустой 😔');
        }

        ctx.send(msg.join('\n'));
      })
      .catch(() => {
        ctx.send('Непредвиденская ошибка сервера 😔');
      });
  },
};
