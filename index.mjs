import LaravelTranslations from "./dist/LaravelTranslations.js";

const lang =  LaravelTranslations.build({
  dir: [
    "../../soIT/Premio/Web/resources/lang",
    {
      path: "../../soIT/Premio/Web/app/Modules/*/resources/lang",
      namespaceFromPath: "../../soIT/Premio/Web/app/Modules/[:namespace]/resources/lang"
    }
  ],
  php: true,
  json: true
});
console.log(lang);
