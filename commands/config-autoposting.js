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
    {
      name: 'time',
      description: 'Устанавливает время автопостинга',
    },
  ],
  async execute(ctx, args) {
    const actualityConfig = storeGetters.getActualityConfig();

    if (!args.length) {
      const msg = ['Текущие настройки автопостинга'];
      msg.push(`Статус: ${actualityConfig.enabled ? '' : 'не'} активен`);
      msg.push(`Время: ${actualityConfig.time}`);
      msg.push(`Чаты: ${actualityConfig.chatIds.join(', ')}`);
      ctx.reply(msg.join('\n'));
    }

    if (args[0] === 'toggle') {
      const newState = !actualityConfig.enabled;

      await storeSetter.setAutopostingStatus(newState)
        .then(() => {
          ctx.reply(`Автопостинг актуалочки теперь ${newState ? 'включен' : 'отключен'}`);
        })
        .catch(() => {
          ctx.reply('Ошибка при попытке изменить настройки');
        });
    }

    if (args[0] === 'time' && !args[1]) {
      ctx.reply(`Текущее время: ${actualityConfig.time}`);
      return;
    }

    if (args[0] === 'time') {
      const currentTime = actualityConfig.time;
      const newTime = args.slice(1).join(' ');

      await storeSetter.setAutopostingTime(newTime)
        .then(() => {
          ctx.reply(`Время автопостинга изменено с ${currentTime} на ${newTime}`);
        })
        .catch(() => {
          ctx.reply('Ошибка при попытке изменить настройки');
        });
    }
  },
};
