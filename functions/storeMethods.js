const fetch = require('node-fetch');
const { getStoreUrl, setStoreUrl } = require('../data/requests');
const { authToken } = require('../config');

const getStore = () => fetch(getStoreUrl, { headers: { authorization: authToken } })
  .then(async (res) => {
    const json = await res.json();

    if (!res.ok) throw (json.error);

    return json.store;
  })
  .catch((e) => {
    console.error(e);
    throw e;
  });

const setStore = async (store) => fetch(setStoreUrl, {
  method : 'post',
  headers: { 'Content-Type': 'application/json', authorization: authToken },
  body   : JSON.stringify({ store }),
})
  .then(async (res) => {
    const json = await res.json();

    if (!res.ok) throw (json.error);

    return json.store;
  })
  .catch((e) => {
    console.error(e);
    throw e;
  });

module.exports = { getStore, setStore };
