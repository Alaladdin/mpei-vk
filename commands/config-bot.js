const { getters: storeGetters, setters: storeSetter } = require('../store');

module.exports = {
  name       : 'config:bot',
  description: 'состояние бота',
  hidden     : true,
  adminOnly  : true,
  arguments  : [{ name: 'toggle', description: 'Переключает состояние' }],
  async execute(ctx, args) {
    const currentStatus = storeGetters.getBotStatus();
    const getStateText = (state) => (state ? 'включен' : 'выключен');

    if (!args.length) {
      ctx.reply(`Бот ${getStateText(currentStatus)}`);
    } else if (args[0] === 'toggle') {
      const newState = !currentStatus;

      await storeSetter.setBotStatus(newState)
        .then(() => ctx.reply(`Бот теперь: ${getStateText(newState)}`))
        .catch(() => ctx.reply('Ошибка при попытке изменить настройки'));
    }
  },
};
