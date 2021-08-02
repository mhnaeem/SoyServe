"use strict"

const chokidar = require("chokidar");
const path = require("path");
const sUtils = require("./utils");
const Logger = new (sUtils.Logger)(true);

/**
 * Simple watcher class that monitors for changes in .soy files
 */
class SoyWatcher {

    /**
     *
     * @param {function} compileSingleSourceCallback
     * @param {SoyOptions} options
     */
    constructor(options, compileSingleSourceCallback) {
        this.soyOptions = options.options;
        this.compileSingleSourceCallback = compileSingleSourceCallback;
        this.soyWatcher = null;
        Logger.setVerbose(this.soyOptions.verbose || false);
    }

    /**
     * Start the watcher
     * @returns {Promise<void>}
     */
    async start() {
        this.soyWatcher = chokidar.watch(this.soyOptions.soyFilesGlob, {
            persistent: true,
            ignoreInitial: true,
            followSymlinks: false,
            cwd: this.soyOptions.workingDirectory,
            ignored: this.soyOptions.ignore
        })
        .on("change", async (filePath) => {
            const absolutePathToFile = path.join(this.soyOptions.workingDirectory, filePath);
            Logger.log("Soy File Changed: " + absolutePathToFile);
            await this.compileSingleSourceCallback(absolutePathToFile);
            Logger.log("Compiled File: " + absolutePathToFile);
        });

        Logger.imp("Started watching Soy files for changes in: " + path.join(this.soyOptions.workingDirectory, this.soyOptions.soyFilesGlob));
    }

    /**
     * Stop the watcher
     * @returns {Promise<void>}
     */
    async stop() {
        if (this.soyWatcher) {
            Logger.log("Gracefully shutting down Soy file watcher");
            await this.soyWatcher.close();
            Logger.log("Watcher successfully shut down");
        }
        else {
            Logger.log("Couldn't gracefully shut down the Soy file watcher");
        }
    }
}

module.exports = SoyWatcher;
