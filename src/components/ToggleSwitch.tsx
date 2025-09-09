import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

// interface CustomToggleSwitchProps {
//   value: boolean;
//   onPress: () => void;
// }
const CustomToggleSwitch = () => {
  const [isOn, setIsOn] = useState(true);
  const [animValue] = useState(new Animated.Value(1));

  const toggleSwitch = () => {
    const toValue = isOn ? 0 : 1;
    Animated.timing(animValue, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsOn(!isOn);
  };

  // Animate highlight position
  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 35], // adjust for width
  });

  return (
    <TouchableOpacity
      activeOpacity={0.2}
      onPress={toggleSwitch}
      style={styles.switchContainer}
    >
      {/* Moving highlight */}
      <Animated.View
        style={[
          styles.highlight,
          {
            transform: [{ translateX }],
            backgroundColor: isOn ? 'green' : 'red',
          },
        ]}
      />

      {/* ON text */}
      {isOn && (
        <Text
          style={[styles.text, { left: 10, color: isOn ? '#000' : '#777' }]}
        >
          ON
        </Text>
      )}

      {/* OFF text */}
      {!isOn && (
        <Text
          style={[styles.text, { right: 10, color: !isOn ? '#000' : '#777' }]}
        >
          OFF
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 70,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // position: 'relative',
    // overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    width: 35, // half the switch width
    height: '100%',
    borderRadius: 20,
  },
  text: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CustomToggleSwitch;
