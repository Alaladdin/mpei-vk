const { isProd } = require('../config');
// todo if admin not in chat -> disable bot
module.exports = {
  admin: isProd ? [
    {
      name: 'AL',
      userId: 161372337,
    },
    {
      name: 'Drobot',
      userId: 102596143,
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
