const glob = require("tiny-glob");
const path = require("path");
const SoyBuilder = require("../index").SoyBuilder;

const runExample = async () => {
    let sourceFiles = await glob("**/*.soy", {
            absolute: true,
            cwd: process.cwd(),
            filesOnly: true
        });

    sourceFiles = sourceFiles.filter(z => !z.includes("node_modules"));
    const builder = new SoyBuilder({
        srcs: sourceFiles.join(","),
        watch: true,
        locales: "es-ES,en",
        messageFilePathFormat: path.join(__dirname, "translations", "{LOCALE}.xlf"),
        outputPathFormat: "./soyified/{LOCALE}/{INPUT_DIRECTORY}/{INPUT_FILE_NAME_NO_EXT}.js",
        soyFilesGlob: "**/*.soy",
        ignore: /(.*node_modules|.*\.git|.*soyified|.*dist|.*\.idea)/,
        workingDirectory: process.cwd(),
        verbose: false
    });
    await builder.start();
    await builder.stop();
}

runExample()
    .catch(e => {
        console.log("Opps! Something bad happened: " + e.toString());
    })
