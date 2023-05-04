require('dotenv').config();

const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  isProd,
  prefixes        : ['/', '!'],
  token           : isProd ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_DEV,
  apiUrl          : process.env.API_URL,
  serverDateFormat: 'yyyy.MM.dd',
  assetsPath      : path.resolve(__dirname, './assets/'),
  adminsChatIds   : isProd ? [161372337, 283599204, 310167864] : [161372337],
  mainChat        : isProd ? 2000000005 : 2000000003,
};
