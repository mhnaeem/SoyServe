const path = require("path");
const SoyPreProcessor = path.resolve(path.join(__dirname, '../soy_serve/webpack/soy_preprocessor'));
const SoyCompiler = path.resolve(path.join(__dirname, '../soy_serve/webpack/soy_compile'));
const SoyPostProcessor = path.resolve(path.join(__dirname, '../soy_serve/webpack/soy_postprocessor'));

module.exports = {
    entry: ['sourceFiles0.js', './sourceFile1.js'],
    output: {
        path: path.join(__dirname, '../dist/'),
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
                        loader: SoyPostProcessor,
                        options: {
                            modular: true,
                            useModule: true,
                            declareLegacyNamespace: true,
                            useProvide: false,
                            removeDebug: true
                        }
                    },
                    {
                        loader: SoyCompiler,
                        options: {
                            locale: "en",
                            verbose: false,
                            tempDir: path.join(process.cwd(), "/tmp"),
                            workingDirectory: path.join(process.cwd()),
                            localeFiles: path.join(process.cwd(), "/translations/{LOCALE}.xlf")
                        }
                    },
                    {
                        loader: SoyPreProcessor,
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