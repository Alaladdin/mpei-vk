const fs = require('fs');

const eventFolders = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

module.exports = {
  name       : 'events',
  description: 'set events',
  init(vk) {
    eventFolders.forEach((file) => {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      const event = require(`../events/${file}`);

      vk.updates.on(event.name, (...args) => event.execute(...args, vk));
    });
  },
};
