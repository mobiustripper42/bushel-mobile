// jest-expo preset — runs unit tests for pure logic (API client, token store,
// payload parsing) per .claude/CLAUDE-context.md § Testing. No RLS/Playwright
// layers (no database, native app). Component rendering uses
// @testing-library/react-native when needed.
module.exports = {
  preset: 'jest-expo',
  // Transform RN + Expo ESM packages that ship untranspiled.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg))',
  ],
};
