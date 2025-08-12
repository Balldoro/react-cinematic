import { createContext, ReactNode, RefObject, useContext } from 'react';
import { UsePlayer, usePlayer } from './usePlayer';
import { UseFullscreen, useFullscreen } from './useFullscreen';
import { UseVolume, useVolume } from './useVolume';
import { UseInfoBox, useInfoBox } from './useInfoBox';

interface PlayerState extends UsePlayer, UseFullscreen, UseVolume, UseInfoBox {
  videoEl: RefObject<HTMLVideoElement | null>;
  parentEl: RefObject<HTMLDivElement | null>;
}

const PlayerContext = createContext<PlayerState | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
  videoEl: RefObject<HTMLVideoElement | null>;
  parentEl: RefObject<HTMLDivElement | null>;
}

export const PlayerProvider = ({ children, videoEl, parentEl }: PlayerProviderProps) => {
  const player = usePlayer({ videoEl, parentEl });
  const fullscreen = useFullscreen({ element: parentEl });
  const volume = useVolume({ videoEl });
  const infoBox = useInfoBox();

  return (
    <PlayerContext.Provider value={{ ...player, ...fullscreen, ...volume, ...infoBox, videoEl, parentEl }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerContext');
  }

  return context;
};
