const fetch = require('node-fetch');
const { getScheduleUrl } = require('../data/requests');

module.exports = {
  name: 'actuality',
  async get({ start, finish } = {}) {
    const url = new URL(getScheduleUrl);

    if (start) url.searchParams.append('start', start);
    if (finish) url.searchParams.append('finish', finish);

    return fetch(url.href)
      .then(async (res) => {
        const json = await res.json();

        // if request error
        if (!res.ok) throw new Error(res.statusText);

        return json;
      })
      .catch(console.error);
  },
};
