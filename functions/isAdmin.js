const priority = require('../data/priority');

module.exports = (userId) => (priority.admin.map((a) => a.userId).includes(userId));
