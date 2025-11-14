import { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  // Fix for react-dnd ESM modules issue
  transformIgnorePatterns: [
    '/node_modules/(?!((react-dnd|@react-dnd|dnd-core|react-dnd-html5-backend|react-dnd-touch-backend)/.*))'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Enhanced reporter configuration for cleaner output
  reporters: [
    ["default", { 
      "reverseTestOrder": true,
      "showSummary": true,
      "verbosity": 2
    }]
  ],
  // Improve test output clarity
  verbose: false,
  // Set a default test timeout (in milliseconds)
  testTimeout: 10000,
  // Better error reporting for easier debugging
  errorOnDeprecated: true,
  // Only run tests related to changed files when in watch mode
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.git/'
  ],
  // Add code coverage configuration
  collectCoverage: process.env.CI === 'true',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
    '!src/setupTests.ts',
    '!src/reportWebVitals.ts',
    '!src/__mocks__/**'
  ],
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  // Clear the console before each test run
  clearMocks: true,
  // Reset mocks between tests to avoid cross-test contamination
  resetMocks: false,
  // Make test output more deterministic by resetting modules
  resetModules: false,
};

export default config;
