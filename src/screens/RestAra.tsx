import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSoundMixer } from '../context/CSoundProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LogoVertical from '../../src/assets/icons/logo-vertical.svg';
import CustomSlider from '../components/Slider';
import Video from 'react-native-video';
import CustomToggleSwitch from '../components/ToggleSwitch';

const { width } = Dimensions.get('screen');
const scale = width / 375;

const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const RestAraApp = () => {
  // Timer state
  // const [videoPlaying, setVideoPlaying] = useState(false);
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

  // useEffect(() => {
  //   const hasActiveSounds = Object.values(volumes).some(vol => vol > 0);
  //   const shouldPlay = masterEnabled && hasActiveSounds;
  //   setVideoPlaying(shouldPlay);
  // }, [masterEnabled, volumes]);

  // useEffect(() => {
  //   setVideoPlaying(isPlaying);
  // }, [isPlaying]);

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
  }, [isTimerRunning, timeLeft]);

  // Timer completion effect
  useEffect(() => {
    if (timeLeft === 0 && hasTimerStarted) {
      setIsTimerRunning(false);
      setMasterEnabled(false); // Turn off sounds when timer ends
      resetMixer(); // Reset all volumes to 0
      Vibration.vibrate(1000);
    }
  }, [timeLeft, hasTimerStarted]);

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
  };

  //resetSlider
  const resetSlider = useCallback(() => {
    resetMixer(); // context reset
    soundItems.forEach(item => setVolume(item.key, 0)); // slider reset
  }, [soundItems, setVolume, resetMixer]);

  const handleVolumeChange = useCallback(
    debounce((soundId: string, volume: number) => {
      setVolume(soundId, volume);
      if (volume > 0) {
        setMasterEnabled(true);
      }
    }, 100),
    [setVolume, setMasterEnabled],
  );

  const handleMasterToggle = (newValue: any) => {
    setMasterEnabled(newValue);
    if (!newValue) {
      resetMixer(); // Reset all volumes to 0 when turning off master
      if (isPlaying) {
        togglePlayAll(); // Stop all sounds when turning off master
      }
    }
  };
  const handleResetAll = () => {
    resetMixer();
    resetTimer();
    resetSlider();
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
      <StatusBar backgroundColor={'#5D4A99'} barStyle={'light-content'} />
      {/* <Video
        source={require('../assets/videos/background_animation_1.mp4')} // your video url
        style={StyleSheet.absoluteFill} // makes it cover the whole screen
        resizeMode="cover"
        muted
        paused={!isPlaying}
      /> */}
      {/* // Add these props to your Video component: */}
      <Video
        source={require('../assets/videos/background_animation_1.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        muted
        repeat={true} // Loop the video
        paused={!isPlaying}
        onError={error => console.log('Video Error:')}
        onLoad={() => console.log('Video loaded successfully')}
        onBuffer={buffer => console.log('Video buffering:')}
        playInBackground={false}
        playWhenInactive={false}
      />
      <SafeAreaProvider style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>{<LogoVertical />}</Text>
          </View>
          <View style={styles.headerRight}>
            <CustomToggleSwitch
              value={masterEnabled}
              onToggle={handleMasterToggle}
            />
          </View>
        </View>

        {/* Timer Section */}
        <View style={styles.timerBox}>
          {!hasTimerStarted ? (
            <View style={styles.countdownRow}>
              <Text style={styles.label}>Set Timer</Text>
              <View style={styles.optionsRow}>
                {[30, 60, 90, 120].map(min => (
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
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.soundsContainer}>
            {soundItems.map(item => (
              <View key={item.key} style={styles.soundItem}>
                <View style={styles.soundHeader}>
                  <Text style={styles.soundLabel}>{item.label}</Text>
                </View>
                <View style={styles.soundContainer}>
                  <View style={styles.sliderContainer}>
                    <CustomSlider
                      value={volumes[item.key]}
                      onValueChange={volume =>
                        handleVolumeChange(item.key, volume)
                      }
                    />
                  </View>
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
        <View style={styles.resetContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetAll}>
            <Text style={styles.resetButtonText}>RESET</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContainer: {
    marginTop: 10,
    alignSelf: 'center',
    width: '90%',
  },
  iconContainer: {
    borderLeftColor: 'grey',
    borderLeftWidth: 2,
    paddingLeft: 8,
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
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 20,
  },

  label: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12 * scale,
    textAlign: 'center',
  },

  headerLeft: {
    flex: 1,
  },

  logo: {
    color: '#ffffff',
    fontSize: 18 * scale,
    fontWeight: 'bold',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  toggleLabel: {
    color: '#ffffff',
    fontSize: 12 * scale,
    marginRight: 10,
    fontWeight: '500',
  },

  masterToggle: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  timerBox: {
    backgroundColor: '#635E94',
    width: '90%',
    padding: 15,
    alignSelf: 'center',
    borderColor: '#D3D3D3',
    borderWidth: 2,
    borderRadius: 9,
    marginBottom: 20,
    overflow: 'hidden',
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: '#5D4A99',
    // maxWidth: 350,
  },
  countdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    // width: '100%',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // ✅ buttons will wrap instead of overflowing
    justifyContent: 'center',
    // marginTop: 10,
  },

  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },

  circleText: {
    fontWeight: 'bold',
    fontSize: 40 * 0.35,
    color: '#5D4A99',
    includeFontPadding: false,
  },

  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 20,
  },

  timeBlock: {
    alignItems: 'center',
    // backgroundColor: 'red',
    paddingHorizontal: 10,
    // justifyContent: 'space-between',
    // minWidth: 60,
  },

  timeText: {
    fontFamily: 'Poppin-Regular',
    color: '#fff',
    fontSize: 20 * scale,
    fontWeight: 'bold',
  },

  subText: {
    color: '#ddd',
    fontSize: 7 * scale,
    marginTop: 2,
  },

  colon: {
    color: '#fff',
    fontSize: 20 * scale,
    fontWeight: 'bold',
    top: -6,
    // marginHorizontal: 8,
  },

  controls: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },

  controlButton: {
    // paddingHorizontal: 20,
    // paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  controlText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 10 * scale,
  },

  soundsContainer: {
    gap: 35,
    marginBottom: 20,
  },

  soundItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },

  soundHeader: {
    position: 'absolute',
    paddingHorizontal: 10,
    marginHorizontal: 12,
    top: -8,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
  },

  soundIcon: {
    // flexDirection: 'row',
    width: 40,
    height: 40,
  },

  soundLabel: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#635E94',
    borderRadius: 4,
    borderColor: '#ddd',
    fontSize: 12 * scale,
    fontWeight: '600',
    color: 'white',
  },
  soundContainer: {
    flexDirection: 'row',

    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // backgroundColor: 'red',
    // width: '100%',
  },

  sliderContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
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
  resetContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // paddingVertical: 10,
  },
  resetButton: {
    paddingVertical: 8,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    width: '20%',
    alignSelf: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 3,
    // backgroundColor: '#6C5B99',
  },

  resetButtonText: {
    backgroundColor: '#635E94',
    fontFamily: 'Poppin-Regular',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    borderRadius: 25,
    color: '#ffffff',
    fontSize: 10 * scale,
    fontWeight: 'bold',
    letterSpacing: 1,
    alignSelf: 'center',
    alignContent: 'center',
    textAlign: 'center',
    // marginBottom: 10,
    marginTop: 10,
  },
});

export default RestAraApp;
