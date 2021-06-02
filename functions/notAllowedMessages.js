const { hateOnQuestions } = require('../config');
const { texts, blacklist } = require('../data/messages');

const { replies, questions } = texts;

// todo bot toggle reply via command
// todo bot get store config from server

module.exports = {
  name: 'notAllowedMessages',
  async execute(ctx, message) {
    const userMessage = message.toLowerCase();

    // blacklist words
    if (blacklist.includes(userMessage)) ctx.reply(replies.dontDoThat);

    // hate on stupid questions
    if (hateOnQuestions && questions.find((question) => userMessage.match(question))) ctx.reply(replies.fuckThisQuestion);
  },
};
