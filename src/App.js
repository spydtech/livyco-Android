import { LogBox, SafeAreaView, Text, View } from 'react-native';
import React from 'react';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigation from './navigations/AppNavigation';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

// Handling the device size
if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = false;
} else {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}
const App = () => {
  LogBox.ignoreAllLogs(); //Ignore all log console
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          <FlashMessage position="top" />
          <AppNavigation />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
