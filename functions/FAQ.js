const fetch = require('node-fetch');
const { getFAQUrl } = require('../data/requests');

module.exports = {
  name: 'FAQ',
  async get() {
    // get FAQ data
    return fetch(getFAQUrl)
      .then(async (res) => {
        const json = await res.json();

        // if request error
        if (!res.ok) throw new Error(json.error);

        return json;
      })
      .catch(console.error);
  },
};
