"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const PathParser_1 = require("./Parsers/PathParser");
const PHPParser_1 = require("./Parsers/PHPParser");
const JSONParser_1 = require("./Parsers/JSONParser");
const Utils_1 = require("./Utils");
class LaravelTranslations {
    /**
     * Build language object
     */
    static build() {
        LaravelTranslations.options = LaravelTranslations.getOptions();
        if (LaravelTranslations.options) {
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
        }
        return this.output;
    }
    /**
     * Parse added directories
     */
    static parseDirs() {
        const parser = new PathParser_1.PathParser(this.options.dir);
        if (this.options.dir && this.options.dir.length) {
            LaravelTranslations.translationsPaths = LaravelTranslations.translationsPaths.concat(parser.parse());
        }
    }
    /**
     * Parse JSON files
     */
    static parseJSON() {
        const parser = new JSONParser_1.JSONParser(LaravelTranslations.translationsPaths);
        _.merge(LaravelTranslations.output, parser.execute());
    }
    /**
     * Parse PHP language files
     */
    static parsePHP() {
        const parser = new PHPParser_1.PHPParser(LaravelTranslations.translationsPaths);
        _.merge(LaravelTranslations.output, parser.execute());
    }
    /**
     * Replace parameters :string with pattern from options
     */
    static replaceParameters() {
        LaravelTranslations.output = JSON.parse(JSON.stringify(LaravelTranslations.output).replace(/\:(\w+)/g, LaravelTranslations.options.parameters));
    }
    /**
     * Get configurations from file
     */
    static getOptions() {
        const filePath = path.resolve(__dirname, '../../../resources/lang/' + LaravelTranslations.configFileName);
        try {
            if (fs.existsSync(filePath)) {
                const options = JSON.parse(fs.readFileSync(filePath));
                if (options === undefined) {
                    Utils_1.LaravelTranslationsUtils.LogError("Options file is incorrect");
                }
                return options;
            }
        }
        catch (error) {
            Utils_1.LaravelTranslationsUtils.LogError(error);
        }
    }
}
LaravelTranslations.translationsPaths = [];
LaravelTranslations.options = {
    dir: [],
    json: false,
    php: true
};
LaravelTranslations.output = {};
LaravelTranslations.configFileName = ".lll.config.json";
exports.default = LaravelTranslations;
//# sourceMappingURL=LaravelTranslations.js.map