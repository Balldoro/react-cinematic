import { ReactNode, useState } from 'react';
import { PauseIcon, PlayIcon, VolumeIcon, NoVolumeIcon, FullscreenIcon } from './icons';
import { VolumeSlider } from './VolumeSlider';

interface ControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
  children: ReactNode;
  togglePlayer: () => void;
  toggleFullscreen: () => void;
  toggleMute: () => void;
  updateVolume: (volume: number) => void;
}

export default function Controls({
  isPlaying,
  isFullscreen,
  volume,
  isMuted,
  togglePlayer,
  toggleFullscreen,
  children,
  toggleMute,
  updateVolume,
}: ControlsProps) {
  const [isVolumeHover, setIsVolumeHover] = useState(false);
  const [isAdjustingVolume, setIsAdjustingVolume] = useState(false);
  console.log(isAdjustingVolume, isVolumeHover);
  return (
    <div className="controls">
      <button onClick={togglePlayer} aria-label={isPlaying ? 'Pause' : 'Play'} className="play-btn">
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div
        className="volume-container"
        onFocus={() => setIsVolumeHover(true)}
        onBlur={() => setIsVolumeHover(false)}
        onMouseEnter={() => setIsVolumeHover(true)}
        onMouseLeave={() => {
          if (isAdjustingVolume) return;
          setIsVolumeHover(false);
        }}
      >
        <button onClick={toggleMute}>{isMuted ? <NoVolumeIcon /> : <VolumeIcon />}</button>
        {true && (
          <VolumeSlider
            volume={volume}
            isMuted={isMuted}
            setIsVolumeHover={setIsVolumeHover}
            setIsAdjustingVolume={setIsAdjustingVolume}
            updateVolume={updateVolume}
          />
        )}
      </div>
      {children}
      <button
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Open fullscreen'}
        className="fulscreen-btn"
      >
        <FullscreenIcon />
      </button>
    </div>
  );
}
