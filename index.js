const { VK } = require('vk-io');
const events = require('./data/events');
const commands = require('./data/commands');
const cron = require('./data/cron');
// const parser = require('./data/parser');
const { token } = require('./config');

const vk = new VK({ token });

vk.updates.start()
  .then(() => {
    commands.init(vk);
    events.init(vk);
    cron.init(vk).then(() => {
      console.info('[CRON] has been started');
    });

    // setTimeout(() => parser.init(vk), 2000);
    console.info('[BOT] has been started');
  })
  .catch(console.error);
