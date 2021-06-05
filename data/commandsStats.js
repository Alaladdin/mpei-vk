const commandsStats = {};

const commandsStatsGetters = {
  getCommandStats: async (command) => (command ? commandsStats[command] : commandsStats),
};

const commandsStatsSetters = {
  async incrementCommandStats(command) {
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
