import React, { ReactNode, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface SliderProps {
  data?: object;
  style?: object;
  label?: string;
  icon?: string | ReactNode;
  value?: number;
  onValueChange: (value: number) => void;
  song?: string;
}

const CustomSlider = ({
  data,
  style,
  label,
  icon,
  value,
  onValueChange,
  song,
}: SliderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
        {song && <Text style={styles.song}>{song}</Text>}
      </View>
      <View
        style={{
          width: '100%',
          height: 20,
          borderRadius: 6,
          backgroundColor: '#ddd',
        }}
      >
        <Slider
          style={{ width: '100%', height: 20 }}
          onValueChange={onValueChange}
          value={value}
          minimumValue={0}
          maximumValue={15}
          minimumTrackTintColor={'#123456'}
          maximumTrackTintColor={'#654321'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    color: '#333',
  },
  song: {
    fontSize: 14,
    color: '#666',
  },
  slider: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});

export default CustomSlider;
