const { isProd } = require('../config');
// todo if admin not in chat -> disable bot
module.exports = {
  admins: {
    AL: 161372337,
    Drobot: 425704393,
    Omar: 45052566,
  },
  admin: isProd ? [
    {
      name: 'AL',
      userId: 161372337,
    },
    {
      name: 'Drobot',
      userId: 425704393,
    },
    {
      name: 'Omar',
      userId: 45052566,
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
