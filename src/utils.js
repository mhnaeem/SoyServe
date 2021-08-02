"use strict"

/**
 * Small logger utility class
 */
class Logger {

    /**
     * @param {boolean} verbose
     */
    constructor(verbose) {
        this.verbose = verbose;
    }

    /**
     * Only logs message if verbose is set to true
     *
     * @param {string} message
     */
    log(message) {
        if (this.verbose) {
            console.log(message);
        }
    }

    /**
     * Always logs message regardless of verbose
     *
     * @param {string} message
     */
    imp(message) {
       console.log(message);
    }

    /**
     * Modify the value of verbose
     *
     * @param {boolean} verbose
     */
    setVerbose(verbose) {
        this.verbose = verbose;
    }
}


/**
 * @typedef {Object} SoyOptionsArguments
 *
 * Soy Compiler Inherited Options - visit https://github.com/google/closure-templates/blob/master/documentation/dev/dir.md for more info
 * @property {string} srcs
 * @property {string} deps
 * @property {string} locales
 * @property {string} messageFilePathFormat
 * @property {string} outputPathFormat
 * @property {string} shouldGenerateGoogMsgDefs
 * @property {string} bidiGlobalDir
 * @property {string} useGoogIsRtlForBidiGlobalDir
 * @property {string} googMsgsAreExternal
 * @property {string} pluginModules
 *
 * Custom Options
 * @property {boolean} watch - start watching for changes and recompile files
 * @property {RegExp} ignore - regex for files and directories to ignore - will compare against absolute paths
 * @property {string} soyFilesGlob - glob of the files you will be watching in the working directory
 * @property {string} workingDirectory - absolute path to the working directory
 * @property {boolean} verbose - print extra info
 *
 */

/**
 * Compiler options
 */
class SoyOptions {

    /**
     * @param {SoyOptionsArguments|string[]} options
     */
    constructor(options) {
        /**
         * @type {SoyOptionsArguments}
         */
        this.options = {
            "workingDirectory": process.cwd()
        };
        this.update(options);
    }

    /**
     * List of all the valid arguments that can be passed to the Java compiler
     * @returns {string[]}
     */
    getValidSoyArguments() {
        return [
            "srcs",
            "deps",
            "locales",
            "messageFilePathFormat",
            "outputPathFormat",
            "shouldGenerateGoogMsgDefs",
            "bidiGlobalDir",
            "useGoogIsRtlForBidiGlobalDir",
            "googMsgsAreExternal",
            "pluginModules"
        ];
    }

    /**
     * List of all the valid arguments that we can use for the watcher
     * @returns {string[]}
     */
    getValidWatcherArguments() {
        return [
            "watch",
            "ignore",
            "soyFilesGlob",
            "workingDirectory",
            "verbose"
        ];
    }

    /**
     *
     * @param {string} argument
     * @param {boolean=} watcher - if watcher arguments are accepted
     */
    isValidArgument(argument, watcher= false) {
        if(!argument) {
            return false;
        }

        const soyArgs = this.getValidSoyArguments();
        if(!watcher) {
            return soyArgs.includes(argument);
        }

        const watcherArgs = this.getValidWatcherArguments();
        return soyArgs.includes(argument) || watcherArgs.includes(argument);
    }

    /**
     * @param {SoyOptionsArguments|string[]} options
     */
    update(options) {
        if(Array.isArray(options)) {
            options.forEach(rawArg => {
                const {arg, value} = this.parseCommandArgument(rawArg);
                if(this.isValidArgument(arg, true)) {
                    this.options[arg] = value;
                }
            });
        }
        else {
            for(const key in options) {
                if(this.isValidArgument(key, true)) {
                    this.options[key] = options[key];
                }
            }
        }
    }

    /**
     * @returns {string[]}
     */
    toJavaArguments() {
        const args = [];
        for (const key in this.options) {
            if(this.isValidArgument(key)) {
                args.push("--" + key);
                args.push(this.options[key]);
            }
        }
        return args;
    }

    /**
     *
     * @param {string} argument
     * @returns {{arg: string, value: string}}
     */
    parseCommandArgument(argument) {
        if(argument.includes("=")) {
            return {
                arg: argument.substring(2, argument.indexOf("=")),
                value: argument.substring(argument.indexOf("=") + 1)
            };
        }
        return {
            arg: argument.substring(2),
            value: ""
        };
    }
}

module.exports = {
    SoyOptions,
    Logger
}
