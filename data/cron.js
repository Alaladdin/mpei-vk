const schedule = require('node-schedule');
const { chats, serverDateFormat } = require('../config');
const { getters: storeGetters } = require('../store');
const { format } = require('../util/pdate');
const getChatMembers = require('../functions/getChatMembers');
const sendMessage = require('../functions/sendMessage');
const pactuality = require('../functions/actuality');
const pschedule = require('../functions/schedule');

module.exports = {
  name: 'crons',
  description: 'set cron',
  async init(vk) {
    // actuality
    const actualityConfig = () => storeGetters.getActualityConfig();
    const { main: mainChat, spam: spamChat } = chats;

    schedule.scheduleJob('0 0 9 * * *', async () => {
      if (!actualityConfig().enabled) return;
      const { actuality } = await pactuality.get();

      if (actuality && 'content' in actuality) {
        const msg = [];

        msg.push(`Актуалити. Обновлено: ${format(actuality.date)}\n`);
        msg.push(`${actuality.content}`);

        [mainChat, spamChat].forEach((chat) => {
          sendMessage(vk, {
            peerId: chat,
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

        [mainChat, spamChat].forEach((chat) => {
          sendMessage(vk, {
            peerId: chat.peerId,
            message: itemData.join('\n'),
          });
        });
      });
    });

    // birthdays check
    schedule.scheduleJob('0 0 12 * * *', async () => {
      const res = await getChatMembers(vk, { peerId: mainChat, fields: ['bdate'] })
        .catch(() => false);

      if (!res) return;

      const today = format(Date.now(), 'd.M');
      const todayBirthUsers = res.profiles.filter((profile) => profile.bdate
        && profile.bdate.split('.').slice(0, 2).join('.') === today);

      todayBirthUsers.forEach((user) => {
        const userFullName = `${user.first_name} ${user.last_name}`;

        sendMessage(vk, {
          peerId: mainChat,
          message: `У @id${user.id} (${userFullName}) сегодня день рождения`,
          dontParseLinks: false,
        });
      });
    });
  },
};
