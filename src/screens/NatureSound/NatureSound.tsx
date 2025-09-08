import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';

const { width } = Dimensions.get('window');

// preload category so iOS allows playback in silent mode
Sound.setCategory('Playback');

const NatureMixer: React.FC = () => {
  // Store all sounds
  const sounds = useRef<Record<string, Sound | null>>({});

  // Individual volumes
  const [volumes, setVolumes] = useState({
    rain: 0,
    wind: 0,
    birds: 0,
    fire: 0,
    forest: 0,
    crickets: 0,
    ocean: 0,
    air: 0,
  });

  // Master volume
  const [masterVolume, setMasterVolume] = useState(1.0);

  // Play / Pause state
  const [isPlaying, setIsPlaying] = useState(false);

  // Load sounds once
  useEffect(() => {
    const loadSound = (key: string, file: string) => {
      sounds.current[key] = new Sound(file, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log(`❌ Error loading ${key}:`, error);
        } else {
          console.log(`✅ Loaded ${key}`);
        }
      });
    };

    loadSound('rain', 'rain.mp3');
    loadSound('wind', 'wind.mp3');
    loadSound('birds', 'birds.mp3');
    loadSound('crickets', 'crickets.mp3');
    loadSound('air', 'air.mp3');
    loadSound('forest', 'forest.mp3');
    loadSound('ocean', 'ocean.mp3');
    loadSound('fire', 'fire.mp3');

    return () => {
      Object.values(sounds.current).forEach(s => s?.release());
    };
  }, []);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      Object.values(sounds.current).forEach(s => s?.pause());
      setIsPlaying(false);
    } else {
      Object.entries(sounds.current).forEach(([key, s]) => {
        if (s) {
          s.setNumberOfLoops(-1); // loop forever
          s.setVolume(volumes[key as keyof typeof volumes] * masterVolume);
          s.play();
        }
      });
      setIsPlaying(true);
    }
  };

  // Change individual volume
  const handleVolumeChange = (key: keyof typeof volumes, value: number) => {
    setVolumes(prev => ({ ...prev, [key]: value }));
    sounds.current[key]?.setVolume(value * masterVolume);
  };

  // Change master volume
  const handleMasterVolumeChange = (value: number) => {
    setMasterVolume(value);
    Object.entries(sounds.current).forEach(([key, s]) => {
      s?.setVolume(volumes[key as keyof typeof volumes] * value);
    });
  };

  // Reset mixer
  const resetMixer = () => {
    setVolumes({
      rain: 0,
      wind: 0,
      birds: 0,
      fire: 0,
      forest: 0,
      crickets: 0,
      ocean: 0,
      air: 0,
    });
    setMasterVolume(1.0);
    Object.values(sounds.current).forEach(s => {
      s?.stop();
      s?.setVolume(0);
    });
    setIsPlaying(false);
  };

  const soundItems = [
    { key: 'rain', icon: '🌧️', label: 'Rain' },
    { key: 'wind', icon: '🌬️', label: 'Wind' },
    { key: 'birds', icon: '🐦', label: 'Birds' },
    { key: 'fire', icon: '🔥', label: 'Fire' },
    { key: 'crickets', icon: '🦗', label: 'Crickets' },
    { key: 'forest', icon: '🌲', label: 'Forest' },
    { key: 'ocean', icon: '🌊', label: 'Ocean' },
    { key: 'air', icon: '💨', label: 'Air' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌿 Nature Sound Mixer</Text>
        <Text style={styles.subtitle}>
          Create your perfect ambient soundscape
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.soundGrid}>
          {soundItems.map(item => (
            <View key={item.key} style={styles.soundCard}>
              <View style={styles.soundHeader}>
                <Text style={styles.soundIcon}>{item.icon}</Text>
                <Text style={styles.soundLabel}>{item.label}</Text>
                <Text style={styles.volumeText}>
                  {Math.round(volumes[item.key as keyof typeof volumes] * 100)}%
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={volumes[item.key as keyof typeof volumes]}
                onValueChange={val =>
                  handleVolumeChange(item.key as keyof typeof volumes, val)
                }
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#E0E0E0"
                // thumbStyle={styles.sliderThumb}
              />
            </View>
          ))}
        </View>

        <View style={styles.masterSection}>
          <View style={styles.masterHeader}>
            <Text style={styles.masterIcon}>🎚️</Text>
            <Text style={styles.masterLabel}>Master Volume</Text>
            <Text style={styles.masterValue}>
              {Math.round(masterVolume * 100)}%
            </Text>
          </View>
          <Slider
            style={styles.masterSlider}
            minimumValue={0}
            maximumValue={1}
            value={masterVolume}
            onValueChange={handleMasterVolumeChange}
            minimumTrackTintColor="#2196F3"
            maximumTrackTintColor="#E0E0E0"
            // thumbStyle={styles.masterSliderThumb}
          />
        </View>
      </ScrollView>

      <View style={styles.controlPanel}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.playButton,
            isPlaying && styles.pauseButton,
          ]}
          onPress={togglePlayPause}
        >
          <Text style={styles.controlButtonText}>
            {isPlaying ? '⏸️' : '▶️'}
          </Text>
          <Text style={styles.controlButtonLabel}>
            {isPlaying ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={resetMixer}
        >
          <Text style={styles.controlButtonText}>🔄</Text>
          <Text style={styles.controlButtonLabel}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NatureMixer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E3A59',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7B8794',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  soundGrid: {
    paddingVertical: 20,
  },
  soundCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  soundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  soundIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  soundLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    flex: 1,
  },
  volumeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
    minWidth: 40,
    textAlign: 'right',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#4CAF50',
    width: 20,
    height: 20,
  },
  masterSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  masterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  masterIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  masterLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3A59',
    flex: 1,
  },
  masterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    minWidth: 50,
    textAlign: 'right',
  },
  masterSlider: {
    width: '100%',
    height: 40,
  },
  masterSliderThumb: {
    backgroundColor: '#2196F3',
    width: 24,
    height: 24,
  },
  controlPanel: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 15,
  },
  controlButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  resetButton: {
    backgroundColor: '#F44336',
  },
  controlButtonText: {
    fontSize: 24,
    marginBottom: 4,
  },
  controlButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
