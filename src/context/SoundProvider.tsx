// context/SoundProvider.tsx
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
} from 'react';

import Sound from 'react-native-sound';

export type VolumeKeys =
  | 'bell'
  | 'birds'
  | 'fire'
  | 'flute'
  | 'frog'
  | 'ice_cracking'
  | 'ocean'
  | 'om'
  | 'owl'
  | 'rain'
  | 'thunder'
  | 'tibetan_bowls'
  | 'train'
  | 'wind_chimes'
  | 'wind';

export type Volumes = Record<VolumeKeys, number>;

interface SoundContextType {
  isPlaying: boolean;
  volumes: Volumes;
  setVolume: (key: VolumeKeys, value: number) => void;
  toggleSwitch: () => void;
  resetMixer: () => void;
  startTimer: (minutes: number) => void;
}
interface SoundProviderProps {
  children: ReactNode;
}
type SoundState = {
  [key: string]: {
    isPlaying: boolean;
    volume: number;
    instance?: Sound;
  };
};

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider = ({ children }: SoundProviderProps) => {
  const sounds = useRef<Record<VolumeKeys, Sound> | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumes, setVolumes] = useState<Volumes>({
    bell: 0,
    birds: 0,
    fire: 0,
    flute: 0,
    frog: 0,
    ice_cracking: 0,
    ocean: 0,
    om: 0,
    owl: 0,
    rain: 0,
    thunder: 0,
    tibetan_bowls: 0,
    train: 0,
    wind_chimes: 0,
    wind: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 🔊 Set volume for specific sound
  const setVolume = (key: VolumeKeys, value: number) => {
    setVolumes(prev => ({ ...prev, [key]: value }));
    if (sounds.current && sounds.current[key]) {
      sounds.current[key].setVolume(value);
    }
  };

  // ⏱️ Start timer
  const startTimer = (minutes: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      resetMixer();
    }, minutes * 60 * 1000);
  };

  // 🔄 Reset
  const resetMixer = () => {
    setVolumes(
      Object.keys(volumes).reduce(
        (acc, key) => ({ ...acc, [key]: 0 }),
        {} as Volumes,
      ),
    );
    if (sounds.current) {
      Object.values(sounds.current).forEach(s => {
        if (s instanceof Sound) {
          s.stop();
          s.setVolume(0);
        }
      });
    }
    setIsPlaying(false);
  };

  // ▶️/⏸️ Toggle Play/Pause
  const toggleSwitch = () => {
    if (isPlaying) {
      if (sounds.current) {
        Object.values(sounds.current).forEach(s => {
          if (s instanceof Sound) {
            s.pause();
          }
        });
      }
      setIsPlaying(false);
    } else {
      if (sounds.current) {
        Object.entries(sounds.current).forEach(([key, s]) => {
          if (s instanceof Sound) {
            s.setNumberOfLoops(-1);
            s.setVolume(volumes[key as VolumeKeys]);
            s.play();
          }
        });
      }
      setIsPlaying(true);
    }
  };

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
  if (!ctx) throw new Error('useSound must be used inside SoundProvider');
  return ctx;
};

// export const useSound = () => {
//   const ctx = useContext(SoundContext);
//   if (!ctx) throw new Error('useSound must be used within a SoundProvider');
//   return ctx;
// };

// import React, { createContext, useContext, useState } from 'react';
// import Sound from 'react-native-sound'; // or react-native-sound
// import { SliderData } from '../assets/sliderData/SliderData';

// type SoundState = {
//   [key: string]: {
//     isPlaying: boolean;
//     volume: number;
//     instance?: Sound;
//   };
// };

// interface SoundContextType {
//   sounds: SoundState;
//   toggleSound?: (id: string) => void;
//   setVolume: (id: string, value: number) => void;
//   resetMixer: () => void;
// }

// const SoundContext = createContext<SoundContextType | null>(null);

