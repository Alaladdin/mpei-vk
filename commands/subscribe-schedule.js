const { getters: storeGetters, setters: storeSetter } = require('../store');
const { isAdmin } = require('../helpers');

module.exports = {
  name       : 'subscribe:schedule',
  description: 'Подписка на уведомления перед парой',
  aliases    : ['ss'],
  arguments  : [{ name: 'toggle', description: 'переключает подписку' }],
  async execute(ctx, args) {
    if (!isAdmin(ctx.senderId))
      return ctx.reply('Команда тестируется, не трохай');

    if (!isAdmin(ctx.senderId) && !ctx.isChat)
      return ctx.reply('Подписку чата могут переключать только админы. Для уведомлений в лс, пиши боту');

    if (args[0] === 'toggle')
      return this.toggleSubscription(ctx);

    const currentStatusText = this.getStatusText(ctx);

    return ctx.reply(`Уведомления ${currentStatusText}`);
  },
  async toggleSubscription(ctx) {
    await storeSetter.setScheduleSubscribers(ctx.peerId)
      .then(() => ctx.reply(`Уведомления теперь ${this.getStatusText(ctx)}`))
      .catch(() => ctx.reply('Ошибка при попытке изменить настройки'));
  },
  getStatusText(ctx) {
    const scheduleSubscribers = storeGetters.getScheduleSubscribers();
    const isEnabled = scheduleSubscribers.includes(ctx.peerId);

    return isEnabled ? 'включены' : 'выключены';
  },
};
