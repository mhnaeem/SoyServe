"use strict"

const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require("path");
const sUtils = require("./utils");
const SoyOptions = sUtils.SoyOptions;
const SoyWatcher = require("./watcher");
const Logger = new (sUtils.Logger)(true);

class SoyBuilder {

    /**
     *
     * @param {string[]|SoyOptionsArguments} argsObject
     * @returns {Promise<void>}
     */
    constructor(argsObject) {
        this.soyOptions = new SoyOptions(argsObject);
        this.watcher = null;
        this.javaExec = "";
        this.jarPath = "";
        Logger.setVerbose(this.soyOptions.verbose || false);
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async start() {
        Logger.log("Soy Compiler Started Running");
        await this._soyRunJar(this.soyOptions.toJavaArguments());
        Logger.log("Compilation Successful!");

        if(this.soyOptions.options.watch && !this.watcher) {
            try {
                this.watcher = await this._registerWatcher();
            }
            catch (err) {
                Logger.imp("Error occurred while trying to register the Soy watcher: " + err.toString());
            }
        }

    }

    /**
     *
     * @returns {Promise<void>}
     */
    async stop() {
        Logger.log("Stopped the soy builder");
        await this.watcher.stop();
        process.exit();
    }

    /**
     *
     * @returns {Promise<SoyWatcher>}
     * @private
     */
    async _registerWatcher() {
        const soyWatchBuildSingleSource = async (absSource) => {
            let newOptions = {...this.soyOptions.options};
            newOptions.srcs = [absSource];
            newOptions.watch = false;
            await this._soyRunJar(new SoyOptions(newOptions).toJavaArguments());
        }

        const soyWatcher = new SoyWatcher(this.soyOptions, soyWatchBuildSingleSource);
        await soyWatcher.start();
        return soyWatcher;
    }

    /**
     *
     * @returns {string}
     */
    getJavaExec() {
        if(!this.javaExec) {
            if(process.env.JAVA_HOME) {
                this.javaExec = `${process.env.JAVA_HOME}/bin/java`;
            }
            else {
                Logger.log("Could not find java executable, if there is trouble running this please set the JAVA_HOME env variable");
                this.javaExec = "java";
            }
        }
        return this.javaExec;
    }

    /**
     *
     * @returns {string}
     */
    getJarPath() {
        if(this.soyOptions.options.customCompileJarPath) {
            this.jarPath = this.soyOptions.options.customCompileJarPath;
        }

        if(!this.jarPath) {
            this.jarPath = path.join(__dirname, "..", "closure_templates", "SoyToJsSrcCompiler.jar");
        }

        return this.jarPath;
    }

    /**
     *
     * @param {string[]} args - Arguments in the correct order that will be used to run the Java compiler
     * @returns {Promise<void>}
     * @private
     */
    async _soyRunJar(args) {

        args = [this.getJavaExec(), "-jar", this.getJarPath()].concat(args);

        const command = args.join(" ");

        const { stdout, stderr } = await exec(command);

        if(stdout) {
            Logger.imp("OUT: " + stdout);
        }

        if (stderr) {
            Logger.imp("ERROR: " + stderr);
        }

    }
}

module.exports = SoyBuilder;
