const VkBot = require('node-vk-bot-api');
const commands = require('./data/commands');
const { token, prefix } = require('./config');

const bot = new VkBot(token);

bot.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.error(e);
  }
});

commands.init(bot);

bot.on((ctx) => {
  const msg = ctx.message.text || ctx.message.body;
  // const msgAuthorID = ctx.message.user_id || ctx.message.from_id;

  if (!msg.startsWith(prefix)) return;

  const commandBody = msg.slice(prefix.length);
  const args = commandBody.split(' ');
  const commandName = args.shift().toLowerCase();

  const command = bot.commands.get(commandName);
  if (command) command.execute(bot, ctx, args);
});

bot.startPolling((err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('- Bot has been launched');
  }
});
