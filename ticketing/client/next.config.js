//In case Next not always reflect file updates.
module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
