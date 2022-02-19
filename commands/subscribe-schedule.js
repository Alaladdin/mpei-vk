const { getters: storeGetters, setters: storeSetter } = require('../store');
const { isAdmin } = require('../helpers');

module.exports = {
  name       : 'subscribe:schedule',
  description: 'Подписка на уведомления перед парой',
  aliases    : ['ss'],
  arguments  : [{ name: 'toggle', description: 'переключает подписку' }],
  async execute(ctx, args) {
    if (!isAdmin(ctx.senderId)) {
      ctx.reply('Команда тестируется, не трохай');
      return;
    }

    if (!args.length) {
      const currentStatusText = this.getStatusText(ctx);

      ctx.reply(`Уведомления ${currentStatusText}`);
    } else if (args[0] === 'toggle') {
      await this.toggleSubscription(ctx);
    }
  },
  async toggleSubscription(ctx) {
    await storeSetter.setScheduleSubscribers(ctx.peerId)
      .then(() => ctx.reply(`Уведомления ${this.getStatusText(ctx)}`))
      .catch(() => ctx.reply('Ошибка при попытке изменить настройки'));
  },
  getStatusText(ctx) {
    const scheduleSubscribers = storeGetters.getScheduleSubscribers();
    const isEnabled = scheduleSubscribers.includes(ctx.peerId);

    return isEnabled ? 'включены' : 'выключены';
  },
};
