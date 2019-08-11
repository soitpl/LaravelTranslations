
declare class LaravelTranslations {
    constructor(options?: Options)
    public build(): LangObject;
}

export interface Options {
    dir: (string|DirObject)[],
    files?: [string],
    json?: boolean,
    php: boolean,
    parameters?: string
}

export interface DirObject {
    path: string,
    namespace? : string
    namespaceFromPath? : string
}

export interface ParseDir {
    path: string,
    namespace? : string|null
}

export interface LangObject {
    [key:string]: string|LangObject
}

export default LaravelTranslations;
