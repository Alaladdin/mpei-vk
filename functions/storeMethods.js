const fetch = require('node-fetch');
const { getStoreUrl, setStoreUrl } = require('../data/requests');

const getStore = () => fetch(getStoreUrl)
  .then(async (res) => {
    const json = await res.json();

    if (!res.ok) throw new Error(res.statusText);

    return json.store;
  })
  .catch((err) => {
    console.error(err);
    return err;
  });

const setStore = async (store) => fetch(setStoreUrl, {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ store }),
})
  .then(async (res) => {
    const json = await res.json();

    if (!res.ok) throw new Error(res.statusText);

    return json.store;
  });

module.exports = {
  getStore,
  setStore,
};
