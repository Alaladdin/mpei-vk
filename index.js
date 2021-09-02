const { VK } = require('vk-io');
const events = require('./data/events');
const commands = require('./data/commands');
const cron = require('./data/cron');
const { token } = require('./config');

const vk = new VK({ token, language: 'ru' });

vk.updates.start()
  .then(() => {
    commands.init(vk);
    events.init(vk);
    cron.init(vk).then(() => {
      console.info('[CRON] has been started');
    });

    console.info('[BOT] has been started');
  })
  .catch(console.error);
