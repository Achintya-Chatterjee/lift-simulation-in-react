export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    clearMocks: true,
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    testMatch: ['**/__tests__/**/*.(ts|tsx|js|jsx)', '**/?(*.)+(spec|test).(ts|tsx|js|jsx)'],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
  };
  