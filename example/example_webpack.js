const path = require("path");
const SoyCompileLoader = require("../index").SoyCompileLoader;
const SoyPostProcessorLoader = require("../index").SoyPostProcessorLoader;
const SoyPreProcessorLoader = require("../index").SoyPreProcessorLoader;

module.exports = {
    entry: ['sourceFiles0.js', './sourceFile1.js'],
    output: {
        path: path.join(__dirname, "..", "dist"),
        filename: 'main.js'
    },
    mode: 'production',
    devtool: false,
    module: {
        rules: [
            {
                test: /\.soy/,
                use: [
                    {
                        loader: SoyPostProcessorLoader,
                        options: {
                            modular: true,
                            useModule: true,
                            declareLegacyNamespace: true,
                            useProvide: false,
                            removeDebug: true
                        }
                    },
                    {
                        loader: SoyCompileLoader,
                        options: {
                            locale: "en",
                            verbose: false,
                            tempDir: path.join(process.cwd(), "tmp"),
                            workingDirectory: path.join(process.cwd()),
                            localeFiles: path.join(process.cwd(), "translations", "{LOCALE}.xlf")
                        }
                    },
                    {
                        loader: SoyPreProcessorLoader,
                        options: {
                            addSoyDoc: true,
                            removeLeadingEmptySpaces: true
                        }
                    }
                ]
            }
        ]
    }
}