const { chain } = require('lodash');
const moment = require('moment');
const { getChatMembers, handleError } = require('../helpers');
const { sendAsImage } = require('../functions');
const { mainChat } = require('../config');
const { texts } = require('../data/messages');

module.exports = {
  name       : 'birthdays',
  description: 'дни рождения в чате',
  aliases    : ['b'],
  async execute(ctx, args, vk) {
    getChatMembers(vk, { peerId: mainChat, fields: ['bdate'] })
      .then((chatMembers) => sendAsImage({
        title  : 'Дни рождения феечек',
        message: this.getFormattedChatMembers(chatMembers.profiles),
        peerId : ctx.peerId,
        vk,
      }))
      .catch((error) => handleError(error, vk))
      .catch(() => ctx.send(texts.totalCrash));
  },
  getFormattedChatMembers(chatMembers) {
    const today = moment().format('MM.DD');
    const sortedChatMembers = chain(chatMembers)
      .filter('bdate')
      .map((member) => {
        const birthdayDate = moment(member.bdate, 'D.M');

        return {
          fullName   : `${member.first_name} ${member.last_name}`,
          bdate      : birthdayDate.format('DD.MM'),
          dateForSort: birthdayDate.format('MM.DD'),
          group      : birthdayDate.format('MM'),
        };
      })
      .sortBy('dateForSort')
      .value();

    return chain(sortedChatMembers)
      .groupBy((member) => member.dateForSort > today)
      .values()
      .reverse()
      .flatten()
      .map((member, i, members) => {
        const prevMember = members[i - 1] || member;
        let description = `${member.bdate} — ${member.fullName}`;

        if (member.group !== prevMember.group)
          description = `\n${description}`;

        return description;
      })
      .value()
      .join('\n');
  },
};
