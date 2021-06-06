const { format, add } = require('date-fns');

// HH:mm:ss dd.MM.yyyy

module.exports.format = (dateString, dateFormat = 'dd.MM') => format(new Date(dateString), dateFormat);
module.exports.add = (dateString, duration = { days: 1 }) => add(new Date(dateString), duration);
