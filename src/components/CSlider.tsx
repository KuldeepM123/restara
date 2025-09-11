// import React, { useState, useRef } from 'react';
// import {
//   View,
//   PanGestureHandler,
//   Animated,
//   Dimensions,
//   Text,
//   StyleSheet,
// } from 'react-native';

// const { width: screenWidth } = Dimensions.get('window');

// const CustomSlider = ({
//   min = 0,
//   max = 100,
//   step = 1,
//   initialValue = 50,
//   onValueChange = () => {},
//   trackColor = '#e0e0e0',
//   activeTrackColor = '#2196F3',
//   thumbColor = '#2196F3',
//   trackHeight = 4,
//   thumbSize = 20,
//   width = screenWidth - 40,
//   showValue = true,
//   disabled = false,
// }) => {
//   const [value, setValue] = useState(initialValue);
//   const [isDragging, setIsDragging] = useState(false);

//   const translateX = useRef(new Animated.Value(
//     ((initialValue - min) / (max - min)) * width
//   )).current;

//   const panRef = useRef();

//   const updateValue = (gestureX) => {
//     const clampedX = Math.max(0, Math.min(gestureX, width));
//     const percentage = clampedX / width;
//     let newValue = min + percentage * (max - min);

//     // Apply step
//     if (step > 0) {
//       newValue = Math.round(newValue / step) * step;
//     }

//     // Clamp value
//     newValue = Math.max(min, Math.min(max, newValue));

//     setValue(newValue);
//     onValueChange(newValue);

//     // Update animation
//     const newX = ((newValue - min) / (max - min)) * width;
//     translateX.setValue(newX);
//   };

//   const onGestureEvent = Animated.event(
//     [{ nativeEvent: { translationX: translateX } }],
//     {
//       useNativeDriver: false,
//       listener: (event) => {
//         if (!disabled) {
//           const gestureX = event.nativeEvent.translationX;
//           updateValue(gestureX);
//         }
//       },
//     }
//   );

//   const onHandlerStateChange = (event) => {
//     if (disabled) return;

//     const { state, translationX } = event.nativeEvent;

//     if (state === 4) { // BEGAN
//       setIsDragging(true);
//     } else if (state === 5) { // END
//       setIsDragging(false);
//       updateValue(translationX);

//       // Reset translation for next gesture
//       translateX.setOffset(translateX._value);
//       translateX.setValue(0);
//     }
//   };

//   const thumbAnimatedStyle = {
//     transform: [
//       {
//         translateX: translateX,
//       },
//       {
//         scale: isDragging ? 1.2 : 1,
//       },
//     ],
//   };

//   const activeTrackWidth = translateX.interpolate({
//     inputRange: [0, width],
//     outputRange: [0, width],
//     extrapolate: 'clamp',
//   });

//   return (
//     <View style={styles.container}>
//       {showValue && (
//         <Text style={styles.valueText}>{Math.round(value)}</Text>
//       )}

//       <View style={[styles.sliderContainer, { width }]}>
//         {/* Background Track */}
//         <View
//           style={[
//             styles.track,
//             {
//               backgroundColor: trackColor,
//               height: trackHeight,
//               width,
//             },
//           ]}
//         />

//         {/* Active Track */}
//         <Animated.View
//           style={[
//             styles.activeTrack,
//             {
//               backgroundColor: activeTrackColor,
//               height: trackHeight,
//               width: activeTrackWidth,
//             },
//           ]}
//         />

//         {/* Thumb */}
//         <PanGestureHandler
//           ref={panRef}
//           onGestureEvent={onGestureEvent}
//           onHandlerStateChange={onHandlerStateChange}
//           enabled={!disabled}
//         >
//           <Animated.View
//             style={[
//               styles.thumb,
//               {
//                 backgroundColor: disabled ? '#ccc' : thumbColor,
//                 width: thumbSize,
//                 height: thumbSize,
//                 borderRadius: thumbSize / 2,
//                 marginLeft: -thumbSize / 2,
//               },
//               thumbAnimatedStyle,
//             ]}
//           />
//         </PanGestureHandler>
//       </View>
//     </View>
//   );
// };

// // Example usage component
// const SliderExample = () => {
//   const [sliderValue, setSliderValue] = useState(25);
//   const [colorValue, setColorValue] = useState(128);

//   return (
//     <View style={styles.exampleContainer}>
//       <Text style={styles.title}>Custom Slider Examples</Text>

//       {/* Basic Slider */}
//       <View style={styles.sliderGroup}>
//         <Text style={styles.label}>Basic Slider</Text>
//         <CustomSlider
//           min={0}
//           max={100}
//           initialValue={sliderValue}
//           onValueChange={setSliderValue}
//         />
//       </View>

//       {/* Color Picker Slider */}
//       <View style={styles.sliderGroup}>
//         <Text style={styles.label}>Color Picker (RGB)</Text>
//         <CustomSlider
//           min={0}
//           max={255}
//           initialValue={colorValue}
//           onValueChange={setColorValue}
//           activeTrackColor={`rgb(${colorValue}, 0, 0)`}
//           thumbColor={`rgb(${colorValue}, 0, 0)`}
//           showValue={true}
//         />
//       </View>

//       {/* Custom Styled Slider */}
//       <View style={styles.sliderGroup}>
//         <Text style={styles.label}>Custom Style</Text>
//         <CustomSlider
//           min={0}
//           max={10}
//           step={0.5}
//           initialValue={5}
//           trackColor="#f0f0f0"
//           activeTrackColor="#4CAF50"
//           thumbColor="#4CAF50"
//           trackHeight={8}
//           thumbSize={24}
//           showValue={true}
//         />
//       </View>

