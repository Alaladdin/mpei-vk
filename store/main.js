const events = require('events');
const { getStore, setStore } = require('../functions/storeMethods');

events.captureRejections = true;

const eventEmitter = new events.EventEmitter();
let state = {};

(async () => {
  const remoteStore = await getStore().catch(() => ({}));
  const isRemoteEmpty = !Object.keys(remoteStore).length;
  const defaults = {
    isBotActive: true,
    actualityAutoposting: {
      isEnabled: true,
    },
  };
  const getStateValue = (key) => ((isRemoteEmpty || remoteStore[key] === undefined)
    ? defaults[key]
    : remoteStore[key]);

  state = {
    isBotActive: getStateValue('isBotActive'),
    actualityAutoposting: getStateValue('actualityAutoposting'),
  };
})();

const getters = {
  getState: () => state,
  getBotStatus: () => state.isBotActive,
  getActualityAutoposting: () => state.actualityAutoposting,
};

const setters = {
  async listener(eventName) {
    // write store to the DB
    return setStore(state)
      .then((updatedState) => {
        eventEmitter.emit(eventName);
        return updatedState;
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });
  },
  async setBotStatus(status = true) {
    state.isBotActive = status;
    return this.listener('setBotStatus');
  },
  async setActualityAutopostingStatus(status = true) {
    state.actualityAutoposting.isEnabled = status;
    return this.listener('setActualityAutopostingStatus');
  },
};

module.exports = { getters, setters, eventEmitter };
