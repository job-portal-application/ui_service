export default {
  setupFiles: ['./jest.setup.ts'],
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.*/config/env$': '<rootDir>/src/config/__mocks__/env.ts',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/fileMock.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
      diagnostics: { ignoreCodes: [1343, 2882] },
    }],
  },
  collectCoverageFrom: [
    'src/App.tsx',
    'src/components/PageWrapper.tsx',
    'src/components/Loader.tsx',
    'src/redux/hooks.ts',
    'src/redux/slices/loaderSlice.ts',
    'src/redux/slices/userSlice.ts',
    'src/components/ThemeProvider.tsx',
    'src/components/Footer.tsx',
    'src/components/Navbar.tsx',
    'src/components/ToggleMode.tsx',
    'src/components/CareerGuidance.tsx',
    'src/components/ResumeAnalyzer.tsx',
    'src/pages/Authentication/SignupPage.tsx',
  ],
}