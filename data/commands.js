const fs = require('fs');

const commandFolders = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

module.exports = {
  name: 'commands',
  description: 'get bot commands',
  init(vk) {
    vk.commands = new Map();

    commandFolders.forEach((file) => {
      const command = require(`../commands/${file}`);
      vk.commands.set(command.name, command);
    });
  },
};
