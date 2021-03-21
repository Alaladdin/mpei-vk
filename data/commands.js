const fs = require('fs');

const commandFolders = fs.readdirSync('./commands').filter((file) => file.endsWith('.js') && !file.endsWith('.disabled.js'));

module.exports = {
  name: 'commands',
  description: 'get bot commands',
  init(bot) {
    bot.commands = new Map();

    commandFolders.forEach((file) => {
      const command = require(`../commands/${file}`);
      bot.commands.set(command.name, command);
    });
  },
};
