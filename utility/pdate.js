module.exports = {
  format(dateString, locale = 'lt-LT') {
    const options = {
      day: 'numeric',
      month: 'numeric',
      // year: 'numeric',
    };

    return new Date(dateString).toLocaleString(locale, options);
  },
};
