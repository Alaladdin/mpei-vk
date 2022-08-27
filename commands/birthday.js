const { chain, findIndex } = require('lodash');
const moment = require('moment');
const { getChatMembers, handleError } = require('../helpers');
const { sendAsImage } = require('../functions');
const { mainChat } = require('../config');
const { texts } = require('../data/messages');

module.exports = {
  name              : 'birthdays',
  description       : 'дни рождения в чате',
  aliases           : ['b'],
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
    const newChatMembers = chain(chatMembers)
      .filter('bdate')
      .map((member) => ({
        fullName: `${member.first_name} ${member.last_name}`,
        bdate: moment(member.bdate, 'D.M').format('DD.MM'),
        dateForSort: moment(member.bdate, 'D.M').format('MM.DD'),
        dateForGroup: moment(member.bdate, 'D.M').format('MM'),
      }))
      .sortBy('dateForSort')
      .value();

    const nearestBirthdayIndex = findIndex(newChatMembers, ({ dateForSort }) => dateForSort > today);

    return chain(newChatMembers)
      .chunk(nearestBirthdayIndex)
      .reverse()
      .flatten()
      .map((member, i, members) => {
        const separator = `${i && members[i - 1].dateForGroup !== member.dateForGroup ? '\n' : ''}`;

        return `${separator}${member.bdate} — ${member.fullName}`;
      })
      .value()
      .join('\n');
  },
};
