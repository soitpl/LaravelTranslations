import {JSONParser} from "./Parsers/JSONParser";

const _ = require("lodash");

import { LangObject, Options, ParseDir } from "../types";
import { PathParser } from "./Parsers/PathParser";
import { PHPParser } from "./Parsers/PHPParser";

class LaravelTranslations {
    private static translationsPaths: ParseDir[] = [];
    private static options: Options = {
        dir: [],
        json: false,
        php: true
    };

    private static output: LangObject = {};

    /**
     * Build language object
     */
    static build(options: Options) : LangObject {
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
    }

    /**
     * Parse added directories
     */
    private static parseDirs() {
        const parser = new PathParser(this.options.dir);
        if (this.options.dir && this.options.dir.length) {
            LaravelTranslations.translationsPaths = LaravelTranslations.translationsPaths.concat(parser.parse());
        }
    }

    /**
     * Parse JSON files
     */
    private static parseJSON() {
        const parser = new JSONParser(LaravelTranslations.translationsPaths);
        _.assign(LaravelTranslations.output, parser.execute());
    }

    /**
     * Parse PHP language files
     */
    private static parsePHP() {
        const parser = new PHPParser(LaravelTranslations.translationsPaths);
        _.assign(LaravelTranslations.output, parser.execute());
    }

    /**
     * Replace parameters :string with pattern from options
     */
    private static replaceParameters() {
        LaravelTranslations.output = JSON.parse(JSON.stringify(LaravelTranslations.output).replace(/\:(\w+)/g, LaravelTranslations.options.parameters as string));
    }

}
export default LaravelTranslations;
