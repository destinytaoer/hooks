export default {
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['<rootDir>/package.json'],
  transform: {
    //这个是jest的默认配置
    '^.+\\.jsx?$': 'babel-jest',
    //typescript转换
    '^.+\\.ts?$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/**/hooks/src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/**/src/index.ts',
    '!**/dist/**'
  ],
};
