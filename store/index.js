const events = require('events');
const { defaultTo, each, keys } = require('lodash');
const { getStore, setStore } = require('../functions/storeMethods');

events.captureRejections = true;

const eventEmitter = new events.EventEmitter();
const state = {};

(async () => {
  const loadedState = await getStore().catch(() => ({}));
  const defaultState = {
    isBotActive                  : true,
    isActualityAutopostingEnabled: false,
    isConcatActualities          : false,
  };

  each(keys(defaultState), (stateKey) => {
    state[stateKey] = defaultTo(loadedState[stateKey], defaultState[stateKey]);
  });

  // console.log(state);
})();

const getters = {
  getBotStatus                    : () => state.isBotActive,
  getIsActualityAutopostingEnabled: () => state.isActualityAutopostingEnabled,
  getIsConcatActualities          : () => state.isConcatActualities,
};

const setters = {
  async updateStore(eventName) {
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
    return this.updateStore('botStatus');
  },
  async setActualityAutopostingStatus(status = true) {
    state.isActualityAutopostingEnabled = status;
    return this.updateStore('actualityAutopostingStatus');
  },
  async setConcatActualities(status = true) {
    state.isConcatActualities = status;
    return this.updateStore('concatActualities');
  },
};

module.exports = { getters, setters, eventEmitter };
