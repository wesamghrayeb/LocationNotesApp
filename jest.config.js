module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@reduxjs/toolkit|immer|react-redux|redux-persist|react-native-permissions|react-native-safe-area-context|react-native-gesture-handler|react-native-reanimated|react-native-webview)/)',
  ],
};
