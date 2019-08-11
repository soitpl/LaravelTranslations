var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _ = require("lodash");
var klawSync = require("klaw-sync");
var path = require("path");
var phpArrayParser = require("php-array-parser");
var fs = require("fs");
import { FileParser } from "./FileParser";
var PHPParser = /** @class */ (function (_super) {
    __extends(PHPParser, _super);
    function PHPParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Execute parser
     */
    PHPParser.prototype.execute = function () {
        var _this = this;
        this.dirs.forEach(function (parseDirObject) {
            var basePath = parseDirObject.path;
            var directories = fs.readdirSync(basePath).filter(function (file) {
                return fs.statSync(path.join(basePath, file)).isDirectory();
            });
            directories.forEach(function (directory) {
                if (_this.langContent[directory] === undefined) {
                    _this.langContent[directory] = {};
                }
                var langDirectory = path.join(basePath, directory);
                var langObject = _this.walkDir(langDirectory);
                if (langObject && Object.keys(langObject).length) {
                    if (parseDirObject.namespace) {
                        _this.initNamespace(directory, parseDirObject.namespace);
                        // @ts-ignore
                        _.assign(_this.langContent[directory][parseDirObject.namespace], langObject);
                    }
                    else {
                        _.assign(_this.langContent[directory], langObject);
                    }
                }
            });
        });
        return this.langContent;
    };
    /**
     * Walk PHP files
     *
     * @param dir
     */
    PHPParser.prototype.walkDir = function (dir) {
        var localLangObjects = {};
        klawSync(dir, {
            nodir: true
        })
            .filter(function (file) {
            return path.extname(file.path) === ".php";
        })
            .forEach(function (file) {
            localLangObjects[path.basename(file.path, ".php")] = PHPParser.proceedContent(fs.readFileSync(path.join(dir, path.basename(file.path)), "utf8"));
        });
        return localLangObjects;
    };
    /**
     * Parse PHP array to JSON
     *
     * @param fileContent
     */
    PHPParser.proceedContent = function (fileContent) {
        fileContent = PHPParser.getArrayOnly(fileContent);
        return phpArrayParser.parse(fileContent);
    };
    /**
     * Remove all comments and ending ?> from file content
     *
     * @param fileContent
     */
    PHPParser.getArrayOnly = function (fileContent) {
        fileContent = fileContent.substr(fileContent.indexOf("return") + 6);
        fileContent = fileContent.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, "");
        fileContent = fileContent.replace(/\?>\s*$/, "");
        return fileContent;
    };
    return PHPParser;
}(FileParser));
export { PHPParser };
//# sourceMappingURL=PHPParser.js.map