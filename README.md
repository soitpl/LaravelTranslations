<div align="center">
  <h1>Laravel Lang Loader</h1>
  <p>Loads a Laravel translations file as a as JSON into JavaScipt libraries.</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install laravel-lang-loader
```

<h2 align="center">Usage</h2>

In your app.js (or app.ts) file add: 

```js
import LaravelTranslations from 'laravel-lang-loader!laravel-lang-loader';
```
where LaravelTranslation can be any variable name. 

Configuration is provided by .json file, and it must be store in ./resource/lang with `.lll.config.json` name. Minimal requirement is at least
one lang dir defined in ``dir`` key:

```js 
// lll.config.json

{
    "dir": [
        "./resources/lang",
        {
            "path": "./app/Modules/*/resources/lang",
            "namespaceFromPath": "./app/Modules/[:namespace]/resources/lang"
        }
    ],
    "php": true,
    "json": true
}
```

<h5>Options</h3>
* dir - string or object with path to lang files. If object is given then should contain:
    * path (string) - path to lang directory
    * namespace (string) - constant namespace string for all file in directory
    * namespaceFromPath - definition of the namespace form file path. It should be marked with `[:namespace]`
* php (boolean) - parse PHP files
* json (boolean) - parse JSON files

