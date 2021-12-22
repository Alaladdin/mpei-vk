const getSchedule = require('./getSchedule');

module.exports = async (args, { start, finish }) => {
  const isShowAllFields = args.includes('all');
  const schedules = [];

  const scheduleResult = await getSchedule(start, finish)
    .then(async (schedule) => {
      if (!schedule.length) return false;
      const defaultLessonTime = '18:55 - 22:00';

      return schedule.forEach((s) => {
        const itemData = [];
        const lessonTime = `${s.beginLesson} - ${s.endLesson}`;

        itemData.push(`[${s.dayOfWeekString}] ${s.date} - ${s.disciplineAbbr}`);
        itemData.push(`Тип: ${s.kindOfWork}`);

        if (isShowAllFields || lessonTime !== defaultLessonTime) itemData.push(`Время: ${lessonTime}`);
        if (isShowAllFields) itemData.push(`Препод: ${s.lecturer}`);
        if (s.building !== '-') itemData.push(`Кабинет: ${s.auditorium} (${s.building})`);
        if (s.group) itemData.push(`Группа: ${s.group}`);

        schedules.push(itemData.join('\n'));
      });
    })
    .catch(() => null);

  return scheduleResult !== null ? schedules.join('\n\n') : null;
};
