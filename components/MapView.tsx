// Platform-specific MapView component
// This file automatically resolves to:
// - MapView.web.tsx on web platform
// - MapView.native.tsx on native platforms (iOS/Android)

import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  module.exports = require('./MapView.web').default;
} else {
  module.exports = require('./MapView.native').default;
}