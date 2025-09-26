const baseConfig = require('../../jest.config.base.js');

module.exports = {
  ...baseConfig,
  testEnvironment: 'jsdom', // Use jsdom for React components
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@resume-platform/(.*)$': '<rootDir>/../../packages/$1/src',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Optional setup file
};
