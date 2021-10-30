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
  outImagePath    : path.resolve(__dirname, './files/userCreated.png'),
  chats           : isProd
    ? {
      main    : 2000000005,
      spam    : 2000000004,
      hateGera: 2000000012,
      trash   : 2000000003,
    } : {
      main    : 2000000003,
      spam    : 2000000003,
      trash   : 2000000003,
      trashSec: 2000000004,
      hateGera: 2000000003,
    },
};
