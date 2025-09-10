import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import Sound from 'react-native-sound';
import { SliderData } from '../constants/SliderData'; // Adjust import path as needed

// Types
interface SoundMixerContextType {
  volumes: Record<string, number>;
  isPlaying: boolean;
  soundItems: Array<{
    key: string;
    icon: any;
    label: string;
  }>;
  getIconForSound: (soundId: string) => any;
  setVolume: (soundId: string, volume: number) => void;
  playSound: (soundId: string) => void;
  stopSound: (soundId: string) => void;
  togglePlayAll: () => void;
  resetMixer: () => void;
  isLoading: boolean;
}

interface SoundMixerProviderProps {
  children: ReactNode;
}

// Create the context
const SoundMixerContext = createContext<SoundMixerContextType | undefined>(
  undefined,
);

// Icon mapping for emojis (optional - you can also add icons directly to SliderData)
// const iconMap: Record<string, string> = {
//   bell: '🔔',
//   bird: '🐦',
//   fire: '🔥',
//   flute: '🎵',
//   frog: '🐸',
//   ice_cracking: '🧊',
//   ocean: '🌊',
//   om: '🕉️',
//   owl: '🦉',
//   rain: '🌧️',
//   thunder: '⛈️',
//   tibetan_bowls: '🔔',
//   train: '🚂',
//   wind_chimes: '🎐',
//   wind: '🌬️',
// };

// Initial volumes - all sounds start at 0
const INITIAL_VOLUMES = Object.fromEntries(
  SliderData.map(item => [item.id, 0]),
);

// Provider component
export const SoundMixerProvider: React.FC<SoundMixerProviderProps> = ({
  children,
}) => {
  const sounds = useRef<Record<string, Sound | null>>({});
  const [volumes, setVolumes] =
    useState<Record<string, number>>(INITIAL_VOLUMES);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingStates, setPlayingStates] = useState<Record<string, boolean>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);

  // Create sound items from SliderData
  const soundItems = SliderData.map(item => ({
    key: item.id,
    icon: item.png || '🎵', // Use emoji, png, or fallback
    png: item.png,
    gif: item.gif,
    label: item.label,
    sounds: item.sound,
  }));

  // Load sounds on mount
  useEffect(() => {
    Sound.setCategory('Playback');

    const soundFiles = [
      'bell.mp3',
      'bird.mp3',
      'fire.mp3',
      'flute.mp3',
      'frog.mp3',
      'ice_cracking.mp3',
      'ocean.mp3',
      'om.mp3',
      'owl.mp3',
      'rain.mp3',
      'thunder.mp3',
      'tibetan_bowls.mp3',
      'train.mp3',
      'wind_chimes.mp3',
      'wind.mp3',
    ];

    soundFiles.forEach(file => {
      const id = file.replace('.mp3', '').replace('_', '_');
      const sound = new Sound(file, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log(`Error loading ${id}:`, error);
        } else {
          console.log(`${id} loaded successfully`);
          sounds.current[id] = sound;
        }
      });
    });

    setIsLoading(false);
  }, []);

  // Set volume for a specific sound
  const setVolume = (soundId: string, volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    console.log(`Setting volume for ${soundId}: ${clampedVolume}`);

    setVolumes(prev => ({
      ...prev,
      [soundId]: clampedVolume,
    }));

    const sound = sounds.current[soundId];
    console.log(`Sound object for ${soundId}:`, sound);

    if (sound) {
      sound.setVolume(clampedVolume);

      if (clampedVolume > 0) {
        console.log(`Playing ${soundId}`);
        sound.setNumberOfLoops(-1);
        sound.play(success => {
          console.log(`Play result for ${soundId}:`, success);
          if (success) {
            setPlayingStates(prev => ({ ...prev, [soundId]: true }));
          }
        });
        setIsPlaying(true);
      } else {
        console.log(`Stopping ${soundId}`);
        sound.stop();
        setPlayingStates(prev => ({ ...prev, [soundId]: false }));
      }
    } else {
      console.log(`No sound object found for ${soundId}`);
    }
  };

  // getIconForSound
  // const getIconForSound = (soundId: string) => {
  //   const soundItem = soundItems.find(item => item.key === soundId);
  //   return isPlaying ? soundItem?.gif : soundItem?.png;
  // return soundItem?.
  // icon || '🎵'; // Default to '🎵' if not found
  // };

  // getIconForSound - Fixed version
  const getIconForSound = (soundId: string) => {
    const soundItem = soundItems.find(item => item.key === soundId);
    const isCurrentlyPlaying = volumes[soundId] > 0;
    return isCurrentlyPlaying ? soundItem?.gif : soundItem?.png;
  };

  // Play a specific sound
  const playSound = (soundId: string) => {
    const sound = sounds.current[soundId];
    if (sound && volumes[soundId] > 0) {
      sound.setNumberOfLoops(-1); // Loop indefinitely
      sound.play();
      setIsPlaying(true);
    }
  };

  // Stop a specific sound
  const stopSound = (soundId: string) => {
    const sound = sounds.current[soundId];
    if (sound) {
      sound.stop();
    }
  };

  // Toggle play/pause all sounds
  const togglePlayAll = () => {
    if (isPlaying) {
      // Stop all sounds
      Object.values(sounds.current).forEach(sound => {
        if (sound) {
          sound.stop();
        }
      });
      setIsPlaying(false);
      setPlayingStates({});
    } else {
      // Play all sounds that have volume > 0
      const newPlayingStates: Record<string, boolean> = {};
      Object.entries(sounds.current).forEach(([key, sound]) => {
        if (sound && volumes[key] > 0) {
          sound.setNumberOfLoops(-1);
          sound.play(success => {
            if (success) {
              newPlayingStates[key] = true;
            }
          });
        }
      });
      setPlayingStates(newPlayingStates);
      setIsPlaying(true);
    }
  };

  // Reset all volumes and stop all sounds
  const resetMixer = () => {
    setVolumes(INITIAL_VOLUMES);

    Object.values(sounds.current).forEach(sound => {
      if (sound) {
        sound.stop();
        sound.setVolume(0);
      }
    });

    setIsPlaying(false);
    setPlayingStates({});
  };

  const contextValue: SoundMixerContextType = {
    volumes,
    isPlaying,
    soundItems,
    setVolume,
    getIconForSound,
    playSound,
    stopSound,
    togglePlayAll,
    resetMixer,
    isLoading,
  };

  return (
    <SoundMixerContext.Provider value={contextValue}>
      {children}
    </SoundMixerContext.Provider>
  );
};

// Custom hook to use the context
export const useSoundMixer = (): SoundMixerContextType => {
  const context = useContext(SoundMixerContext);
  if (context === undefined) {
    throw new Error('useSoundMixer must be used within a SoundMixerProvider');
  }
  return context;
};

// Export the context for advanced usage
export { SoundMixerContext };
