const fs = require('fs');

const commandFolders = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

module.exports = {
  name: 'commands',
  description: 'get bot commands',
  init(vk) {
    // eslint-disable-next-line no-param-reassign
    vk.commands = new Map();

    commandFolders.forEach((file) => {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      const command = require(`../commands/${file}`);
      vk.commands.set(command.name, command);
    });
  },
};
