const { getters: storeGetters, setters: storeSetter } = require('../store');

module.exports = {
  name: 'config:hate',
  description: 'настройки хейта на тупые вопросы',
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
    const currentState = storeGetters.getIsHateOnQuestions();
    const getStateText = (state) => (state ? 'включен' : 'выключен');

    if (!args.length) {
      const hatesCount = storeGetters.getHateTriggersCount();
      ctx.reply(`Хейт сейчас ${getStateText(currentState)}\nКол-во реакций: ${hatesCount}`);
    } else if (args[0] === 'toggle') {
      const newState = !currentState;

      await storeSetter.setIsHateOnQuestions(newState)
        .then(() => {
          ctx.reply(`Хейт теперь ${getStateText(newState)}`);
        })
        .catch(() => {
          ctx.reply('Ошибка при попытке изменить настройки');
        });
    }
  },
};
