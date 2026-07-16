export default {
  setupFiles: ['./jest.setup.ts'],
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  collectCoverageFrom: [
    'src/components/ThemeProvider.tsx',
    'src/components/Footer.tsx',
    'src/components/Navbar.tsx',
    'src/components/ToggleMode.tsx',
  ],
}
