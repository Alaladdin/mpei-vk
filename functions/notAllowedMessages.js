const { texts, blacklist } = require('../data/messages');
const { getters: storeGetters, setters: storeSetters } = require('../store');

const { replies, questions } = texts;

module.exports = {
  name: 'notAllowedMessages',
  async execute(ctx, message) {
    const userMessage = message.toLowerCase();

    // blacklist words
    if (blacklist.includes(userMessage)) ctx.reply(replies.dontDoThat);

    // hate on stupid questions
    const isHateOnQuestions = await storeGetters.getIsHateOnQuestions();
    const isTriggerMessage = questions.find((question) => userMessage.match(question));

    if (isHateOnQuestions && isTriggerMessage) {
      await storeSetters.incrementHateTriggersCount();
      ctx.reply(replies.fuckThisQuestion);
    }
  },
};
