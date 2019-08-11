import LaravelTranslations from './dist/LaravelTranslations.js';

module.exports = function () {
  return "module.exports = " + JSON.stringify(LaravelTranslations.build({
    dir: [
      "../../soIT/Premio/resources/lang",
      {
        path: "../../soIT/Premio/app/Modules/*/resources/lang",
        namespaceFromPath: "../../soIT/Premio/app/Modules/[:namespace]/resources/lang"
      }
    ],
    php: true,
    json: true
  }));
};