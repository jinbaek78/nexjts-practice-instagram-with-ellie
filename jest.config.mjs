import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', { presets: ['next/babel'] }],
  },

  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/tests/(.*)$': '<rootDir>/src/tests/$1',
    '^@/service/(.*)$': '<rootDir>/src/service/$1',
    '^@/util/(.*)$': '<rootDir>/src/util/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/actions/(.*)$': '<rootDir>/src/actions/$1',
    'next-auth/react': '<rootDir>/node_modules/next-auth/react/index',

    //
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
