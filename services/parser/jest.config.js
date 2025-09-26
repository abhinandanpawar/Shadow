const baseConfig = require('../../jest.config.base.js');

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@resume-platform/(.*)$': '<rootDir>/../../packages/$1/src',
  },
};
