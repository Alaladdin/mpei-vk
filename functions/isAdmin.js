const priority = require('../data/priority');

module.exports = (userId) => (Object.values(priority.admins).includes(userId));
