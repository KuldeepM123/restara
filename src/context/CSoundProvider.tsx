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
  const [loadedSounds, setLoadedSounds] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingStates, setPlayingStates] = useState<Record<string, boolean>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);

  // Create sound items from SliderData
  const soundItems = SliderData.map(item => ({
    key: item.id,
    icon: isPlaying ? item.gif : item.png, // Use emoji, png, or fallback
    png: item.png,
    gif: item.gif,
    label: item.label,
    sounds: item.sound,
  }));

  useEffect(() => {
    Sound.setCategory('Playback');
    let loadedCount = 0;
    const totalSound = SliderData.length;

    SliderData.forEach(item => {
      const sound = new Sound(item.sound, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log(`Error loading ${item.id}:`, error);
        } else {
          console.log(`${item.id} loaded successfully`);
          sounds.current[item.id] = sound;
          setLoadedSounds(prev => ({ ...prev, [item.id]: true }));
        }
        loadedCount++;
        if (loadedCount === totalSound) {
          setIsLoading(false);
        }
      });
    });
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
    const isSoundLoaded = loadedSounds[soundId];

    if (sound && isSoundLoaded) {
      if (clampedVolume > 0) {
        sound.setVolume(clampedVolume);
        sound.setNumberOfLoops(-1);
        console.log(`Playing ${soundId}`);
        sound.play(success => {
          console.log(`Play result for ${soundId}:`, success);
          if (success) {
            setPlayingStates(prev => ({ ...prev, [soundId]: true }));
            setIsPlaying(true);
          }
        });
      } else {
        console.log(`Stopping ${soundId}`);
        sound.stop();
        sound.setVolume(0);
        setPlayingStates(prev => ({ ...prev, [soundId]: false }));
        // Check if any other sound are still playing
        const updatedVolume = { ...volumes, [soundId]: clampedVolume };
        const stillPlaying = Object.entries(updatedVolume).some(
          ([key, vol]) => vol > 0,
        );
        if (!stillPlaying) {
          setIsPlaying(false);
        }
      }
    }
  };

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
