// 2. ENHANCED VERSION WITH PROPS
import React, { useState, useRef } from 'react';
import { View, Text, PanResponder, Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const CustomSlider = ({
  initialValue = 0.6,
  onValueChange,
  label = 'Bird',
  minValue = 0,
  maxValue = 100,
  trackColor = '#A799C7',
  activeTrackColor = '#FFFFFF',
  thumbColor = '#FFFFFF',
  backgroundColor = '#7B68A6',
}) => {
  const [value, setValue] = useState(initialValue);
  const sliderWidth = screenWidth - 80;
  const thumbSize = 24;

  const handleValueChange = newValue => {
    setValue(newValue);
    if (onValueChange) {
      // Convert 0-1 range to minValue-maxValue range
      const actualValue = minValue + newValue * (maxValue - minValue);
      onValueChange(actualValue);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: evt => {
        const touchX = evt.nativeEvent.locationX;
        const newValue = Math.max(0, Math.min(1, touchX / sliderWidth));
        handleValueChange(newValue);
      },

      onPanResponderMove: evt => {
        const touchX = evt.nativeEvent.locationX;
        const newValue = Math.max(0, Math.min(1, touchX / sliderWidth));
        handleValueChange(newValue);
      },

      onPanResponderRelease: () => {
        // Optional: Add haptic feedback
        console.log('Final slider value:', value);
      },
    }),
  ).current;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{label}</Text>
      </View>

      <View style={styles.sliderContainer}>
        <View
          style={[styles.sliderTrack, { width: sliderWidth }]}
          {...panResponder.panHandlers}
        >
          <View
            style={[styles.trackBackground, { backgroundColor: trackColor }]}
          />
          <View
            style={[
              styles.trackActive,
              { width: value * sliderWidth, backgroundColor: activeTrackColor },
            ]}
          />
          <View
            style={[
              styles.thumb,
              {
                left: value * (sliderWidth - thumbSize),
                backgroundColor: thumbColor,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  sliderContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  sliderTrack: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  trackBackground: {
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    width: '100%',
  },
  trackActive: {
    height: 6,
    borderRadius: 3,
    position: 'absolute',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    top: -9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
