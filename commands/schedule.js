const fs = require('fs');
const { getFormattedSchedule, createImage } = require('../functions');
const { texts } = require('../data/messages');
const schedulePeriods = require('../data/schedulePeriods');
const { outImagePath } = require('../config');

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

    await createImage(schedule);

    const fileData = await fs.promises.readFile(outImagePath);

    return vk.upload.messagePhoto({ peer_id: ctx.peerId, source: { value: fileData } })
      .then(async (image) => {
        await ctx.send({
          message   : `${texts.scheduleFor} ${selectedPeriod.name}`,
          attachment: `photo${image.ownerId}_${image.id}`,
        });
      })
      .catch((e) => {
        console.error(e);
        ctx.send(texts.totalCrash);
      });
  },
};
