const commandsStats = {
  actuality: 0,
  help: 0,
  hide: 0,
  image: 0,
  random: 0,
  schedule: 0,
  start: 0,
  stats: 0,
  status: 0,
  troll: 0,
};

const commandsStatsGetters = {
  getCommandStats: async (command) => (command ? commandsStats[command] : commandsStats),
};

const commandsStatsSetters = {
  async incrementCommandStats(command) {
    if (!Number.isInteger(commandsStats[command])) return false;
    const newVal = commandsStats[command] && commandsStats[command] > 0 ? commandsStats[command] + 1 : 1;

    commandsStats[command] = newVal;

    return newVal;
  },
};

module.exports = {
  commandsStats,
  commandsStatsGetters,
  commandsStatsSetters,
};
