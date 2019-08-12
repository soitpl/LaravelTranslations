import * as fs from "fs";

const _ = require("lodash");
const path = require("path");

import { LangObject, Options, ParseDir } from "../types";
import { PathParser } from "./Parsers/PathParser";
import { PHPParser } from "./Parsers/PHPParser";
import {JSONParser} from "./Parsers/JSONParser";
import { LaravelTranslationsUtils } from "./Utils";

export default class LaravelTranslations {
    private static translationsPaths: ParseDir[] = [];
    private static options: Options = {
        dir: [],
        json: false,
        php: true
    };

    private static output: LangObject = {};
    private static configFileName: string = ".lll.config.json";

    /**
     * Build language object
     */
    static build() : LangObject {
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
        _.merge(LaravelTranslations.output, parser.execute());
    }

    /**
     * Parse PHP language files
     */
    private static parsePHP() {
        const parser = new PHPParser(LaravelTranslations.translationsPaths);
        _.merge(LaravelTranslations.output, parser.execute());
    }

    /**
     * Replace parameters :string with pattern from options
     */
    private static replaceParameters() {
        LaravelTranslations.output = JSON.parse(JSON.stringify(LaravelTranslations.output).replace(/\:(\w+)/g, LaravelTranslations.options.parameters as string));
    }

    /**
     * Get configurations from file
     */
    private static getOptions(): Options|undefined {
        const filePath = path.resolve(__dirname, '../../../resources/lang/'+ LaravelTranslations.configFileName);

        try {
            if (fs.existsSync(filePath)) {
                const options = JSON.parse(fs.readFileSync(filePath) as any);

                if (options === undefined) {
                    LaravelTranslationsUtils.LogError("Options file is incorrect");
                }

                return options;
            }
        } catch(error) {
            LaravelTranslationsUtils.LogError(error);
        }
    }
}