// export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
//   const [sounds, setSounds] = useState<SoundState>(
//     Object.fromEntries(
//       SliderData.map(item => [item.id, { isPlaying: false, volume: 1 }]),
//     ),
//   );

//   const toggleSound = async (id: string) => {
//     setSounds(prev => {
//       const current = prev[id];
//       return {
//         ...prev,
//         [id]: { ...current, isPlaying: !current.isPlaying },
//       };
//     });
//   };

//   const setVolume = (id: string, value: number) => {
//     setSounds(prev => ({
//       ...prev,
//       [id]: { ...prev[id], volume: value },
//     }));
//   };

//   const resetMixer = () => {
//     setSounds(
//       Object.fromEntries(
//         SliderData.map(item => [item.id, { isPlaying: false, volume: 0 }]),
//       ),
//     );
//   };

//   return (
//     <SoundContext.Provider
//       value={{ sounds, toggleSound, setVolume, resetMixer }}
//     >
//       {children}
//     </SoundContext.Provider>
//   );
// };

// export const useSound = () => useContext(SoundContext)!;

// SoundContext.tsx
// src/context/SoundProvider.tsx

// import React, {
//   createContext,
//   useContext,
//   useRef,
//   useState,
//   ReactNode,
// } from 'react';
// import Sound from 'react-native-sound';

// type SoundKeys = 'bell' | 'fire' | 'rain' | 'wind' | 'thunder' | 'frog';

// type SoundMap = Partial<Record<SoundKeys, Sound>>;

// interface SoundContextType {
//   isPlaying: boolean;
//   volumes: Record<SoundKeys, number>;
//   toggleAll: () => void;
//   setVolume: (key: SoundKeys, value: number) => void;
//   reset: () => void;
// }

// const SoundContext = createContext<SoundContextType | null>(null);

// export const SoundProvider = ({ children }: { children: ReactNode }) => {
//   const [isPlaying, setIsPlaying] = useState(false);

//   const [volumes, setVolumes] = useState<Record<SoundKeys, number>>({
//     bell: 0,
//     fire: 0,
//     rain: 0,
//     wind: 0,
//     thunder: 0,
//     frog: 0,
//   });

//   const sounds = useRef<SoundMap>({});

//   // Load sounds lazily
//   const loadSound = (key: SoundKeys, file: any) => {
//     if (!sounds.current[key]) {
//       sounds.current[key] = new Sound(file, Sound.MAIN_BUNDLE, error => {
//         if (error) {
//           console.log('Failed to load sound:', key, error);
//         }
//       });
//     }
//     return sounds.current[key]!;
//   };

//   // Play or pause all
//   const toggleAll = () => {
//     if (isPlaying) {
//       // Pause all
//       Object.values(sounds.current).forEach(s => s?.pause());
//       setIsPlaying(false);
//     } else {
//       // Play all (looped)
//       (Object.keys(volumes) as SoundKeys[]).forEach(key => {
//         const sound = loadSound(key, require(`../assets/sounds/${key}.mp3`));
//         sound.setNumberOfLoops(-1);
//         sound.setVolume(volumes[key]);
//         sound.play();
//       });
//       setIsPlaying(true);
//     }
//   };

//   // Change volume of a specific sound
//   const setVolume = (key: SoundKeys, value: number) => {
//     setVolumes(prev => ({ ...prev, [key]: value }));
//     const sound = sounds.current[key];
//     if (sound) {
//       sound.setVolume(value);
//     }
//   };

//   // Reset mixer
//   const reset = () => {
//     Object.values(sounds.current).forEach(s => {
//       s?.stop();
//       s?.setVolume(0);
//     });
//     setVolumes({
//       bell: 0,
//       fire: 0,
//       rain: 0,
//       wind: 0,
//       thunder: 0,
//       frog: 0,
//     });
//     setIsPlaying(false);
//   };

//   return (
//     <SoundContext.Provider
//       value={{ isPlaying, volumes, toggleAll, setVolume, reset }}
//     >
//       {children}
//     </SoundContext.Provider>
//   );
// };
