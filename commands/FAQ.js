const { get: getFAQ } = require('../functions/FAQ');

module.exports = {
  name: 'faq',
  description: 'FAQ',
  aliases: ['f', 'qa'],
  async execute(ctx) {
    const { faq } = await getFAQ() || {};
    const msg = [];

    if (faq && faq.length) {
      msg.push('FAQ\n');
      faq.forEach((item) => {
        msg.push(item.question, `${item.answer}\n`);
      });
    } else if (faq && !faq.length) {
      msg.push('FAQ пустой 😔');
    } else {
      msg.push('Непредвиденская ошибка сервера 😔');
    }

    ctx.send(msg.join('\n'));
  },
};
