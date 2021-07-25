const { getters: storeGetters, setters: storeSetter } = require('../store');

module.exports = {
  name: 'config:au',
  description: 'настройки автопостинга',
  hidden: true,
  adminOnly: true,
  stats: false,
  arguments: [
    {
      name: 'toggle',
      description: 'Переключает состояние активности',
    },
  ],
  async execute(ctx, args) {
    const actualityConfig = storeGetters.getActualityConfig();
    const getStateText = (state) => (state ? 'включен' : 'выключен');

    if (!args.length) {
      const msg = ['Текущие настройки автопостинга'];
      msg.push(`Статус: ${getStateText(actualityConfig.enabled)}`);
      ctx.reply(msg.join('\n'));
    } else if (args[0] === 'toggle') {
      const newState = !actualityConfig.enabled;

      await storeSetter.setAutopostingStatus(newState)
        .then(() => {
          ctx.reply(`Автопостинг актуалочки теперь ${getStateText(newState)}`);
        })
        .catch(() => {
          ctx.reply('Ошибка при попытке изменить настройки');
        });
    }
  },
};
