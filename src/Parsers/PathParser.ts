import { DirObject, ParseDir } from "../../types";
import { LaravelTranslationsUtils } from "../Utils";

const fs = require("fs");
const glob = require("glob");

export class PathParser {
  private dirs: string[] = [];

  /**
   *
   * @param dirs
   */
  constructor(dirs: any) {
    this.dirs = dirs;
  }

  /**
   * Parse input dirs
   *
   */
  parse(): any {
      let matched: ParseDir[] = [];

      this.dirs.forEach((path: string | DirObject) => {
        let files = this.getMatchedDirs(path);
        if (files.length) {
          matched = matched.concat(this.makeParseDirObjects(files, this.isObject(path) ? (path as DirObject) : null));
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
  private hasSubDirs(path: string): boolean {
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
  private getMatchedDirs(path: string | DirObject): string[] {
    return this.isObject(path) ? glob.sync((<DirObject>path).path) : glob.sync(path);
  }

  /**
   * Check is subject a object
   *
   * @param subject
   */
  private isObject(subject: any): boolean {
    return typeof subject == "object";
  }

  private makeParseDirObjects(files: string[], params: DirObject | null): ParseDir[] {
    let returnObjects: ParseDir[] = [];

    files.forEach((item: string) => {
      if (fs.lstatSync(item).isDirectory() && this.hasSubDirs(item)) {
        let dirObject: ParseDir = {
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
  private static setNamespace(dirObject: ParseDir, params: DirObject): ParseDir {
    if (params.namespace) {
      dirObject.namespace = params.namespace;
    } else if (params.namespaceFromPath) {
      if (PathParser.checkHasTwoStarsInPath(dirObject.path)) {
        LaravelTranslationsUtils.LogError(
          "Namespace form path can't be generated for path with ** (" + dirObject.path + ")"
        );
      } else {
        dirObject.namespace = PathParser.findNamespaceFromPath(dirObject.path, params.namespaceFromPath);
      }
    }

    return dirObject;
  }

  private static checkHasTwoStarsInPath(path: string): boolean {
    return path.search(/(\*{2})/g) !== -1;
  }

  /**
   * Parse path and fild [:namespace] string which define path part which should be treated as namespace
   *
   * @param path
   * @param namespacePattern
   */
  private static findNamespaceFromPath(path: string, namespacePattern: string): string | null {
    const splitPath = path.split("/"),
      splitPattern = namespacePattern.split("/");

    const namespaceIndex = splitPattern.indexOf("[:namespace]");

    if (namespaceIndex === -1) {
      LaravelTranslationsUtils.LogError("Can't find [:namespace] in pattern " + namespacePattern);
      return null;
    }

    return splitPath[namespaceIndex];
  }
}

