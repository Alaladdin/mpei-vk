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
    hateTriggersCount: 0,
    actualityAutopost: {
      enabled: true,
    },
  };
  const getStateValue = (key) => ((isRemoteEmpty || remoteStore[key] === undefined)
    ? defaults[key]
    : remoteStore[key]);

  state = {
    isBotActive: getStateValue('isBotActive'),
    isHateOnQuestions: getStateValue('isHateOnQuestions'),
    isListenMessages: getStateValue('isListenMessages'),
    hateTriggersCount: getStateValue('hateTriggersCount'),
    actualityAutopost: getStateValue('actualityAutopost'),
  };
})();

const getters = {
  getState: () => state,
  getBotStatus: () => state.isBotActive,
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
