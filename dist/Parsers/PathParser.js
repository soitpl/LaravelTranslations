import { LaravelTranslationsUtils } from "../Utils";
var fs = require("fs");
var glob = require("glob");
var PathParser = /** @class */ (function () {
    /**
     *
     * @param dirs
     */
    function PathParser(dirs) {
        this.dirs = [];
        this.dirs = dirs;
    }
    /**
     * Parse input dirs
     *
     */
    PathParser.prototype.parse = function () {
        var _this = this;
        var matched = [];
        this.dirs.forEach(function (path) {
            var files = _this.getMatchedDirs(path);
            if (files.length) {
                matched = matched.concat(_this.makeParseDirObjects(files, _this.isObject(path) ? path : null));
            }
        });
        return matched;
    };
    /**
     * Check directory has at least one subdirectory
     *
     * @param path
     * @return boolean
     */
    PathParser.prototype.hasSubDirs = function (path) {
        var files = fs.readdirSync(path);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            if (fs.statSync(path + "/" + file).isDirectory()) {
                return true;
            }
        }
        return false;
    };
    /**
     * Match passing dirs with glob
     * @param path
     */
    PathParser.prototype.getMatchedDirs = function (path) {
        return this.isObject(path) ? glob.sync(path.path) : glob.sync(path);
    };
    /**
     * Check is subject a object
     *
     * @param subject
     */
    PathParser.prototype.isObject = function (subject) {
        return typeof subject == "object";
    };
    PathParser.prototype.makeParseDirObjects = function (files, params) {
        var _this = this;
        var returnObjects = [];
        files.forEach(function (item) {
            if (fs.lstatSync(item).isDirectory() && _this.hasSubDirs(item)) {
                var dirObject = {
                    path: item
                };
                if (params !== null) {
                    dirObject = PathParser.setNamespace(dirObject, params);
                }
                returnObjects.push(dirObject);
            }
        });
        return returnObjects;
    };
    /**
     * Set namespace to object
     *
     * @param dirObject
     * @param params
     */
    PathParser.setNamespace = function (dirObject, params) {
        if (params.namespace) {
            dirObject.namespace = params.namespace;
        }
        else if (params.namespaceFromPath) {
            if (PathParser.checkHasTwoStarsInPath(dirObject.path)) {
                LaravelTranslationsUtils.LogError("Namespace form path can't be generated for path with ** (" + dirObject.path + ")");
            }
            else {
                dirObject.namespace = PathParser.findNamespaceFromPath(dirObject.path, params.namespaceFromPath);
            }
        }
        return dirObject;
    };
    PathParser.checkHasTwoStarsInPath = function (path) {
        return path.search(/(\*{2})/g) !== -1;
    };
    /**
     * Parse path and fild [:namespace] string which define path part which should be treated as namespace
     *
     * @param path
     * @param namespacePattern
     */
    PathParser.findNamespaceFromPath = function (path, namespacePattern) {
        var splitPath = path.split("/"), splitPattern = namespacePattern.split("/");
        var namespaceIndex = splitPattern.indexOf("[:namespace]");
        if (namespaceIndex === -1) {
            LaravelTranslationsUtils.LogError("Can't find [:namespace] in pattern " + namespacePattern);
            return null;
        }
        return splitPath[namespaceIndex];
    };
    return PathParser;
}());
export { PathParser };
//# sourceMappingURL=PathParser.js.map