import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Image,
  Switch,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useSoundMixer } from '../context/CSoundProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LogoVertical from '../../src/assets/icons/logo-vertical.svg';
import CustomSlider from '../components/Slider';
import { SliderData } from '../constants/SliderData';
import Video from 'react-native-video';

const RestAraApp = () => {
  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasTimerStarted, setHasTimerStarted] = useState(false);
  const [masterEnabled, setMasterEnabled] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sound mixer context
  const {
    volumes,
    isPlaying,
    soundItems,
    getIconForSound,
    setVolume,
    togglePlayAll,
    resetMixer,
    isLoading,
  } = useSoundMixer();

  // Timer countdown effect
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerRunning]);

  // Timer completion effect
  useEffect(() => {
    if (timeLeft === 0 && hasTimerStarted) {
      setIsTimerRunning(false);
      setMasterEnabled(false); // Turn off sounds when timer ends
      resetMixer(); // Reset all volumes to 0
      Vibration.vibrate(1000);
    }
  }, [timeLeft, hasTimerStarted]);

  // Master toggle effect - controls all sounds
  useEffect(() => {
    if (masterEnabled) {
      // If any sounds have volume > 0, start playing them
      if (Object.values(volumes).some(vol => vol > 0)) {
        togglePlayAll();
      }
    } else {
      // Stop all sounds when master is disabled
      if (isPlaying) {
        togglePlayAll();
      }
    }
  }, [masterEnabled]);

  // Format time as HH : MM : SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hrs: String(hrs).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0'),
    };
  };

  const setTimer = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsTimerRunning(true);
    setHasTimerStarted(true);
    setMasterEnabled(true); // Auto-enable sounds when timer starts
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(0);
    setHasTimerStarted(false);
    setMasterEnabled(false);
    // resetMixer(); // Reset all sound volumes to 0
  };

  const handleVolumeChange = (soundId: string, volume: number) => {
    setVolume(soundId, volume);

    // Auto-enable master toggle if any volume is set and master is off
    if (volume > 0 && !masterEnabled) {
      setMasterEnabled(true);
    }
  };

  const handleResetAll = () => {
    resetMixer();
    setMasterEnabled(false);
  };

  const { hrs, mins, secs } = formatTime(timeLeft);

  if (isLoading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading sounds...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/videos/background_animation_1.mp4')} // your video url
        style={StyleSheet.absoluteFill} // makes it cover the whole screen
        resizeMode="cover"
        repeat
        muted
      />
      <SafeAreaProvider style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>{<LogoVertical />}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.toggleLabel}>ON</Text>
            <Switch
              value={masterEnabled}
              onValueChange={setMasterEnabled}
              trackColor={{ false: '#767577', true: '#ff6b6b' }}
              thumbColor={masterEnabled ? '#ffffff' : '#f4f3f4'}
              style={styles.masterToggle}
            />
          </View>
        </View>

        {/* Timer Section */}
        <View style={styles.timerBox}>
          {!hasTimerStarted ? (
            <View style={styles.countdownRow}>
              <Text style={styles.label}>Set Timer</Text>
              <View style={styles.optionsRow}>
                {[1, 30, 60, 90, 120].map(min => (
                  <TouchableOpacity
                    key={min}
                    style={styles.circleButton}
                    onPress={() => setTimer(min)}
                  >
                    <Text style={styles.circleText}>{min}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.countdownRow}>
              <Text style={styles.label}>Countdown</Text>
              <View style={styles.timeDisplay}>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeText}>{hrs}</Text>
                  <Text style={styles.subText}>Hours</Text>
                </View>
                <Text style={styles.colon}>:</Text>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeText}>{mins}</Text>
                  <Text style={styles.subText}>Minutes</Text>
                </View>
                <Text style={styles.colon}>:</Text>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeText}>{secs}</Text>
                  <Text style={styles.subText}>Seconds</Text>
                </View>
              </View>
              {/* Controls */}
              <View style={styles.controls}>
                <TouchableOpacity
                  disabled={timeLeft === 0} // disable when timer ends
                  onPress={() => setIsTimerRunning(prev => !prev)} // toggle pause/resume
                >
                  <Text style={styles.controlText}>
                    {isTimerRunning ? 'Pause' : 'Resume'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={resetTimer}>
                  <Text style={styles.controlText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Sound Controls */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.soundsContainer}>
            {soundItems.map(item => (
              <View key={item.key} style={styles.soundItem}>
                <View style={styles.soundHeader}>
                  <Text style={styles.soundLabel}>{item.label}</Text>
                </View>
                <View style={styles.sliderContainer}>
                  <CustomSlider
                    label={item.label}
                    value={volumes[item.key]}
                    onValueChange={value => handleVolumeChange(item.key, value)}
                  />
                  <View style={styles.iconContainer}>
                    <Image
                      source={getIconForSound(item.key)}
                      style={styles.soundIcon}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetAll}>
          <Text style={styles.resetButtonText}>RESET</Text>
        </TouchableOpacity>
      </SafeAreaProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'purple',
    // alignItems: 'center',
  },

  scrollContainer: {
    width: '100%',
    // paddingHorizontal: 5,
    // paddingVertical: 10,
  },
  iconContainer: {
    // position: 'absolute',
    width: '10%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },

  header: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },

  headerLeft: {
    flex: 1,
  },

  logo: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  toggleLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginRight: 10,
    fontWeight: '500',
  },

  masterToggle: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },

  timerBox: {
    width: '95%',
    backgroundColor: '#5D4A99',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },

  optionsRow: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  circleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#5D4A99',
  },

  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 20,
  },

  timeBlock: {
    alignItems: 'center',
    minWidth: 60,
  },

  timeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  subText: {
    color: '#ddd',
    fontSize: 12,
    marginTop: 2,
  },

  colon: {
    color: '#fff',
    fontSize: 24,
    marginHorizontal: 8,
  },

  controls: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },

  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  controlText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },

  soundsContainer: {
    gap: 15,
    marginBottom: 30,
  },

  soundItem: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },

  soundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  soundIcon: {
    flexDirection: 'row',
    width: 30,
    height: 30,
    marginRight: 10,
  },

  soundLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },

  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 5,
  },

  slider: {
    width: '100%',
    height: 40,
  },

  sliderThumb: {
    backgroundColor: '#8B7CB6',
    width: 20,
    height: 20,
  },

  sliderTrack: {
    height: 4,
    borderRadius: 2,
  },

  resetButton: {
    backgroundColor: '#6C5B99',
    paddingVertical: 5,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    width: '20%',
    alignSelf: 'center',
    // elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  resetButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default RestAraApp;
