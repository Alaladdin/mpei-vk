const fetch = require('node-fetch');
const { getActualityUrl } = require('../data/requests');

module.exports = {
  name: 'actuality',
  async get() {
    // get actuality data
    return fetch(getActualityUrl)
      .then(async (res) => {
        const json = await res.json();

        if (!res.ok) throw new Error(json.error);

        return json;
      });
  },
};
