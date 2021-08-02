const loaderUtils = require("loader-utils");

module.exports = function (source) {
    const options = loaderUtils.getOptions(this);

    if(options.addSoyDoc) {
        source = addSoyDoc(source);
    }

    if(options.removeLeadingEmptySpaces) {
        source = removeLeadingEmptySpaces(source);
    }

    return source;
}

/**
 * Add SoyDoc comments before templates in Soy file that don't have them to conform to the Soy v2 requirement
 *
 * @param {string} data
 * @return {string}
 */
const addSoyDoc = (data) => {
    const comment = "/**\n *\n */\n";

    const rEx = new RegExp("(.*\n.*)(\{template.*}.*)", "g");
    data = data.replace(rEx, (match, p1, p2) => {

        if(p1.includes("*/")) {
            return match;
        }
        return p1 + comment + p2;
    });

    return data;
}

/**
 * Removes empty whitespace before template tags and SoyDoc to conform with Soy v2
 *
 * @param {string} data
 * @return {string}
 */
const removeLeadingEmptySpaces = (data) => {

    const rExTemplate = new RegExp("(.*)(\{template.*}.*)", "g");
    data = data.replace(rExTemplate, (match, p1, p2) => {
        return p2;
    });

    data = data.replace(/(.*)(\/\*\*)/g, (match, p1, p2) => {
        return p2;
    });

    return data;
}
