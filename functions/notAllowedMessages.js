const { texts, blacklist } = require('../data/messages');
const { getters: storeGetters, setters: storeSetters } = require('../store');
const getChatMembers = require('./getChatMembers');
const { chatIds } = require('../config');

const { replies, questions } = texts;

module.exports = {
  name: 'notAllowedMessages',
  async execute(ctx, message, vk) {
    const userMessage = message.toLowerCase();

    // blacklist words
    if (blacklist.includes(userMessage)) ctx.reply(replies.dontDoThat);

    // hate on stupid questions
    const hatersLegionChat = chatIds.find((chat) => chat.name === 'HATE_GERA');
    const hatersLegion = await getChatMembers(vk, { peerId: hatersLegionChat.peerId });
    const hatersLegionList = hatersLegion.profiles.map((profile) => profile.id);
    const isHateOnQuestions = await storeGetters.getIsHateOnQuestions();
    const isTriggerMessage = questions.find((question) => userMessage.match(question));

    if (isHateOnQuestions && isTriggerMessage && !hatersLegionList.includes(ctx.senderId)) {
      await storeSetters.incrementHateTriggersCount();
      ctx.reply(replies.fuckThisQuestion);
    }
  },
};
