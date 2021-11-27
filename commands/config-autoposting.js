const { getters: storeGetters, setters: storeSetter } = require('../store');

module.exports = {
  name       : 'config:au',
  description: 'настройки автопостинга',
  hidden     : true,
  adminOnly  : true,
  arguments  : [{ name: 'toggle', description: 'Переключает состояние активности' }],
  async execute(ctx, args) {
    if (!args.length) {
      const currentStatusText = this.getStatusText();

      ctx.reply(`Автопостинг актуалочки ${currentStatusText}`);
    } else if (args[0] === 'toggle') {
      await this.toggleAutoposting(ctx);
    }
  },
  async toggleAutoposting(ctx) {
    const isEnabled = storeGetters.getIsActualityAutopostingEnabled();

    await storeSetter.setActualityAutopostingStatus(!isEnabled)
      .then(() => ctx.reply(`Автопостинг актуалочки теперь ${this.getStatusText()}`))
      .catch(() => ctx.reply('Ошибка при попытке изменить настройки'));
  },
  getStatusText() {
    const isEnabled = storeGetters.getIsActualityAutopostingEnabled();

    return isEnabled ? 'включен' : 'выключен';
  },
};
