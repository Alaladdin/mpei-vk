require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  isProd,
  prefix: ['/', '!', '@'] || process.env.PREFIX,
  token: isProd ? process.env.TOKEN : process.env.TOKEN_DEV,
  serverAddress: isProd ? process.env.PROD_SERVER : process.env.DEV_SERVER,
  authToken: process.env.AUTH_TOKEN,
  serverDateFormat: 'yyyy.MM.dd',
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
      name: 'main',
      peerId: 2000000003,
    },
    {
      name: 'trash',
      peerId: 2000000003,
    },
  ],
};
