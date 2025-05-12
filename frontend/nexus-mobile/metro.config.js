const { getDefaultConfig } = require("expo/metro-config");
const dotenv = require("dotenv");

dotenv.config();

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts.push("svg");

module.exports = config;
