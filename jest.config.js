module.exports = {
  testMatch: ["src/**/*.test.ts"],
  testEnvironment: "node",
  rootDir: "src",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
};
