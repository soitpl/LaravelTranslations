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
var path = require("path");
var fs = require("fs");
import { FileParser } from "./FileParser";
var JSONParser = /** @class */ (function (_super) {
    __extends(JSONParser, _super);
    function JSONParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Parse json files
     */
    JSONParser.prototype.execute = function () {
        var _this = this;
        this.dirs.forEach(function (parseDirObject) {
            var basePath = parseDirObject.path;
            var files = fs.readdirSync(basePath).filter(function (file) {
                return path.extname(file) === ".json";
            });
            if (files.length) {
                files.forEach(function (file) {
                    var lang = path.basename(file, ".json"), langObject = JSON.parse(fs.readFileSync(path.join(basePath, file)));
                    if (_this.langContent[lang] === undefined) {
                        _this.langContent[lang] = {};
                    }
                    if (langObject && Object.keys(langObject).length) {
                        if (parseDirObject.namespace) {
                            _this.initNamespace(lang, parseDirObject.namespace);
                            // @ts-ignore
                            _.assign(_this.langContent[lang][parseDirObject.namespace], langObject);
                        }
                        else {
                            _.assign(_this.langContent[lang], langObject);
                        }
                    }
                });
            }
        });
        return this.langContent;
    };
    return JSONParser;
}(FileParser));
export { JSONParser };
//# sourceMappingURL=JSONParser.js.map