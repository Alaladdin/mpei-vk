const { getters: storeGetters, setters: storeSetter } = require('../store');

module.exports = {
  name       : 'config:concat',
  description: 'настройки объединения актуалочек',
  hidden     : true,
  adminOnly  : true,
  arguments  : [{ name: 'toggle', description: 'переключает объединение' }],
  async execute(ctx, args) {
    if (!args.length) {
      const currentStatusText = this.getStatusText();

      ctx.reply(`Объединение актуалочек ${currentStatusText}`);
    } else if (args[0] === 'toggle') {
      await this.toggleAutoposting(ctx);
    }
  },
  async toggleAutoposting(ctx) {
    const isEnabled = storeGetters.getIsConcatActualities();

    await storeSetter.setConcatActualities(!isEnabled)
      .then(() => ctx.reply(`Объединение актуалочек теперь ${this.getStatusText()}`))
      .catch(() => ctx.reply('Ошибка при попытке изменить настройки'));
  },
  getStatusText() {
    const isEnabled = storeGetters.getIsConcatActualities();

    return isEnabled ? 'включено' : 'выключено';
  },
};
