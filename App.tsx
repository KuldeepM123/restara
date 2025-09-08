/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import { SoundMixerProvider } from './src/context/CSoundProvider';
import RestAraApp from './src/screens/RestAra';

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
