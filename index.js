const { VK } = require('vk-io');
const events = require('./data/events');
const commands = require('./data/commands');
const cron = require('./data/cron');
// const parser = require('./data/parser');
const { token } = require('./config');

const vk = new VK({ token });

vk.updates.start()
  .then(async () => {
    commands.init(vk);
    events.init(vk);
    await cron.init(vk);

    // setTimeout(() => parser.init(vk), 2000);
    console.info('Bot has been started');
  })
  .catch(console.error);
