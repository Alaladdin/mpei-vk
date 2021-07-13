const { isProd } = require('../config');
// todo if admin not in chat -> disable bot
module.exports = {
  admins: isProd ? {
    AL: 161372337,
    Drobot: 425704393,
    Omar: 45052566,
    Adelina: 283599204,
  } : {
    AL: 161372337,
  },
};
