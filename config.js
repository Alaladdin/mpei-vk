require('dotenv').config();
const ms = require('ms');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  prefix: process.env.PREFIX,
  token: process.env.TOKEN,
  serverAddress: isProd ? process.env.prodServerAddress : process.env.devServerAddress,
  mpeiLogin: process.env.MPEI_LOGIN,
  mpeiPass: process.env.MPEI_PASS,
  waitUnread: parseInt(ms(process.env.WAIT_UNREAD || '1h'), 10),
  chatIds: isProd ? [
    {
      name: 'main',
      peerId: 2000000005,
    },
    {
      name: 'spam',
      peerId: 2000000004,
    },
  ] : [
    {
      name: 'trash',
      peerId: 2000000003,
    },
    // {
    //   name: 'trash #2',
    //   peerId: 2000000008,
    // },
  ],
};
