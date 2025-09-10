import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface CustomToggleSwitchProps {
  value: boolean; // current state (on/off)
  onToggle: (newValue: boolean) => void;
}

const CustomToggleSwitch = ({ value, onToggle }: CustomToggleSwitchProps) => {
  const [animValue] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const toggleSwitch = () => {
    onToggle(!value);
  };

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 45], // knob travel distance
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleSwitch}
      style={styles.switchContainer}
    >
      {/* Labels */}
      <Text
        style={[styles.label, { left: 10, color: value ? '#000' : 'white' }]}
      >
        ON
      </Text>
      <Text
        style={[styles.label, { right: 10, color: !value ? '#000' : 'white' }]}
      >
        OFF
      </Text>

      {/* Moving Knob */}
      <Animated.View
        style={[
          styles.knob,
          {
            transform: [{ translateX }],
            backgroundColor: value ? 'green' : 'red',
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 70,
    height: 25,
    borderRadius: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  knob: {
    position: 'absolute',
    width: 23,
    height: 23,
    borderRadius: 20,
  },
  label: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CustomToggleSwitch;
