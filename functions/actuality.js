const fetch = require('node-fetch');
const { serverAddress } = require('../config');

module.exports = {
  name: 'actuality',
  async get() {
    // get actuality data
    return fetch(`${serverAddress}/api/getActuality`)
      .then(async (res) => {
        const json = await res.json();

        // if request error
        if (!res.ok) throw new Error(json.error);

        return json;
      })
      .catch(console.error);
  },
};
