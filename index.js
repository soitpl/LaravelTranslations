const LaravelTranslations = require('./dist/LaravelTranslations.js').default;

module.exports = function () {
  return "module.exports = " + JSON.stringify(LaravelTranslations.build());
};
