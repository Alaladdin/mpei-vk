const isAdmin = require('../functions/isAdmin');
const { getters: storeGetters, setters: storeSetter } = require('../store');

module.exports = {
  name: 'config:hate',
  description: 'настройки хейта на тупые вопросы',
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

    const currentState = storeGetters.getIsHateOnQuestions();
    const stateText = (state) => (state ? 'включен' : 'выключен');

    if (!args.length) {
      const hatesCount = storeGetters.getHateTriggersCount();
      ctx.reply(`Хейт сейчас ${stateText(currentState)}\nКол-во реакций: ${hatesCount}`);
    }

    if (args[0] === 'toggle') {
      const newState = !currentState;

      await storeSetter.setIsHateOnQuestions(newState)
        .then(() => {
          ctx.reply(`Хейт теперь ${stateText(newState)}`);
        })
        .catch(() => {
          ctx.reply('Ошибка при попытке изменить настройки');
        });
    }
  },
};
