"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
const fs = require("fs");
const glob = require("glob");
class PathParser {
    /**
     *
     * @param dirs
     */
    constructor(dirs) {
        this.dirs = [];
        this.dirs = dirs;
    }
    /**
     * Parse input dirs
     *
     */
    parse() {
        let matched = [];
        this.dirs.forEach((path) => {
            let files = this.getMatchedDirs(path);
            if (files.length) {
                matched = matched.concat(this.makeParseDirObjects(files, this.isObject(path) ? path : null));
            }
        });
        return matched;
    }
    /**
     * Check directory has at least one subdirectory
     *
     * @param path
     * @return boolean
     */
    hasSubDirs(path) {
        const files = fs.readdirSync(path);
        for (let file of files) {
            if (fs.statSync(path + "/" + file).isDirectory()) {
                return true;
            }
        }
        return false;
    }
    /**
     * Match passing dirs with glob
     * @param path
     */
    getMatchedDirs(path) {
        return this.isObject(path) ? glob.sync(path.path) : glob.sync(path);
    }
    /**
     * Check is subject a object
     *
     * @param subject
     */
    isObject(subject) {
        return typeof subject == "object";
    }
    makeParseDirObjects(files, params) {
        let returnObjects = [];
        files.forEach((item) => {
            if (fs.lstatSync(item).isDirectory() && this.hasSubDirs(item)) {
                let dirObject = {
                    path: item
                };
                if (params !== null) {
                    dirObject = PathParser.setNamespace(dirObject, params);
                }
                returnObjects.push(dirObject);
            }
        });
        return returnObjects;
    }
    /**
     * Set namespace to object
     *
     * @param dirObject
     * @param params
     */
    static setNamespace(dirObject, params) {
        if (params.namespace) {
            dirObject.namespace = params.namespace;
        }
        else if (params.namespaceFromPath) {
            if (PathParser.checkHasTwoStarsInPath(dirObject.path)) {
                Utils_1.LaravelTranslationsUtils.LogError("Namespace form path can't be generated for path with ** (" + dirObject.path + ")");
            }
            else {
                dirObject.namespace = PathParser.findNamespaceFromPath(dirObject.path, params.namespaceFromPath);
            }
        }
        return dirObject;
    }
    static checkHasTwoStarsInPath(path) {
        return path.search(/(\*{2})/g) !== -1;
    }
    /**
     * Parse path and fild [:namespace] string which define path part which should be treated as namespace
     *
     * @param path
     * @param namespacePattern
     */
    static findNamespaceFromPath(path, namespacePattern) {
        const splitPath = path.split("/"), splitPattern = namespacePattern.split("/");
        const namespaceIndex = splitPattern.indexOf("[:namespace]");
        if (namespaceIndex === -1) {
            Utils_1.LaravelTranslationsUtils.LogError("Can't find [:namespace] in pattern " + namespacePattern);
            return null;
        }
        return splitPath[namespaceIndex];
    }
}
exports.PathParser = PathParser;
//# sourceMappingURL=PathParser.js.map