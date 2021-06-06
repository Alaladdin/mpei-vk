module.exports = {
  int({ min = 0, max = 1 }) {
    const minRange = Math.ceil(min);
    const maxRange = Math.floor(max);

    return Math.floor(Math.random() * (maxRange - minRange + 1) + minRange);
  },
};
