const fetch = require('node-fetch');
const { getFAQUrl } = require('../data/requests');

module.exports = {
  name: 'FAQ',
  async get() {
    return fetch(getFAQUrl)
      .then(async (res) => {
        const json = await res.json();

        if (!res.ok) throw (json.error);

        return json;
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });
  },
};
