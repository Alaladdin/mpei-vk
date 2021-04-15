const fetch = require('node-fetch');
const filterArray = require('../utility/filterArray');
const { serverAddress } = require('../config');

module.exports = {
  name: 'actuality',
  async get({ start, finish } = {}) {
    const url = new URL(`${serverAddress}/api/getSchedule/`);

    if (start) url.searchParams.append('start', start);
    if (finish) url.searchParams.append('finish', finish);
    return fetch(url.href)
      .then(async (res) => {
        const json = await res.json();
        const { schedule } = json || {};

        // if request error
        if (!res.ok) throw new Error(res.statusText);

        if (typeof schedule === 'object' && Array.isArray(schedule) && schedule.length) {
          const scheduleLength = schedule ? schedule.length : 0;
          const indexesToDelete = [];

          // compare two nearest array elements
          for (let i = 0; i <= scheduleLength - 2; i += 2) {
            const c = schedule[i]; // current elements
            const n = schedule[i + 1]; // next element
            if (!n) break; // stop loop, if next element not exists

            if (
              (c.date === n.date)
              && (c.discipline === n.discipline)
              && (c.kindOfWork === n.kindOfWork)
              && (c.lecturer === n.lecturer)
            ) {
              // combine two array elements
              schedule[i].endLesson = n.endLesson;
              indexesToDelete.push(i + 1);
            }
          }

          // filter array
          return { schedule: filterArray(schedule, indexesToDelete) };
        }

        return json;
      })
      .catch(console.error);
  },
};
