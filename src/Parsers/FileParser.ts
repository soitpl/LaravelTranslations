import { LangObject, ParseDir } from "../../types";

export abstract class FileParser {
  public abstract execute(dir: string): LangObject;

  protected langContent: LangObject = {};
  protected dirs: ParseDir[] = [];

  constructor(dirs: ParseDir[]) {
    this.dirs = dirs;
  }

  /**
   * Init namespace in object
   *
   * @param lang
   * @param namespace
   */
  protected initNamespace(lang: string, namespace: string): void{
    if ((<LangObject>this.langContent[lang])[namespace] == undefined) {
      (<LangObject>this.langContent[lang])[namespace] = <LangObject>{};
    }
  }


}
