import { PointerEvent, useRef } from 'react';

interface VolumeSliderProps {
  volume: number;
  isMuted: boolean;
  updateVolume: (volume: number) => void;
  setIsVolumeHover: (isVolumeHover: boolean) => void;
  setIsAdjustingVolume: (isAdjustingVolume: boolean) => void;
}

export function VolumeSlider({
  volume,
  updateVolume,
  setIsAdjustingVolume,
  setIsVolumeHover,
  isMuted,
}: VolumeSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (ev: PointerEvent<HTMLDivElement>) => {
    const controller = new AbortController();
    const { signal, abort } = controller;

    const setNewTime = (ev: globalThis.PointerEvent | PointerEvent) => {
      if (!sliderRef.current) return;

      const parentBox = sliderRef.current.getBoundingClientRect();
      const valueY = ev.clientY - parentBox.top;
      const percent = Math.min(Math.max(valueY / parentBox.height, 0), 1);
      const newVolume = 1 - percent - volume;

      updateVolume(newVolume);
      setIsAdjustingVolume(true);
    };
    const handleUp = () => {
      abort.call(controller);
      setIsAdjustingVolume(false);
      setTimeout(() => {
        setIsVolumeHover(false);
      }, 1000);
    };
    const handleDrag = (e: Event) => e.preventDefault();

    const handleMove = (ev: globalThis.PointerEvent) => {
      setNewTime(ev);
    };

    setNewTime(ev);
    window.addEventListener('pointermove', handleMove, { signal });
    window.addEventListener('dragstart', handleDrag, { signal });
    window.addEventListener('pointerup', handleUp, { signal });
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      tabIndex={0}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={volume}
      aria-valuetext={`Volume set to${volume * 100}%`}
      aria-label="Volume slider"
      className="volume-slider-container"
    >
      <div className="volume-slider-bg">
        <div className="volume-slider" ref={sliderRef}>
          <div className="volume-slider-fill" style={{ height: `${isMuted ? 0 : volume * 100}%` }} />
          <div className="volume-slider-thumb" style={{ bottom: `${Math.max(isMuted ? 0 : volume * 100 - 1, 0)}%` }} />
        </div>
      </div>
    </div>
  );
}
