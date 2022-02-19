const events = require('events');
const { defaultTo, each, keys, reject, concat } = require('lodash');
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
    admins                       : { AL: 161372337, Drobot: 425704393, Omar: 45052566, Vova: 310167864 },
    scheduleSubscribers          : [],
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
  getScheduleSubscribers          : () => state.scheduleSubscribers,
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
  async setScheduleSubscribers(subscriberId) {
    const { scheduleSubscribers: currentSubscribers } = state;
    const isSubscribed = currentSubscribers.includes(subscriberId);

    state.scheduleSubscribers = isSubscribed
      ? reject(currentSubscribers, (userId) => userId === subscriberId)
      : concat(currentSubscribers, [subscriberId]);

    return this.updateStore('scheduleSubscribers');
  },
};

module.exports = { getters, setters, eventEmitter };
