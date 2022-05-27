const { VK } = require('vk-io');
const events = require('./data/events');
const { enableOnline } = require('./functions');
const commands = require('./data/commands');
const cron = require('./data/cron');
const { token } = require('./config');

const vk = new VK({
  token,
  language: 'ru',
  apiLimit: 20,
  apiMode : 'parallel',
});

vk.updates.start()
  .then(() => {
    enableOnline(vk);
    commands.init(vk);
    events.init(vk);
    cron.init(vk);
  })
  .then(() => {
    console.info('[CRON] has been started');
    console.info('[BOT] has been started');
    process.send('ready');
  })
  .catch(console.error);
