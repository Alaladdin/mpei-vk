const schedule = require('node-schedule');
const { format } = require('../util/pdate');
const getChatMembers = require('../functions/getChatMembers');
const sendMessage = require('../functions/sendMessage');
const pactuality = require('../functions/actuality');
const pschedule = require('../functions/schedule');
const { chatIds, serverDateFormat } = require('../config');

module.exports = {
  name: 'crons',
  description: 'set cron',
  async init(vk) {
    // actuality every day at 9:00:00
    schedule.scheduleJob('0 0 9 * * *', async () => {
      const { actuality } = await pactuality.get();

      if (actuality && 'content' in actuality) {
        const msg = [];
        msg.push(`Актуалити. Обновлено: ${format(actuality.date)}\n`);
        msg.push(`${actuality.content}`);

        chatIds.forEach((chat) => {
          sendMessage(vk, {
            peerId: chat.peerId,
            message: msg.join('\n'),
          });
        });
      }
    });

    // schedule every day at 9:05:00
    schedule.scheduleJob('0 5 9 * * *', async () => {
      const today = format(new Date(), serverDateFormat);
      const s = await pschedule.get({ start: today, finish: today });
      const scheduleToday = s.schedule || null;

      if (typeof scheduleToday !== 'object' && !Array.isArray(scheduleToday)) return;

      scheduleToday.forEach((item) => {
        const itemData = [];

        const {
          date,
          discipline,
          dayOfWeekString,
          kindOfWork,
          beginLesson,
          endLesson,
          lecturer,
        } = item;

        itemData.push(`[${dayOfWeekString}] ${discipline} - ${format(date)}`);
        itemData.push(kindOfWork);
        itemData.push(`${beginLesson} - ${endLesson}`);
        itemData.push(lecturer);

        chatIds.forEach((chat) => {
          sendMessage(vk, {
            peerId: chat.peerId,
            message: itemData.join('\n'),
          });
        });
      });
    });

    // birthdays check
    schedule.scheduleJob('0 0 12 * * *', async () => {
      const mainChat = chatIds.find((chat) => chat.name === 'main');
      const res = await getChatMembers(vk, {
        peerId: mainChat && mainChat.peerId,
        fields: ['bdate'],
      })
        .catch(() => false);

      if (!res) return;

      const today = format(Date.now(), 'd.M');
      const todayBirthUsers = res.profiles.filter((profile) => {
        if (!profile.bdate) return false;

        const userBirthArr = profile.bdate.split('.');
        const userBirth = `${userBirthArr[0]}.${userBirthArr[1]}`;
        return userBirth === today;
      });

      todayBirthUsers.forEach((user) => {
        const userFullName = `${user.first_name} ${user.last_name}`;

        sendMessage(vk, {
          peerId: mainChat.peerId,
          message: `У @id${user.id} (${userFullName}) сегодня день рождения`,
          dontParseLinks: false,
        });
      });
    });
  },
};
