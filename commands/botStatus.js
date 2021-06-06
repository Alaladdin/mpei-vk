const priority = require('../data/priority');
const { getters, setters } = require('../store');

module.exports = {
  name: 'botstatus',
  description: 'Получает состояние бота',
  hidden: true,
  arguments: [
    {
      name: 'toggle',
      description: 'переключает состояние',
    },
  ],
  async execute(ctx, args) {
    if (!priority.admin.map((a) => a.userId).includes(ctx.peerId)) return;

    const botStatus = getters.getBotStatus();

    if (args[0] === 'toggle') {
      await setters.setBotStatus(!botStatus)
        .then(() => {
          ctx.reply('success');
        })
        .catch((err) => {
          console.log(err);
          ctx.reply(`Error: ${err.statusText}`);
        });
    } else {
      ctx.send(`current state: ${botStatus ? 'active' : 'inactive'}`);
    }
  },
};
