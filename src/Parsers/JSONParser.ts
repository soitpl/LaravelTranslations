import { LangObject, ParseDir } from "../../types";

const _ = require("lodash");
const path = require("path");
const fs = require("fs");

import { FileParser } from "./FileParser";

export class JSONParser extends FileParser {
  /**
   * Parse json files
   */
  public execute(): LangObject {
    this.dirs.forEach((parseDirObject: ParseDir) => {
      const basePath = parseDirObject.path;

      const files = fs.readdirSync(basePath).filter((file: string) => {
        return path.extname(file) === ".json";
      });

      if (files.length) {
        files.forEach((file: string) => {
          const lang: string = path.basename(file, ".json"),
            langObject: LangObject = JSON.parse(fs.readFileSync(path.join(basePath, file)));

          if (this.langContent[lang] === undefined) {
            this.langContent[lang] = <LangObject>{};
          }

          if (langObject && Object.keys(langObject).length) {
            if (parseDirObject.namespace) {
              this.initNamespace(lang, parseDirObject.namespace);

              // @ts-ignore
              _.assign(this.langContent[lang][parseDirObject.namespace], langObject);
            } else {
              _.assign(this.langContent[lang], langObject);
            }
          }
        });
      }
    });

    return this.langContent;
  }
}
