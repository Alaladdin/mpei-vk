const fetch = require('node-fetch');
const { serverAddress } = require('../config');

module.exports = {
  name: 'actuality',
  async get() {
    // get actuality data
    return fetch(`${serverAddress}/getActuality`)
      .then(async (res) => {
        const json = await res.json();

        if (!res.ok) throw new Error(json.error);

        return json;
      });
  },
};
