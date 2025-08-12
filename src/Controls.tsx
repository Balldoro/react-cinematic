import { ReactNode, useState } from 'react';
import { PauseIcon, PlayIcon, VolumeIcon, NoVolumeIcon, FullscreenIcon } from './icons';
import { VolumeSlider } from './VolumeSlider';
import { usePlayerContext } from './usePlayerContext';

interface ControlsProps {
  children: ReactNode;
}

export default function Controls({ children }: ControlsProps) {
  const {
    isPlaying,
    isFullscreen,
    volume,
    isMuted,
    controlsVisible,
    updateVolume,
    togglePlay,
    toggleMute,
    toggleFullscreen,
  } = usePlayerContext();
  const [isVolumeHover, setIsVolumeHover] = useState(false);
  const [isAdjustingVolume, setIsAdjustingVolume] = useState(false);

  return (
    <div className="controls" style={{ opacity: controlsVisible ? 1 : 0 }} aria-hidden={!controlsVisible}>
      <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} className="play-btn">
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
        {isVolumeHover && (
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
