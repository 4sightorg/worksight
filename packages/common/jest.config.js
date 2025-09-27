import base from "../../jest.config.js";

export default {
  ...base,
  displayName: "common",
  testMatch: ["<rootDir>/packages/common/**/*.test.{ts,tsx}"],
};