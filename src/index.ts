import {JSONParser} from "./Parsers/JSONParser";

const _ = require("lodash");

import { LangObject, Options, ParseDir } from "../types";
import { PathParser } from "./Parsers/PathParser";
import { PHPParser } from "./Parsers/PHPParser";

class LaravelTranslations {
  translationsPaths: ParseDir[] = [];
  options: Options = {
    dir: [],
    json: false,
    php: true
  };

  private output: LangObject = {};

  constructor(options: Options) {
    this.options = { ...this.options, ...options };
  }

  /**
   * Build language object
   */
  build() : LangObject {
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
  private parseDirs() {
    const parser = new PathParser(this.options.dir);
    if (this.options.dir && this.options.dir.length) {
      this.translationsPaths = this.translationsPaths.concat(parser.parse());
    }
  }

  /**
   * Parse JSON files
   */
  private parseJSON() {
    const parser = new JSONParser(this.translationsPaths);
    _.assign(this.output, parser.execute());
  }

  /**
   * Parse PHP language files
   */
  private parsePHP() {
    const parser = new PHPParser(this.translationsPaths);
    _.assign(this.output, parser.execute());
  }

  /**
   * Replace parameters :string with pattern from options
   */
  private replaceParameters() {
    this.output = JSON.parse(JSON.stringify(this.output).replace(/\:(\w+)/g, this.options.parameters as string));
  }

}
export default LaravelTranslations;
