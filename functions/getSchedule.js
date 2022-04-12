const fetch = require('node-fetch');
const { getScheduleUrl } = require('../data/requests');

module.exports = (start, finish) => {
  const url = new URL(getScheduleUrl);

  if (start) url.searchParams.append('start', start);
  if (finish) url.searchParams.append('finish', finish);

  return fetch(url.href)
    .then(async (res) => {
      const json = await res.json();

      if (!res.ok) throw (res.error);

      return json.schedule;
    })
    .catch((err) => {
      console.error(err);

      throw err;
    });
};
