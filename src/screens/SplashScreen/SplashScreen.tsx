// SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Text,
  Image,
  Easing,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SplashScreenNavigationProp } from '../../types/navigation';
import Mandala from '../../assets/icons/mandala.svg';
import Buddha from '../../assets/icons/buddha.svg';
import Logo from '../../assets/icons/logo.svg';
const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const spinValue = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('screen');

  useEffect(() => {
    // Spin chakra infinitely
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      }),
    ).start();

    // Redirect to Main screen after 6s
    const timer = setTimeout(() => {
      navigation.replace('Main'); // replace so user can’t go back
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation, spinValue]);

  useEffect(() => {
    // Create the infinite spinning animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000, // 2 seconds for a full rotation
        easing: Easing.linear, // Smooth linear animation
        useNativeDriver: true, // Use native driver for better performance
      }),
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Logo style={[styles.logo, { marginTop: height * 0.06 }]} />

      <View style={styles.centerWrapper}>
        <View style={styles.mandalaWrapper}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Mandala width={width * 0.85} height={width * 0.85} />
          </Animated.View>
        </View>
        <View style={[styles.buddha, { top: height * 0.16 }]}>
          <Buddha width={width * 0.87} height={width * 0.87} />
        </View>
      </View>

      <Image
        source={require('../../assets/logo/gradient-bg.png')}
        style={{ zIndex: 0, width: '100%', position: 'absolute', bottom: 0 }}
        resizeMode="cover"
      />

      <Text style={[styles.tagline, { marginBottom: height * 0.08 }]}>
        WHERE PEACE BEGINS.
      </Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: '#5b4d8c',
  },
  logo: {
    alignSelf: 'center',
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  mandalaWrapper: {
    // position: 'absolute',
    top: -25,
  },
  buddha: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: '-50%' }],
  },
  tagline: {
    fontSize: 14,
    color: 'white',
    letterSpacing: 1,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
