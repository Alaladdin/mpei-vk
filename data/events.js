const fs = require('fs');

const eventFolders = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

module.exports = {
  name: 'commands',
  description: 'get events',
  init(vk) {
    eventFolders.forEach((file) => {
      const event = require(`../events/${file}`);
      vk.updates.on(event.name, (...args) => event.execute(...args, vk));
    });
  },
};
