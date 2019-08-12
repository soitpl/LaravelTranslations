"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const FileParser_1 = require("./FileParser");
class JSONParser extends FileParser_1.FileParser {
    /**
     * Parse json files
     */
    execute() {
        this.dirs.forEach((parseDirObject) => {
            const basePath = parseDirObject.path;
            const files = fs.readdirSync(basePath).filter((file) => {
                return path.extname(file) === ".json";
            });
            if (files.length) {
                files.forEach((file) => {
                    const lang = path.basename(file, ".json"), langObject = JSON.parse(fs.readFileSync(path.join(basePath, file)));
                    if (this.langContent[lang] === undefined) {
                        this.langContent[lang] = {};
                    }
                    if (langObject && Object.keys(langObject).length) {
                        if (parseDirObject.namespace) {
                            this.initNamespace(lang, parseDirObject.namespace);
                            // @ts-ignore
                            _.assign(this.langContent[lang][parseDirObject.namespace], langObject);
                        }
                        else {
                            _.assign(this.langContent[lang], langObject);
                        }
                    }
                });
            }
        });
        return this.langContent;
    }
}
exports.JSONParser = JSONParser;
//# sourceMappingURL=JSONParser.js.map