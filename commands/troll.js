const rand = require('../utility/random');
const trollings = require('../data/trollings');

module.exports = {
  name: 'troll',
  description: 'Троллит ебаного Воронина',
  aliases: ['t'],
  async execute(ctx) {
    ctx.send(trollings.default[rand.int(trollings.default.length)]);
  },
};
