const loaderUtils = require("loader-utils");
const SoyBuilder = require("../src/builder");
const path = require("path");

module.exports = function (content, map, meta) {
    const fs = this.fs.fileSystem;
    const options = loaderUtils.getOptions(this);
    const callback = this.async();
    this.cacheable();

    if(!options.workingDirectory) {
        callback(new Error("Need to send in an absolute path to a working directory"));
    }

    const absoluteFilePath = loaderUtils.interpolateName(this, "[path][name].[ext]", {content: content});
    const absoluteFilePathWithoutFile = loaderUtils.interpolateName(this, "[path]", {content: content});
    const relativeFilePath = path.relative(options.workingDirectory, absoluteFilePathWithoutFile);
    const tempDirPath = options.tempDir ? options.tempDir : path.join(options.workingDirectory, "/temp_soyified");

    if (!fs.existsSync(tempDirPath)){
        fs.mkdirSync(tempDirPath, { recursive: true });
    }

    const outputPath = options.locale ?
        `${tempDirPath}/{LOCALE}/${relativeFilePath}/{INPUT_FILE_NAME_NO_EXT}.js`
        :
        `${tempDirPath}/${relativeFilePath}/{INPUT_FILE_NAME_NO_EXT}.js`;

    const soyOptions = {
        srcs: [absoluteFilePath],
        verbose: options.verbose,
        locales: options.locale,
        workingDirectory: options.workingDirectory,
        messageFilePathFormat: options.localeFiles,
        customCompileJarPath: options.customCompileJarPath,
        outputPathFormat: outputPath
    }

    // remove undefined and null
    Object.keys(soyOptions).forEach(key => {
        if (soyOptions[key] === undefined || soyOptions[key] === null) {
            delete soyOptions[key];
        }
    });

    const outputAbsoluteFilePath = options.locale ?
        loaderUtils.interpolateName(this, `${tempDirPath}/${options.locale}/${relativeFilePath}/[name].js`, {content: content})
        :
        loaderUtils.interpolateName(this, `${tempDirPath}/${relativeFilePath}/[name].js`, {content: content});

    const readFile = async (filePath) => {
        try {
            return fs.readFileSync(filePath, 'utf8');
        }
        catch (err) {
            this.emitError("Failed to read the processed soy file: " + absoluteFilePath);
            callback(err);
        }
    }

    const build = async () => {

        const soyBuilder = new SoyBuilder(soyOptions);
        await soyBuilder.start();

        let data = await readFile(outputAbsoluteFilePath);
        callback(null, data, map, meta);
    }

    build()
        .catch(err => {
            this.emitError("Soy Builder Failed to Build");
            callback(err);
        });
};

