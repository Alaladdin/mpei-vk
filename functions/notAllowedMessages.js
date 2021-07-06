const { chats } = require('../config');
const { getters: storeGetters, setters: storeSetters } = require('../store');
const getChatMembers = require('./getChatMembers');
const isAdmin = require('./isAdmin');
const { texts, blacklist } = require('../data/messages');

const { replies, questions } = texts;

module.exports = {
  name: 'notAllowedMessages',
  async execute(ctx, message, vk) {
    if (isAdmin(ctx.senderId) || !message || !storeGetters.getBotStatus()) return;

    const userMessage = message.toLowerCase();

    this.blackListedWordsTrigger(userMessage, ctx);
    await this.hateOnQuestionTrigger(userMessage, ctx, vk);
  },
  blackListedWordsTrigger(message, ctx) {
    if (blacklist.includes(message)) ctx.reply(replies.dontDoThat);
  },
  async hateOnQuestionTrigger(message, ctx, vk) {
    // hate on stupid questions
    const isHateOnQuestions = await storeGetters.getIsHateOnQuestions();
    const isTriggerMessage = questions.find((question) => message.match(question));
    const hatersLegion = await getChatMembers(vk, { peerId: chats.hateGera });
    const hatersLegionList = hatersLegion.profiles.map((profile) => profile.id);

    if (isHateOnQuestions && isTriggerMessage && !hatersLegionList.includes(ctx.senderId)) {
      await storeSetters.incrementHateTriggersCount();
      ctx.reply(replies.fuckThisQuestion);
    }
  },
};
