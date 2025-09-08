// // context/SoundProvider.tsx
// import React, {
//   createContext,
//   useContext,
//   useRef,
//   useState,
//   ReactNode,
// } from 'react';
// import { Animated } from 'react-native';

// type VolumeKeys =
//   | 'bell'
//   | 'birds'
//   | 'fire'
//   | 'flute'
//   | 'frog'
//   | 'ice_cracking'
//   | 'ocean'
//   | 'om'
//   | 'owl'
//   | 'rain'
//   | 'thunder'
//   | 'tibetan_bowls'
//   | 'train'
//   | 'wind_chimes'
//   | 'wind';

// type Volumes = Record<VolumeKeys, number>;

// interface SoundContextType {
//   isPlaying: boolean;
//   volumes: Volumes;
//   setVolume: (key: VolumeKeys, value: number) => void;
//   toggleSwitch: () => void;
//   resetMixer: () => void;
//   startTimer: (minutes: number) => void;
// }

// const SoundContext = createContext<SoundContextType | null>(null);

// interface SoundProviderProps {
//   children: ReactNode;
// }

// export const SoundProvider = ({ children }: SoundProviderProps) => {
//   const sounds = useRef<Record<string, any>>({}); // load your sound objects here
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [volumes, setVolumes] = useState<Volumes>({
//     bell: 0,
//     birds: 0,
//     fire: 0,
//     flute: 0,
//     frog: 0,
//     ice_cracking: 0,
//     ocean: 0,
//     om: 0,
//     owl: 0,
//     rain: 0,
//     thunder: 0,
//     tibetan_bowls: 0,
//     train: 0,
//     wind_chimes: 0,
//     wind: 0,
//   });

//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // 🔊 Set volume for specific sound
//   const setVolume = (key: VolumeKeys, value: number) => {
//     setVolumes(prev => ({ ...prev, [key]: value }));
//     if (sounds.current[key]) {
//       sounds.current[key].setVolume(value);
//     }
//   };

//   // ⏱️ Start timer
//   const startTimer = (minutes: number) => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//     timerRef.current = setTimeout(() => {
//       resetMixer();
//     }, minutes * 60 * 1000);
//   };

//   // 🔄 Reset
//   const resetMixer = () => {
//     setVolumes(
//       Object.keys(volumes).reduce(
//         (acc, key) => ({ ...acc, [key]: 0 }),
//         {} as Volumes,
//       ),
//     );
//     Object.values(sounds.current).forEach(s => {
//       s?.stop();
//       s?.setVolume(0);
//     });
//     setIsPlaying(false);
//   };

//   // ▶️/⏸️ Toggle Play/Pause
//   const toggleSwitch = () => {
//     if (isPlaying) {
//       Object.values(sounds.current).forEach(s => s?.pause());
//       setIsPlaying(false);
//     } else {
//       Object.entries(sounds.current).forEach(([key, s]) => {
//         if (s) {
//           s.setNumberOfLoops(-1);
//           s.setVolume(volumes[key as VolumeKeys]);
//           s.play();
//         }
//       });
//       setIsPlaying(true);
//     }
//   };

// return (
//   <SoundContext.Provider
//     value={{
//       isPlaying,
//       volumes,
//       setVolume,
//       toggleSwitch,
//       resetMixer,
//       startTimer,
//     }}
//   >
//     {children}
//   </SoundContext.Provider>
// );
// };

// export const useSound = () => {
//   const ctx = useContext(SoundContext);
//   if (!ctx) throw new Error('useSound must be used within a SoundProvider');
//   return ctx;
// };

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Sound from 'react-native-sound';
import { SliderData } from '../constants/SliderData'; // Adjust the import path
// Types
interface SoundContextType {
  volumes: Record<string, number>;
  isPlaying: boolean;
  soundItems: Array<{
    key: string;
    icon: any;
    label: string;
  }>;
  setVolume: (soundId: string, volume: number) => void;
  playSound: (soundId: string) => void;
  stopSound: (soundId: string) => void;
  togglePlayAll: () => void;
  resetMixer: () => void;
  isLoading: boolean;
}

interface SoundProviderProps {
  children: ReactNode;
}

const SoundContext = createContext<SoundContextType | null>(null);
export const SoundProvider = ({ children }: SoundProviderProps) => {
  const sounds = useRef<Record<string, Sound | null>>({});
  const [isPlaying, setIsPlaying] = useState(false);

  const initialVolumes = Object.fromEntries(
    SliderData.map(item => [item.id, 0]),
  );

  const [volumes, setVolumes] = useState(initialVolumes);

  useEffect(() => {
    const loadSound = (key: string, soundFile: any) => {
      sounds.current[key] = new Sound(soundFile, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log(`❌ Error loading ${key}:`, error);
        } else {
          console.log(`✅ Loaded ${key}`);
        }
      });
    };

    // Load all sounds from SliderData
    SliderData.forEach(item => {
      loadSound(item.id, item.sound);
    });

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
          s.setVolume(volumes[key as keyof typeof volumes]);
          s.play();
        }
      });
      setIsPlaying(true);
    }
  };

  // Change individual volume
  const handleVolumeChange = (key: keyof typeof volumes, value: number) => {
    setVolumes(prev => ({ ...prev, [key]: value }));
  };

  // Reset mixer
  // At the top of your component/file
  const INITIAL_VOLUMES = Object.fromEntries(
    SliderData.map(item => [item.id, 0]),
  );

  const resetMixer = () => {
    setVolumes(INITIAL_VOLUMES);

    Object.values(sounds.current).forEach(s => {
      s?.stop();
      s?.setVolume(0);
    });
    setIsPlaying(false);
  };

  // Map SliderData to the format you need
  const soundItems = SliderData.map(item => ({
    key: item.id,
    icon: item.png, // or item.gif for animated version
    label: item.label,
  }));
  return (
    <SoundContext.Provider
      value={{
        isPlaying,
        volumes,
        setVolume,
        toggleSwitch,
        resetMixer,
        startTimer,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
export const useSound = () => {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within a SoundProvider');
  return ctx;
};
