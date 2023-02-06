export default {
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['<rootDir>/package.json'],
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.js?$': 'babel-jest',
    //typescript转换
    '^.+\\.ts?$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/**/hooks/src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/**/src/index.ts',
    '!**/dist/**',
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(screenfull))'],
};
