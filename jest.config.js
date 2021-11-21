module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/public/',
    '/bin',
    '/build',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/public/',
    '/bin',
    '/build',
  ],
};
