/**
 * @fileoverview Public facing file
 */
const path = require('path');

const SoyBuilder = require("./src/builder");
const SoyCompileLoader = require("./webpack/soy_compile");
const SoyPostProcessorLoader = require("./webpack/soy_postprocessor");
const SoyPreProcessorLoader = require("./webpack/soy_preprocessor");

const Webpack = {
    SoyCompileLoader: path.join(__dirname, "./webpack/soy_compile"),
    SoyPostProcessorLoader: path.join(__dirname, "./webpack/soy_postprocessor"),
    SoyPreProcessorLoader: path.join(__dirname, "./webpack/soy_preprocessor")
}

module.exports = {
    Webpack,
    SoyBuilder,
    SoyCompileLoader,
    SoyPostProcessorLoader,
    SoyPreProcessorLoader
};
