const events = require('events');
const { defaultTo, each, keys } = require('lodash');
const { getStore, setStore } = require('../functions/storeMethods');
const { sendMessage } = require('../helpers');

events.captureRejections = true;

const eventEmitter = new events.EventEmitter();
const state = {};

(async () => {
  const loadedState = await getStore()
    .catch((e) => {
      sendMessage(null, { peerId: 161372337, message: `Store not loaded:\n${e.message}` });
      return {};
    });

  const defaultState = {
    isBotActive                  : true,
    isActualityAutopostingEnabled: false,
    isConcatActualities          : false,
    admins                       : { AL: 161372337, Drobot: 425704393, Omar: 45052566, Vova: 310167864 },
  };

  each(keys(defaultState), (stateKey) => {
    state[stateKey] = defaultTo(loadedState[stateKey], defaultState[stateKey]);
  });
})();

const getters = {
  getBotStatus                    : () => state.isBotActive,
  getIsActualityAutopostingEnabled: () => state.isActualityAutopostingEnabled,
  getIsConcatActualities          : () => state.isConcatActualities,
  getAdmins                       : () => state.admins,
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
