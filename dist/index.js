var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { JSONParser } from "./Parsers/JSONParser";
var _ = require("lodash");
import { PathParser } from "./Parsers/PathParser";
import { PHPParser } from "./Parsers/PHPParser";
var LaravelTranslations = /** @class */ (function () {
    function LaravelTranslations(options) {
        this.translationsPaths = [];
        this.options = {
            dir: [],
            json: false,
            php: true
        };
        this.output = {};
        this.options = __assign({}, this.options, options);
    }
    /**
     * Build language object
     */
    LaravelTranslations.prototype.build = function () {
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
    LaravelTranslations.prototype.parseDirs = function () {
        var parser = new PathParser(this.options.dir);
        if (this.options.dir && this.options.dir.length) {
            this.translationsPaths = this.translationsPaths.concat(parser.parse());
        }
    };
    /**
     * Parse JSON files
     */
    LaravelTranslations.prototype.parseJSON = function () {
        var parser = new JSONParser(this.translationsPaths);
        _.assign(this.output, parser.execute());
    };
    /**
     * Parse PHP language files
     */
    LaravelTranslations.prototype.parsePHP = function () {
        var parser = new PHPParser(this.translationsPaths);
        _.assign(this.output, parser.execute());
    };
    /**
     * Replace parameters :string with pattern from options
     */
    LaravelTranslations.prototype.replaceParameters = function () {
        this.output = JSON.parse(JSON.stringify(this.output).replace(/\:(\w+)/g, this.options.parameters));
    };
    return LaravelTranslations;
}());
export default LaravelTranslations;
//# sourceMappingURL=index.js.map