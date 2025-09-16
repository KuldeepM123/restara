import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutChangeEvent,
} from 'react-native';

interface CustomSliderProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  trackColor?: string;
  thumbColor?: string;
  onValueChange?: (value: number) => void;
}

const CustomSliderTwo: React.FC<CustomSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  initialValue = 0,
  trackColor = '#ddd',
  thumbColor = '#007AFF',
  onValueChange,
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  // Store current value
  const [value, setValue] = useState(initialValue);

  // When layout is known, set thumb position
  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setSliderWidth(width);
    const initialX = ((initialValue - min) / (max - min)) * width;
    pan.setValue({ x: initialX, y: 0 });
  };

  // Convert position → value
  const positionToValue = (x: number) => {
    let percentage = Math.max(0, Math.min(x / sliderWidth, 1));
    let rawValue = min + percentage * (max - min);
    let stepped = Math.round(rawValue / step) * step;
    return Math.min(max, Math.max(min, stepped));
  };

  // PanResponder for drag
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: (pan.x as any)._value, y: 0 });
      },
      onPanResponderMove: (_, gesture) => {
        const newX = Math.max(
          0,
          Math.min(gesture.dx + (pan.x as any)._offset, sliderWidth),
        );
        pan.setValue({ x: newX, y: 0 });
        const newValue = positionToValue(newX);
        setValue(newValue);
        onValueChange?.(newValue);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      {/* Track */}
      <View
        style={[styles.track, { backgroundColor: trackColor }]}
        onLayout={handleLayout}
      >
        {/* Filled Track */}
        <Animated.View
          style={[
            styles.filled,
            {
              width: pan.x,
              backgroundColor: thumbColor,
            },
          ]}
        />
        {/* Thumb */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.thumb,
            {
              backgroundColor: thumbColor,
              transform: [{ translateX: pan.x }],
            },
          ]}
        />
      </View>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  filled: {
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
  },
  valueText: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CustomSliderTwo;
