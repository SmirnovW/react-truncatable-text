/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.jsx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
