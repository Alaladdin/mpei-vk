const { admin } = require('../data/roles');

module.exports = {
  name: 'kik',
  description: 'Кикает пользователя с сервера',
  usage: '[user]',
  aliases: ['kik', 'ban', 'кик', 'бан'],
  roles: [admin],
  execute(message) {
    if (!message.guild) return;
    const messageAuthor = message.guild.member(message.author);
    const hasPermission = messageAuthor.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']);
    const user = message.mentions.users.first();

    if (!hasPermission) {
      message.reply('у тебя недостаточно прав для таких приколов');
      return;
    }

    if (user) {
      const member = message.guild.member(user);

      if (member) {
        if (member.roles.cache.some((role) => role.id === admin)) {
          message.reply('людей с правами админа давайте-ка сами кикайте');
          return;
        }

        member
          .kick()
          .then(() => {
            message.reply(`${user.username} был кикнут с позором.`);
          })
          .catch((err) => {
            message.reply('не могу его кикнуть');
            console.error(err);
          });
      } else {
        message.reply('пользователя нет на сервере');
      }
    } else {
      message.reply('кикнуть кого-то я всегда рад, но ты скажи, кого');
    }
  },
};
