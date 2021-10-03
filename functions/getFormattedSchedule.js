const getSchedule = require('./getSchedule');

module.exports = async (args, { start, finish }) => {
  const isShowAllFields = args.includes('all');
  const schedules = [];

  const scheduleResult = await getSchedule(start, finish)
    .then(async (schedule) => {
      if (!schedule.length) return false;

      return schedule.forEach((s) => {
        const itemData = [];

        itemData.push(`[${s.dayOfWeekString}] ${s.date} - ${s.disciplineAbbr}`);
        itemData.push(`Тип: ${s.kindOfWork}`);
        if (isShowAllFields) itemData.push(`Время: ${s.beginLesson} - ${s.endLesson}`);
        if (isShowAllFields) itemData.push(`Препод: ${s.lecturer}`);
        if (s.building !== '-') itemData.push(`Кабинет: ${s.auditorium} (${s.building})`);
        if (s.group) itemData.push(`Группа: ${s.group}`);

        schedules.push(itemData.join('\n'));
      });
    })
    .catch(() => {});

  return scheduleResult ? schedules.join('\n\n') : null;
};
