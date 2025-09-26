/** @type {import('ts-jest').JestConfigWithTsJest} */
const path = require('path');

module.exports = {
  transform: {
    '^.+\.(ts|tsx)$': ['babel-jest', { configFile: path.resolve(__dirname, 'babel.config.js') }],
  },
  testEnvironment: 'node',
  verbose: true,
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^@resume-platform/(.*)$': '<rootDir>/packages/$1/src',
  },
};
