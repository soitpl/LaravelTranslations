"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const _ = require("lodash");
const klawSync = require("klaw-sync");
const path = require("path");
const phpArrayParser = require("php-array-parser");
const FileParser_1 = require("./FileParser");
class PHPParser extends FileParser_1.FileParser {
    /**
     * Execute parser
     */
    execute() {
        this.dirs.forEach((parseDirObject) => {
            const basePath = parseDirObject.path;
            const directories = fs.readdirSync(basePath).filter((file) => {
                return fs.statSync(path.join(basePath, file)).isDirectory();
            });
            directories.forEach((directory) => {
                if (this.langContent[directory] === undefined) {
                    this.langContent[directory] = {};
                }
                const langDirectory = path.join(basePath, directory);
                let langObject = this.walkDir(langDirectory);
                if (langObject && Object.keys(langObject).length) {
                    if (parseDirObject.namespace) {
                        this.initNamespace(directory, parseDirObject.namespace);
                        // @ts-ignore
                        _.assign(this.langContent[directory][parseDirObject.namespace], langObject);
                    }
                    else {
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
    walkDir(dir) {
        let localLangObjects = {};
        klawSync(dir, {
            nodir: true
        })
            .filter((file) => {
            return path.extname(file.path) === ".php";
        })
            .forEach((file) => {
            localLangObjects[path.basename(file.path, ".php")] = PHPParser.proceedContent(fs.readFileSync(path.join(dir, path.basename(file.path)), "utf8"));
        });
        return localLangObjects;
    }
    /**
     * Parse PHP array to JSON
     *
     * @param fileContent
     */
    static proceedContent(fileContent) {
        fileContent = PHPParser.getArrayOnly(fileContent);
        return phpArrayParser.parse(fileContent);
    }
    /**
     * Remove all comments and ending ?> from file content
     *
     * @param fileContent
     */
    static getArrayOnly(fileContent) {
        fileContent = fileContent.substr(fileContent.indexOf("return") + 6);
        fileContent = fileContent.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, "");
        fileContent = fileContent.replace(/\?>\s*$/, "");
        return fileContent;
    }
}
exports.PHPParser = PHPParser;
//# sourceMappingURL=PHPParser.js.map