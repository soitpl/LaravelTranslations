"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FileParser {
    constructor(dirs) {
        this.langContent = {};
        this.dirs = [];
        this.dirs = dirs;
    }
    /**
     * Init namespace in object
     *
     * @param lang
     * @param namespace
     */
    initNamespace(lang, namespace) {
        if (this.langContent[lang][namespace] == undefined) {
            this.langContent[lang][namespace] = {};
        }
    }
}
exports.FileParser = FileParser;
//# sourceMappingURL=FileParser.js.map