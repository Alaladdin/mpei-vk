const path = require('path');
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  isProd,
  prefix          : ['/', '!', '@'] || process.env.PREFIXES,
  token           : isProd ? process.env.TOKEN : process.env.TOKEN_DEV,
  serverAddress   : process.env.SERVER_ADDRESS,
  authToken       : process.env.AUTH_TOKEN,
  serverDateFormat: 'yyyy.MM.dd',
  assetsPath      : path.resolve(__dirname, './assets/'),
  tempImagePath   : path.resolve(__dirname, './tmp/userCreated.png'),
  adminsChatIds   : [161372337, 310167864],
  mainChat        : isProd ? 2000000005 : 2000000003,
};
