const { VK } = require('vk-io');
const events = require('./data/events');
const commands = require('./data/commands');
const cron = require('./data/cron');
const { token } = require('./config');

const vk = new VK({ token });

commands.init(vk);
events.init(vk);
cron.init(vk);

vk.updates.start()
  .then(() => console.log('Bot has been started'))
  .catch(console.error);
