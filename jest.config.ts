// filepath: /Users/alishataylor/islam4kids-games/jest.config.ts
import { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-dnd|@react-dnd|dnd-core|react-dnd-html5-backend|react-dnd-touch-backend).*)'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Add this option to show failing tests last
  reporters: [
    ["default", { "reverseTestOrder": true }]
  ]
};

export default config;
