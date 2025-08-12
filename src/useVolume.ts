import { RefObject, useState } from 'react';

interface UseVolumeProps {
  videoEl: RefObject<HTMLVideoElement | null>;
}

export type UseVolume = ReturnType<typeof useVolume>;

export const useVolume = ({ videoEl }: UseVolumeProps) => {
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    videoEl.current!.muted = !videoEl.current!.muted;
    setIsMuted((isMuted) => !isMuted);
  };

  const updateVolume = (value: number) => {
    if (videoEl.current) {
      const newVolume = value > 0 ? +Math.min(volume + value, 1).toFixed(2) : +Math.max(volume + value, 0).toFixed(2);

      videoEl.current.muted = false;
      videoEl.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(false);
    }
  };

  return { volume, isMuted, updateVolume, toggleMute };
};
