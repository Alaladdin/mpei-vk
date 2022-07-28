require('dotenv').config();

const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  isProd,
  prefix          : ['/', '!', '@'] || process.env.PREFIXES,
  token           : process.env.BOT_TOKEN,
  apiUrl          : process.env.API_URL,
  authToken       : process.env.AUTH_TOKEN,
  serverDateFormat: 'yyyy.MM.dd',
  assetsPath      : path.resolve(__dirname, './assets/'),
  adminsChatIds   : [161372337, 283599204, 310167864],
  mainChat        : isProd ? 2000000005 : 2000000003,
};
