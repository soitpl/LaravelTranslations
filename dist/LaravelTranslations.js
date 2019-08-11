import { JSONParser } from "./Parsers/JSONParser";
var _ = require("lodash");
import { PathParser } from "./Parsers/PathParser";
import { PHPParser } from "./Parsers/PHPParser";
var LaravelTranslations = /** @class */ (function () {
    function LaravelTranslations() {
    }
    /**
     * Build language object
     */
    LaravelTranslations.build = function (options) {
        LaravelTranslations.options = options;
        this.parseDirs();
        if (this.options.php) {
            this.parsePHP();
        }
        if (this.options.json) {
            this.parseJSON();
        }
        if (this.options.parameters) {
            this.replaceParameters();
        }
        return this.output;
    };
    /**
     * Parse added directories
     */
    LaravelTranslations.parseDirs = function () {
        var parser = new PathParser(this.options.dir);
        if (this.options.dir && this.options.dir.length) {
            LaravelTranslations.translationsPaths = LaravelTranslations.translationsPaths.concat(parser.parse());
        }
    };
    /**
     * Parse JSON files
     */
    LaravelTranslations.parseJSON = function () {
        var parser = new JSONParser(LaravelTranslations.translationsPaths);
        _.assign(LaravelTranslations.output, parser.execute());
    };
    /**
     * Parse PHP language files
     */
    LaravelTranslations.parsePHP = function () {
        var parser = new PHPParser(LaravelTranslations.translationsPaths);
        _.assign(LaravelTranslations.output, parser.execute());
    };
    /**
     * Replace parameters :string with pattern from options
     */
    LaravelTranslations.replaceParameters = function () {
        LaravelTranslations.output = JSON.parse(JSON.stringify(LaravelTranslations.output).replace(/\:(\w+)/g, LaravelTranslations.options.parameters));
    };
    LaravelTranslations.translationsPaths = [];
    LaravelTranslations.options = {
        dir: [],
        json: false,
        php: true
    };
    LaravelTranslations.output = {};
    return LaravelTranslations;
}());
export default LaravelTranslations;
//# sourceMappingURL=LaravelTranslations.js.map