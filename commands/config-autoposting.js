const { getters: storeGetters, setters: storeSetter } = require('../store');

module.exports = {
  name       : 'config:au',
  description: 'настройки автопостинга',
  hidden     : true,
  adminOnly  : true,
  arguments  : [{ name: 'toggle', description: 'Переключает состояние активности' }],
  getIsAutopostingEnabled() {
    const actualityAutoposting = storeGetters.getActualityAutoposting();

    return actualityAutoposting.isEnabled;
  },
  getStatusText() {
    const isEnabled = this.getIsAutopostingEnabled();

    return isEnabled ? 'включен' : 'выключен';
  },
  async toggleAutoposting(ctx) {
    const isEnabled = this.getIsAutopostingEnabled();

    await storeSetter.setActualityAutopostingStatus(!isEnabled)
      .then(() => ctx.reply(`Автопостинг актуалочки теперь ${this.getStatusText()}`))
      .catch(() => ctx.reply('Ошибка при попытке изменить настройки'));
  },
  async execute(ctx, args) {
    if (!args.length) {
      const currentStatus = this.getStatusText();

      ctx.reply(`Автопостинг актуалочки ${currentStatus}`);
    } else if (args[0] === 'toggle') {
      await this.toggleAutoposting(ctx);
    }
  },
};
