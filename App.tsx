/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { Text, TextInput } from 'react-native';

// --- GLOBAL ENFORCE: disable font scaling + force font family -----------------
// IMPORTANT:
// 1) Run this BEFORE any other imports that render <Text> or <TextInput>.
// 2) Replace "YourCustomFont" with the real font family name as registered in iOS/Android.
const ORIGINAL_CREATE_ELEMENT = React.createElement;

(React as any).createElement = function (
  type: any,
  props: any,
  ...children: any[]
) {
  // Only target RN core Text and TextInput components
  if (type === Text || type === TextInput) {
    props = props || {};

    // Force allowFontScaling to false (prevents device accessibility font-size scaling)
    props.allowFontScaling = false;

    // Force your font family to override any user or library styles.
    // Put our style AFTER props.style so it wins (later array items override earlier ones).
    props.style = [props.style, { fontFamily: 'Poppins-Regular' }];

    // If you also want to ensure the fontWeight/italic are preserved with your font,
    // you can add fallback keys here as needed.
  }

  return ORIGINAL_CREATE_ELEMENT.call(React, type, props, ...children);
};

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import { SoundMixerProvider } from './src/context/CSoundProvider';
import RestAraApp from './src/screens/RestAra';

// // Disable scaling globally
// (Text as any).defaultProps = (Text as any).defaultProps || {};
// (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};

// (Text as any).defaultProps.allowFontScaling = false;
// (TextInput as any).defaultProps.allowFontScaling = false;

// // Force global font
// (Text as any).defaultProps.style = [{ fontFamily: 'Poppins' }];

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SoundMixerProvider>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
    </SoundMixerProvider>
  );
}

function AppContent() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={RestAraApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
