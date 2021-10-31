const { getFormattedSchedule, sendAsImage } = require('../functions');
const { texts } = require('../data/messages');
const schedulePeriods = require('../data/schedulePeriods');

module.exports = {
  name       : 'schedule',
  description: texts.schedule,
  aliases    : ['s', 'расписание', 'р'],
  arguments  : [
    { name: 'tw', description: texts.forTomorrow },
    { name: 'week', description: texts.forWeek },
    { name: 'month', description: texts.forMonth },
    { name: 'all', description: texts.all },
  ],
  async execute(ctx, args, vk) {
    const selectedPeriod = schedulePeriods.getSchedulePeriod(args[0]);
    const schedule = await getFormattedSchedule(args, selectedPeriod);

    if (schedule === null) return ctx.send(texts.mpeiServerError);
    if (!schedule.length) return ctx.send(texts.noClasses);

    return sendAsImage({
      title  : `${texts.scheduleFor} ${selectedPeriod.name}`,
      message: schedule,
      peerId : ctx.peerId,
      vk,
    })
      .catch(() => ctx.send(texts.totalCrash));
  },
};
