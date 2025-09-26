const baseConfig = require('../../jest.config.base.js');

module.exports = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@resume-platform/(.*)$': '<rootDir>/../../packages/$1/src',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
