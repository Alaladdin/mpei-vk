require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  prefix: process.env.PREFIX,
  token: process.env.TOKEN,
  serverAddress: isProd ? process.env.prodServerAddress : process.env.devServerAddress,
};
