const fetch = require('node-fetch');
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

        // if request error
        if (!res.ok) throw new Error(json.error);

        return json;
      })
      .catch(console.error);
  },
};
