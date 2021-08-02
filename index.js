/**
 * @fileoverview Public facing file
 */

const SoyBuilder = require("./src/builder");
const SoyCompileLoader = require("./webpack/soy_compile");
const SoyPostProcessorLoader = require("./webpack/soy_postprocessor");
const SoyPreProcessorLoader = require("./webpack/soy_preprocessor");

module.exports = {
    SoyBuilder,
    SoyCompileLoader,
    SoyPostProcessorLoader,
    SoyPreProcessorLoader
};
