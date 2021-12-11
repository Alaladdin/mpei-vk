const { isProd } = require('../config');

module.exports = {
  admins: isProd
    ? { AL: 161372337, Drobot: 425704393, Omar: 45052566, Vova: 310167864 }
    : { AL: 161372337 },
};
