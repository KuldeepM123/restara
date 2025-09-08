import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LogoVertical from '../../assets/icons/logo-vertical.svg';
import ToggleSwitchWithText from '../../components/ToggleSwitch';
import CountdownTimer from '../../components/CountDown';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LogoVertical />
        {/* <ToggleSwitchWithText /> */}
      </View>
      <CountdownTimer />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    // height: '100%',
    // flex: 1,
    // justifyContent: 'center',
    // flexDirection: 'row', // arrange children in a row
    alignItems: 'center', // vertically center items
    justifyContent: 'space-between', // space out evenly
    paddingHorizontal: 10, // add left/right padding
    marginTop: 20,
    backgroundColor: '#5b4d8c',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
