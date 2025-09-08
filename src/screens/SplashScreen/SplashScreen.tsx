// SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, Image, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SplashScreenNavigationProp } from '../../types/navigation';
import Mandala from '../../assets/icons/mandala.svg';
import Buddha from '../../assets/icons/buddha.svg';
import Logo from '../../assets/icons/logo.svg';
const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const spinValue = useRef(new Animated.Value(0)).current;

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
      <Logo style={{ alignSelf: 'center', marginTop: 50 }} />

      <View style={styles.centerWrapper}>
        <View>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Mandala width={350} height={350} />
          </Animated.View>
        </View>
        <View style={styles.buddha}>
          <Buddha width={360} height={360} />
        </View>
      </View>

      <Image
        source={require('../../assets/logo/gradient-bg.png')}
        style={{ zIndex: 0, width: '100%', position: 'absolute', bottom: 0 }}
        resizeMode="cover"
      />

      <Text style={styles.tagline}>WHERE PEACE BEGINS.</Text>
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
  centerWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 999,
    top: 60,
    position: 'relative',
    alignItems: 'center',
  },
  buddha: {
    position: 'absolute',
    top: 135,
    left: '50%',
    transform: [{ translateX: '-49.5%' }],
  },
  tagline: {
    fontSize: 14,
    color: 'white',
    letterSpacing: 1,
    marginBottom: 60,
    textAlign: 'center',
  },
});
