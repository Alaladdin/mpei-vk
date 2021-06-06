const events = require('events');
const { getStore, setStore } = require('../functions/storeConfigMethods');

events.captureRejections = true;

const eventEmitter = new events.EventEmitter();
let state = {};

(async () => {
  const remoteStore = await getStore().catch(() => ({}));

  state = {
    isBotActive: remoteStore && typeof remoteStore.isBotActive === 'boolean' ? remoteStore.isBotActive : true,
    commandsStats: remoteStore.commandsStats || {},
  };
})();

const getters = {
  getBotStatus: () => state.isBotActive,
  getCommandStats: async (c) => (c ? state.commandsStats[c] : state.commandsStats),
};

const setters = {
  async listener(eventName) {
    // write store to the DB
    return setStore(state)
      .then((updatedState) => {
        eventEmitter.emit(eventName);
        return updatedState;
      });
  },
  async setBotStatus(status = true) {
    state.isBotActive = status;
    return this.listener('botStatus');
  },
  async incrementCommandStats(command) {
    const stats = state.commandsStats[command];

    state.commandsStats[command] = (stats && stats > 0) ? stats + 1 : 1;

    return this.listener('commandsStats');
  },
};

module.exports = {
  state,
  getters,
  setters,
  eventEmitter,
};
