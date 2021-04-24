const { isProd } = require('../config');

module.exports = {
  admin: isProd ? [
    {
      name: 'AL',
      userId: 161372337,
    },
    {
      name: 'Omar',
      userId: 457248723,
    },
  ] : [
    {
      name: 'AL',
      userId: 161372337,
    },
  ],
  blackList: [
    53265470,
  ],
};
