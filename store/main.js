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
    isListenMessages: false,
    // isMailListen: true,
    // admins: [],
    hateTriggersCount: 0,
    commandsStats: {},
    // disabledChats: [],
    bannedUsers: [53265470],
    actualityAutopost: {
      enabled: true,
      chatIds: [2000000004, 2000000005],
      time: '0 0 9 * * *',
    },
  };
  const getStateValue = (key) => ((isRemoteEmpty || remoteStore[key] === undefined)
    ? defaults[key]
    : remoteStore[key]);

  state = {
    isBotActive: getStateValue('isBotActive'),
    isHateOnQuestions: getStateValue('isHateOnQuestions'),
    isListenMessages: getStateValue('isListenMessages'),
    // admins: getStateValue('admins'),
    hateTriggersCount: getStateValue('hateTriggersCount'),
    commandsStats: getStateValue('commandsStats'),
    // disabledChats: getStateValue('disabledChats'),
    bannedUsers: getStateValue('bannedUsers'),
    actualityAutopost: getStateValue('actualityAutopost'),
  };
})();

const getters = {
  getState: () => state,
  getBotStatus: () => state.isBotActive,
  getCommandStats: async (c) => (c ? state.commandsStats[c] : state.commandsStats),
  getIsHateOnQuestions: () => state.isHateOnQuestions,
  getIsListenMessages: () => state.isListenMessages,
  getHateTriggersCount: () => state.hateTriggersCount,
  getActualityConfig: () => state.actualityAutopost,
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
  async setIsListenMessages(status = true) {
    state.isListenMessages = status;
    return this.listener('isListenMessages');
  },
  async setAutopostingStatus(status = true) {
    state.actualityAutopost.enabled = status;
    return this.listener('setAutopostingStatus');
  },
  async setAutopostingTime(time = '0 0 9 * * *') {
    state.actualityAutopost.time = time;
    return this.listener('setAutopostingTime');
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
