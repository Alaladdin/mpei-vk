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
    isHateOnQuestions: true,
    hateTriggersCount: 0,
    commandsStats: {},
    disabledChats: [],
    bannedUsers: [53265470],
    actualityAutopost: {
      chatIds: [],
      time: '0 0 9 * * *',
    },
  };

  state = {
    isBotActive: isRemoteEmpty ? defaults.isBotActive : remoteStore.isBotActive,
    isHateOnQuestions: isRemoteEmpty ? defaults.isHateOnQuestions : remoteStore.isHateOnQuestions,
    hateTriggersCount: isRemoteEmpty ? defaults.hateTriggersCount : remoteStore.hateTriggersCount,
    commandsStats: isRemoteEmpty ? defaults.commandsStats : remoteStore.commandsStats,
    disabledChats: isRemoteEmpty ? defaults.disabledChats : remoteStore.disabledChats,
    bannedUsers: isRemoteEmpty ? defaults.bannedUsers : remoteStore.bannedUsers,
    actualityAutopost: isRemoteEmpty ? defaults.actualityAutopost : remoteStore.actualityAutopost,
  };
})();

const getters = {
  getState: () => state,
  getBotStatus: () => state.isBotActive,
  getCommandStats: async (c) => (c ? state.commandsStats[c] : state.commandsStats),
  getIsHateOnQuestions: () => state.isHateOnQuestions,
  getHateTriggersCount: () => state.hateTriggersCount,
  getDisabledChats: () => state.disabledChats,
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
  async setIsHateOnQuestions(status = true) {
    state.isHateOnQuestions = status;
    return this.listener('isHateOnQuestions');
  },
  async setChatDisabled(chatId) {
    if (!chatId) return false;

    state.disabledChats.push(chatId);

    return this.listener('disabledChats');
  },
  async resetCommandStats() {
    state.commandsStats = {};
    return this.listener('commandsStats');
  },
  async incrementCommandStats(command, alias) {
    const commandStats = state.commandsStats && state.commandsStats[command];
    if (commandStats) {
      const aliasStats = state.commandsStats[command][alias];

      state.commandsStats[command][alias] = (aliasStats && aliasStats > 0) ? aliasStats + 1 : 1;
    } else {
      state.commandsStats[command] = {
        [alias]: 1,
      };
    }

    return this.listener('commandsStats');
  },
  async incrementHateTriggersCount() {
    const count = state.hateTriggersCount;

    state.hateTriggersCount = (count && count > 0) ? count + 1 : 1;

    return this.listener('hateTriggersCount');
  },
};

module.exports = {
  getters,
  setters,
  eventEmitter,
};
