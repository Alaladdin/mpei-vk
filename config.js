require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  isProd,
  prefix: ['/', '!', '@'] || process.env.PREFIX,
  token: isProd ? process.env.TOKEN : process.env.TOKEN_DEV,
  serverAddress: isProd ? process.env.PROD_SERVER : process.env.DEV_SERVER,
  authToken: process.env.AUTH_TOKEN,
  serverDateFormat: 'yyyy.MM.dd',
  chats: isProd
    ? {
      main: 2000000005,
      spam: 2000000004,
      hateGera: 2000000012,
      trash: 2000000003,
    }
    : {
      main: 2000000003,
      spam: 2000000003,
      trash: 2000000003,
      trashSecondary: 2000000004,
      hateGera: 2000000003,
    },
};
