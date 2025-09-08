import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import LogoVertical from '../../assets/icons/logo-vertical.svg';
import CustomToggleSwitch from '../../components/ToggleSwitch';
import CountdownTimer from '../../components/CountDown';
import CustomSlider from '../../components/Slider';
import { useSoundMixer } from '../../context/CSoundProvider';
import { SliderData } from '../../constants/SliderData';

const { width, height } = Dimensions.get('window');
export interface SliderComponentProps {
  label: string;
  icon: string;
  value: number;
  sound?: string;
  onValueChange: (value: number) => void;
}

export interface SliderValues {
  bell: number;
  fire: number;
  rain: number;
  wind: number;
  frog: number;
  thunder: number;
}
const SoundMixerScreen = () => {
  // const { sounds, toggleSound, resetMixer, setVolume } = useSound();
  const { isPlaying, volumes, togglePlayAll, resetMixer, setVolume } =
    useSoundMixer();

  // const [sliderValues, setSliderValues] = useState({
  //   bell: 0,
  //   fire: 0,
  //   rain: 0,
  //   wind: 0,
  //   frog: 0,
  //   thunder: 0,
  // });

  // const updateSliderValue = (key: keyof Volumes, value: number): void => {
  //   setSliderValues(prev => ({
  //     ...prev,
  //     [key]: value,
  //   }));
  // };
  interface CustomToggleSwitchProps {
    onPress: () => void;
  }

  // const CustomToggleSwitch: React.FC<CustomToggleSwitchProps> = ({
  //   onPress,
  // }) => {
  //   return (
  //     <TouchableOpacity onPress={onPress} style={styles.switchContainer}>
  //       {/* highlight / text / animation */}
  //     </TouchableOpacity>
  //   );
  // };

  return (
    <LinearGradient
      colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
      style={styles.container}
    >
      <View style={styles.header}>
        <LogoVertical />
        <CustomToggleSwitch value={true} onPress={togglePlayAll} />
      </View>
      <View style={styles.timerContainer}>
        <CountdownTimer />
      </View>

      <View style={styles.sliderContainer}>
        <FlatList
          data={SliderData}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
          // renderItem={({ item }) => (
          //   <CustomSlider
          //     label={item.label}
          //     icon={
          //       <Image
          //         source={isPlaying ? item.gif : item.png}
          //         style={{ width: 30, height: 30 }}
          //       />
          //     }
          //     value={volumes[item.id as keyof Volumes]}
          //     onValueChange={value =>
          //       setVolume(item.id as keyof Volumes, value)
          //     }
          //   />
          // )}
          renderItem={({ item }) => {
            return (
              <CustomSlider
                label={item.label}
                value={volumes[item.id] || 0}
                onValueChange={value => setVolume(item.id, value)}
                icon={
                  <Image
                    source={isPlaying ? item.gif : item.png}
                    style={{ width: 20, height: 20 }}
                  />
                }
              />
            );
          }}
        />
      </View>

      {/* <View style={styles.resetButtonContainer}> */}
      <TouchableOpacity style={styles.resetButton} onPress={resetMixer}>
        <Text style={styles.resetButtonText}>RESET</Text>
      </TouchableOpacity>
      {/* </View> */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: '#635E94',
  },
  switchContainer: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  timerContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  timerLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
  },
  timerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 4,
  },
  timerButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  timerButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  timerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  timerButtonTextActive: {
    color: '#7C3AED',
  },
  slidersContainer: {
    flex: 1,
    marginBottom: 30,
  },
  sliderContainer: {
    marginBottom: 25,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  sliderIcon: {
    fontSize: 20,
  },
  sliderWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  slider: {
    width: '100%',
    height: 30,
  },
  sliderThumb: {
    backgroundColor: '#7C3AED',
    width: 20,
    height: 20,
  },
  resetButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    position: 'absolute',
    zIndex: 99,
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default SoundMixerScreen;
