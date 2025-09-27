import base from "../../jest.config.js";

export default {
  ...base,
  displayName: "web",
  testMatch: ["<rootDir>/apps/web/**/*.test.{ts,tsx}"],
};
