module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.spec.ts', '**/tests/**/*.test.ts'],

  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: 'coverage',

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/config/',
    '/src/app.ts',
    '/src/server.ts',
    '/src/database/migrations/',
    '/src/database/fixtures.ts'
  ],
};