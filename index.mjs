import LaravelTranslations from "./dist/index.js";

const lang = new LaravelTranslations({
  dir: [
    "../../soIT/Premio/resources/lang",
    {
      path: "../../soIT/Premio/app/Modules/*/resources/lang",
      namespaceFromPath: "../../soIT/Premio/app/Modules/[:namespace]/resources/lang"
    }
  ],
  php: true,
  json: true
}).build();
console.log(lang);
