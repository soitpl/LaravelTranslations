import { LangObject, ParseDir } from "../../types";

const fs = require("fs");
const _ = require("lodash");
const klawSync = require("klaw-sync");
const path = require("path");
const phpArrayParser = require("php-array-parser");


import { FileParser } from "./FileParser";

export class PHPParser extends FileParser {
  /**
   * Execute parser
   */
  public execute(): LangObject {
    this.dirs.forEach((parseDirObject: ParseDir) => {
      const basePath = parseDirObject.path;

      const directories: string[] = fs.readdirSync(basePath).filter((file: string) => {
        return fs.statSync(path.join(basePath, file)).isDirectory();
      });

      directories.forEach((directory: string) => {
        if (this.langContent[directory] === undefined) {
          this.langContent[directory] = <LangObject>{};
        }

        const langDirectory = path.join(basePath, directory);
        let langObject = this.walkDir(langDirectory);

        if (langObject && Object.keys(langObject).length) {
          if (parseDirObject.namespace) {
            this.initNamespace(directory, parseDirObject.namespace);

            // @ts-ignore
            _.assign(this.langContent[directory][parseDirObject.namespace], langObject);
          } else {
            _.assign(this.langContent[directory], langObject);
          }
        }
      });
    });

    return this.langContent;
  }

  /**
   * Walk PHP files
   *
   * @param dir
   */
  protected walkDir(dir: string): any {
    let localLangObjects: LangObject = {};

    klawSync(dir, {
      nodir: true
    })
      .filter((file: any) => {
        return path.extname(file.path) === ".php";
      })
      .forEach((file: any) => {
        localLangObjects[path.basename(file.path, ".php")] = PHPParser.proceedContent(
          fs.readFileSync(path.join(dir, path.basename(file.path)), "utf8")
        );
      });

    return localLangObjects;
  }

  /**
   * Parse PHP array to JSON
   *
   * @param fileContent
   */
  private static proceedContent(fileContent: string) {
    fileContent = PHPParser.getArrayOnly(fileContent);

    return phpArrayParser.parse(fileContent);
  }

  /**
   * Remove all comments and ending ?> from file content
   *
   * @param fileContent
   */
  private static getArrayOnly(fileContent: string) {
    fileContent = fileContent.substr(fileContent.indexOf("return") + 6);
    fileContent = fileContent.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, "");
    fileContent = fileContent.replace(/\?>\s*$/, "");
    return fileContent;
  }
}
