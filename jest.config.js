module.exports = {
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    }
  },
  preset: "ts-jest",
  roots: ["<rootDir>/test/"],
  setupFilesAfterEnv: ["<rootDir>/setup-jasmine-env.js"],
  testEnvironment: "node",
  testMatch: [
    "**/test/**/?(*.)+(spec|test).ts?(x)",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
