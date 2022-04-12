const fetch = require('node-fetch');
const { getActualityUrl } = require('../data/requests');

module.exports = () => fetch(getActualityUrl)
  .then(async (res) => {
    const json = await res.json();

    if (!res.ok) throw (json.error);

    return json.actuality;
  })
  .catch((err) => {
    console.error(err);

    return null;
  });
