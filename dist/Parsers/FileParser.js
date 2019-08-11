var FileParser = /** @class */ (function () {
    function FileParser(dirs) {
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
    FileParser.prototype.initNamespace = function (lang, namespace) {
        if (this.langContent[lang][namespace] == undefined) {
            this.langContent[lang][namespace] = {};
        }
    };
    return FileParser;
}());
export { FileParser };
//# sourceMappingURL=FileParser.js.map