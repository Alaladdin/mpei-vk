const fs = require('fs');
const path = require('path');
const createImage = require('../functions/createImage');
const getFormattedSchedule = require('../functions/getFormattedSchedule');
const { texts } = require('../data/messages');
const schedulePeriods = require('../data/schedulePeriods');

const outPath = path.resolve(__dirname, '../files/userCreated.png');

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

    const fileData = await fs.promises.readFile(outPath);

    return vk.upload.messagePhoto({ peer_id: ctx.peerId, source: { value: fileData } })
      .then(async (image) => {
        await ctx.send(texts.uselessAlert);
        await ctx.send(`${texts.scheduleFor} ${selectedPeriod.name}`);
        await ctx.send({ attachment: `photo${image.ownerId}_${image.id}` });
      })
      .catch((e) => {
        console.error(e);
        ctx.send(texts.totalCrash);
      });
  },
};
