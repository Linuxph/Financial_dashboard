module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'services/**/*.ts',
    'controllers/**/*.ts',
    'utils/**/*.ts',
    'middleware/**/*.ts'
  ],
  coverageDirectory: 'coverage',
  clearMocks: true,
  verbose: true
};