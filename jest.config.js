// jest.config.js
const { createDefaultPreset } = require("ts-jest");

const tsJestPreset = createDefaultPreset();

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  roots: ["<rootDir>/apps", "<rootDir>/packages"],
  moduleNameMapper: {
    "^@worksight/common/(.*)$": "<rootDir>/packages/common/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: tsJestPreset.transform,
};
