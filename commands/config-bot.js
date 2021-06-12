const isAdmin = require('../functions/isAdmin');
const { getters: storeGetters, setters: storeSetter } = require('../store');

module.exports = {
  name: 'config:bot',
  description: 'Получает состояние бота (включен, выключен)',
  hidden: true,
  admin: true,
  stats: false,
  arguments: [
    {
      name: 'toggle',
      description: 'Переключает состояние',
    },
  ],
  async execute(ctx, args) {
    if (!isAdmin(ctx.senderId)) return;

    const currentState = storeGetters.getBotStatus();
    const stateText = (state) => (state ? 'включен' : 'выключен');

    if (!args.length) ctx.reply(`Бот сейчас ${stateText(currentState)}`);

    if (args[0] === 'toggle') {
      const newState = !currentState;

      await storeSetter.setBotStatus(newState)
        .then(() => {
          ctx.reply(`Бот теперь ${stateText(newState)}`);
        })
        .catch(() => {
          ctx.reply('Ошибка при попытке изменить настройки');
        });
    }
  },
};