//       {/* Disabled Slider */}
//       <View style={styles.sliderGroup}>
//         <Text style={styles.label}>Disabled Slider</Text>
//         <CustomSlider
//           min={0}
//           max={100}
//           initialValue={60}
//           disabled={true}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   valueText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   sliderContainer: {
//     height: 40,
//     justifyContent: 'center',
//     position: 'relative',
//   },
//   track: {
//     position: 'absolute',
//     borderRadius: 2,
//   },
//   activeTrack: {
//     position: 'absolute',
//     borderRadius: 2,
//   },
//   thumb: {
//     position: 'absolute',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   exampleContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 30,
//     color: '#333',
//   },
//   sliderGroup: {
//     marginBottom: 30,
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 15,
//     color: '#555',
//   },
// });

// export default SliderExample;

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  PanResponder,
  Animated,
  Dimensions,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface CustomSliderProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  onValueChange?: (value: number) => void;
  trackColor?: string;
  activeTrackColor?: string;
  thumbColor?: string;
  trackHeight?: number;
  thumbSize?: number;
  width?: number;
  showValue?: boolean;
  disabled?: boolean;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  initialValue = 50,
  onValueChange = (_value: number) => {},
  trackColor = '#e0e0e0',
  activeTrackColor = '#2196F3',
  thumbColor = '#2196F3',
  trackHeight = 4,
  thumbSize = 20,
  width = screenWidth - 40,
  showValue = true,
  disabled = false,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);

  const sliderWidth = width - thumbSize;
  const thumbPosition = useRef(
    new Animated.Value(((initialValue - min) / (max - min)) * sliderWidth),
  ).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const updateValue = useCallback(
    (position: number) => {
      const clampedPosition = Math.max(0, Math.min(position, sliderWidth));
      const percentage = clampedPosition / sliderWidth;
      let newValue = min + percentage * (max - min);

      if (step > 0) {
        newValue = Math.round(newValue / step) * step;
      }

      newValue = Math.max(min, Math.min(max, newValue));

      setValue(newValue);
      onValueChange(newValue);

      const newPosition = ((newValue - min) / (max - min)) * sliderWidth;
      Animated.spring(thumbPosition, {
        toValue: newPosition,
        useNativeDriver: false,
        tension: 150,
        friction: 8,
      }).start();
    },
    [min, max, step, sliderWidth, thumbPosition, onValueChange],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,

      onPanResponderGrant: () => {
        if (disabled) return;
        setIsDragging(true);

        Animated.spring(scaleValue, {
          toValue: 1.3,
          useNativeDriver: true,
          tension: 150,
          friction: 3,
        }).start();

        const currentPos = ((value - min) / (max - min)) * sliderWidth;
        thumbPosition.setOffset(currentPos);
        thumbPosition.setValue(0);
      },

      onPanResponderMove: (_evt, gestureState) => {
        if (disabled) return;

        const newPosition = (thumbPosition as any)._offset + gestureState.dx;
        thumbPosition.setValue(gestureState.dx);

        const clampedPosition = Math.max(0, Math.min(newPosition, sliderWidth));
        const percentage = clampedPosition / sliderWidth;
        let newValue = min + percentage * (max - min);

        if (step > 0) {
          newValue = Math.round(newValue / step) * step;
        }

        newValue = Math.max(min, Math.min(max, newValue));
        setValue(newValue);
        onValueChange(newValue);
      },

      onPanResponderRelease: (_evt, gestureState) => {
        if (disabled) return;

        setIsDragging(false);

        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 3,
        }).start();

        const finalPosition = (thumbPosition as any)._offset + gestureState.dx;
        thumbPosition.flattenOffset();
        updateValue(finalPosition);
      },

      onPanResponderTerminate: () => {
        if (disabled) return;
        setIsDragging(false);
        thumbPosition.flattenOffset();

        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const handleTrackPress = (evt: GestureResponderEvent) => {
    if (disabled) return;
    const { locationX } = evt.nativeEvent;
    const adjustedX = locationX - thumbSize / 2;
    updateValue(adjustedX);
  };

  const activeTrackWidth = thumbPosition.interpolate({
    inputRange: [0, sliderWidth],
    outputRange: [0, sliderWidth],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {showValue && (
        <Text style={[styles.valueText, disabled && styles.disabledText]}>
          {step >= 1 ? Math.round(value) : value.toFixed(1)}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleTrackPress}
        activeOpacity={1}
        disabled={disabled}
        style={[styles.sliderContainer, { width }]}
      >
        {/* Track */}
        <View
          style={[
            styles.track,
            {
              backgroundColor: trackColor,
              height: trackHeight,
              width: sliderWidth,
              marginHorizontal: thumbSize / 2,
            },
          ]}
        />

        {/* Active Track */}
        <Animated.View
          style={[
            styles.activeTrack,
            {
              backgroundColor: disabled ? '#ccc' : activeTrackColor,
              height: trackHeight,
              width: activeTrackWidth,
              marginLeft: thumbSize / 2,
            },
          ]}
        />

        {/* Thumb */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.thumb,
            {
              backgroundColor: disabled ? '#ccc' : thumbColor,
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              transform: [{ translateX: thumbPosition }, { scale: scaleValue }],
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  disabledText: {
    color: '#999',
  },
  sliderContainer: {
    height: 50,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    position: 'absolute',
    borderRadius: 2,
  },
  activeTrack: {
    position: 'absolute',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbInner: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  rangeContainer: {
    width: '100%',
  },
  rangeValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rangeValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  exampleContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },
  sliderGroup: {
    marginBottom: 25,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#34495e',
  },
  colorPreview: {
    height: 30,
    marginTop: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default CustomSlider;
