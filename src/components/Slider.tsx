import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface SliderProps {
  label?: string;
  icon?: ReactNode;
  value?: number;
  onValueChange: (value: number) => void;
}

const CustomSlider = ({ label, icon, value, onValueChange }: SliderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.sliderWrapper}>
        <Slider
          style={styles.slider}
          onValueChange={onValueChange}
          value={value || 0}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={'#8B7CB6'}
          maximumTrackTintColor={'#E0E0E0'}
          // thumbStyle={styles.thumb}
          // trackStyle={styles.track}
        />
      </View>
      <View style={styles.header}>
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 12,
  },
  icon: {
    // marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  sliderWrapper: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    // paddingHorizontal: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thumb: {
    backgroundColor: '#8B7CB6',
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  track: {
    height: 6,
    borderRadius: 3,
  },
});

export default CustomSlider;
