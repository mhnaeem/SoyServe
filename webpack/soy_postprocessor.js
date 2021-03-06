const loaderUtils = require("loader-utils");

module.exports = function (content) {
    const options = loaderUtils.getOptions(this);

    if(options.removeDebug) {
        content = removeDebugStatements(content);
    }

    if(options.useProvide) {
        content = addGoogProvide(content);
    }
    else if(options.modular) {
        content = transformIntoGoogModules(content);

        if(options.useModule) {
            content = addGoogModule(content, options.declareLegacyNamespace);
        }
    }

    return content;
};

/**
 * Removes goog.DEBUG based statements from the compiled Soy files
 *
 * @param {string} content
 * @return {string}
 */
const removeDebugStatements = (content) => {
    let toReturn = content.replace(/if\s\(goog\.DEBUG\)\s{\n.*\n}\n/g, "");
    toReturn = toReturn.replace(/\+\s\(\(goog\.DEBUG\s&&\ssoy\.\$\$debugSoyTemplateInfo\)\s\?\s'.*?\s:\s''\)/g, "")
    return toReturn;
}

/**
 * Get the namespace for the current template file
 *
 * @param {string} content
 * @return {string}
 */
const getNamespaceString = (content) => {
    return content
        .match(/@fileoverview.*/)[0]
        .slice(37,-1);
}

/**
 * Add `goog.provide("soy.namespace")` type statement in the compiled file
 *
 * @param {string} content
 * @return {string}
 */
const addGoogProvide = (content) => {
    return `${content}\n\n// Exporting module using a goog.provide statement\ngoog.provide('${getNamespaceString(content)}');\n`;
}

/**
 * Add a `goog.module("soy.namespace")` statement
 *
 * @param {string} content
 * @param {boolean} legacyNamespace
 * @return {string}
 */
const addGoogModule = (content, legacyNamespace) => {
    let tempContent = `goog.module('${getNamespaceString(content)}');// Exporting module using a goog.module statement\n\n${content}\n`
    if(legacyNamespace) {
        tempContent = `${tempContent}\n// Making the module publicly accessible\ngoog.module.declareLegacyNamespace();\n`;
    }
    return tempContent;
}

/**
 * Convert the file into goog modules, export all the functions instead of defining them on a global namespace
 *
 * @param {string} content
 * @return {string}
 */
const transformIntoGoogModules = (content) => {

    const functionNames = [];

    const escapedNamespace = getNamespaceString(content).replace(/\./g, "\\.");
    const replacerRegex = new RegExp(`(${escapedNamespace}\.(.*))( = function.*)`, "g")

    content = content.replace(replacerRegex, (match, p1, p2, p3, offset, string) => {
        if(RESERVED_KEYWORDS_JS.includes(p2)){
            console.log("Can't have a reserved JS keyword as a template name: " + p2);
        }

        functionNames.push(p2);
        return `const ${p2}${p3}`;
    });

    return `${content}\n// Adding exports statement\nexports = { ${functionNames.join(", ")} };`
}


const RESERVED_KEYWORDS_JS = [
    "await",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "implements",
    "import",
    "in",
    "undefined",
    "instanceof",
    "interface",
    "let",
    "new",
    "null",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "super",
    "switch",
    "static",
    "this",
    "throw",
    "try",
    "true",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield"
];
