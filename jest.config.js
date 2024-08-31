const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' }),
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/src/models/', '<rootDir>/src/classes/', '<rootDir>/src/utils/test.utils.ts'],
  setupFilesAfterEnv: ['./jest.setup.js'], // Add your setup file here
};
