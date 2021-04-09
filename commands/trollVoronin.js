const rand = require('../utility/random');
const { trolleos } = require('../data/trolleos');

module.exports = {
  name: 't',
  description: 'Троллит ебаного Воронина',
  aliases: [
    'troll',
    'eblonin',
    'eblo',
    'gay',
    'pidor',
    'pidaras',
    'voronin',
  ],
  async execute(ctx) {
    ctx.send(trolleos[rand.int(trolleos.length)]);
  },
};
