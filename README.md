# SoyServe

[![NPM](https://nodei.co/npm/soy-serve.png?mini=true)](https://www.npmjs.com/package/soy-serve)

This repository contains multiple tools to allow us to handle Soy or officially known as [Closure Templates](https://github.com/google/closure-templates) based files for a NodeJS based application. It contains a compiler utility, watcher which checks for file changes and recompiles, and it also contains loaders for Webpack to allow for integration between Webpack and Closure Templates.

**Note:** This is just a layer on top of the original Soy Compiler provided by Google. You still need Java and the Soy compiler to run this.

## Getting Started

There are multiple ways to use this tool, [examples](/example) of each are provided in the example directory.

1. Using NodeJS class directly
```javascript
const SoyBuilder = require("soy-serve").SoyBuilder;

const runExample = async () => {
    const sourceFiles = [
        "/absoulte/path/to/source/file1.soy",
        "/absoulte/path/to/source/file2.soy"
    ];

    const builder = new SoyBuilder({
        srcs: sourceFiles.join(","),
        locales: "en",
        workingDirectory: process.cwd(),
        messageFilePathFormat: path.join(__dirname, "translations", "{LOCALE}.xlf"),
        outputPathFormat: "./translations_output/{LOCALE}.js"
    });
    await builder.start();
    await builder.stop();
}

runExample()
```
2. Using the CLI
```shell
node ./example/example_cli.js --outputPathFormat="./translations_output/{LOCALE}.js" --srcs="/absoulte/path/to/source/file1.soy,/absoulte/path/to/source/file2.soy" --locales=en
```
3. Using Webpack loaders
```javascript
const path = require("path");
const SoyCompileLoader = require("soy-serve").SoyCompileLoader;
const SoyPostProcessorLoader = require("soy-serve").SoyPostProcessorLoader;
const SoyPreProcessorLoader = require("soy-serve").SoyPreProcessorLoader;

module.exports = {
    entry: ['sourceFiles0.js', './sourceFile1.js'],
    output: {
        path: path.join(__dirname, "..", "dist"),
        filename: 'main.js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.soy/,
                use: [
                    {
                        loader: SoyPostProcessorLoader,
                    },
                    {
                        loader: SoyCompileLoader,
                        options: {
                            locale: "en",
                            tempDir: path.join(process.cwd(), "tmp"),
                            workingDirectory: path.join(process.cwd()),
                            localeFiles: path.join(process.cwd(), "translations", "{LOCALE}.xlf")
                        }
                    },
                    {
                        loader: SoyPreProcessorLoader
                    }
                ]
            }
        ]
    }
}
```

## API Reference:

### NodeJS/CLI:
Accepts the following arguments:

+ `watch` (boolean) - start watching for changes and recompile files
+ `ignore` (RegExp) - regex for files and directories to ignore - will compare against absolute paths
+ `soyFilesGlob` (string) - glob of the files you will be watching in the working directory
+ `workingDirectory` (string) - absolute path to the working directory
+ `verbose` (boolean) - print extra info
+ `customCompileJarPath` (string) - absolute path to a custom jar file for compiling

In addition to all the arguments accepted by the Soy compiler provided by Google Closure Templates [see here](https://github.com/google/closure-templates/blob/master/documentation/dev/dir.md)

**Note:** To use the following arguments in the CLI please use the following syntax `node ./fileWithPassingArgsToCompiler.js --locales="en" --messageFilePathFormat="/path/something"`

### Webpack Loaders:

1. SoyPreProcessorLoader - For processing Soy files before they are compiled into JS:

+ `soyDoc` (boolean) - add SoyDoc comments before templates in Soy file that don't have them to conform to the Soy v2 requirement
+ `removeLeadingEmptySpaces` (boolean) removes empty whitespace before template tags and SoyDoc to conform with Soy v2

2. SoyCompileLoader - For compiling Soy files into JS:

+ `workingDirectory` (string) - absolute path to the working directory
+ `verbos` (boolean) - print more info in the console
+ `locale` (string) - what local do you want to compile for
+ `localeFiles` (string) - absolute path to the translation xlf files (can use Closure templating string)
+ `customCompileJarPath` (string) - absolute path to a different jar file for compiling the Soy files 
+ `tempDir` (string) - relative path to a temporary directory to hold build artifacts

3. SoyPostProcessorLoader - For processing compiled JS files to be friendly to newer syntax:

+ `removeDebug` (boolean) - removes goog.DEBUG based statements from the compiled Soy files
+ `useProvide` (boolean) - add `goog.provide("soy.namespace")` type statement in the compiled file - cannot be used with modules
+ `modular` (boolean) - convert the file into goog modules, export all the functions instead of defining them on a global namespace
+ `useModule` (boolean) - add a `goog.module("soy.namespace")` statement
+ `declareLegacyNamespace` (boolean) - add a `goog.module.declareLegacyNamespace()` statement for global access

#### IMPORTANT:
This is a tool I developed for learning, it is not meant for production usage. Please feel free to add PRs or open issues for any improvements.
