const { VK } = require('vk-io');
const events = require('./data/events');
const commands = require('./data/commands');
const cron = require('./data/cron');
const parser = require('./data/parser');
const { token } = require('./config');

const vk = new VK({ token });

(async () => {
  await commands.init(vk);
  await events.init(vk);
  await cron.init(vk);
  await parser.init(vk);
})();

vk.updates.start()
  .then(() => console.log('Bot has been started'))
  .catch(console.error);
