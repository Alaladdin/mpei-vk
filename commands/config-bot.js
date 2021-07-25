const { getters: storeGetters, setters: storeSetter } = require('../store');

module.exports = {
  name: 'config:bot',
  description: 'состояние бота',
  hidden: true,
  adminOnly: true,
  stats: false,
  arguments: [
    {
      name: 'toggle',
      description: 'Переключает состояние',
    },
  ],
  async execute(ctx, args) {
    const currentState = storeGetters.getBotStatus();
    const getStateText = (state) => (state ? 'включен' : 'выключен');

    if (!args.length) {
      ctx.reply(`Статус: ${getStateText(currentState)}`);
    } else if (args[0] === 'toggle') {
      const newState = !currentState;

      await storeSetter.setBotStatus(newState)
        .then(() => {
          ctx.reply(`Автопостинг теперь: ${getStateText(newState)}`);
        })
        .catch(() => {
          ctx.reply('Ошибка при попытке изменить настройки');
        });
    }
  },
};
