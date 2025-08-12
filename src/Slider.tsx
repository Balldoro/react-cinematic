import { KeyboardEvent, PointerEvent, useRef } from 'react';
import { getFullTimerLabel, getVideoDurationUnits } from './utils';
import { KEYBOARD_COMMAND } from './constants';

interface SliderProps {
  duration: number;
  currentTime: number;
  updateCurrentTime: (time: number) => void;
  togglePlay: () => void;
}

export default function Slider({ duration, currentTime, updateCurrentTime, togglePlay }: SliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (ev: PointerEvent<HTMLDivElement>) => {
    const controller = new AbortController();
    const { signal, abort } = controller;

    const setNewTime = (ev: globalThis.PointerEvent | PointerEvent) => {
      if (!sliderRef.current) return;

      const parentBox = sliderRef.current.getBoundingClientRect();
      const valueX = ev.clientX - parentBox.left;
      const percent = Math.min(Math.max(valueX / parentBox.width, 0), 1);
      const newTime = duration * percent;
      updateCurrentTime(newTime);
    };

    const handleUp = abort.bind(controller);
    const handleDrag = (e: Event) => e.preventDefault();

    setNewTime(ev);
    window.addEventListener('pointermove', setNewTime, { signal });
    window.addEventListener('dragstart', handleDrag, { signal });
    window.addEventListener('pointerup', handleUp, { signal });
  };

  const handleKeyDown = (ev: KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === KEYBOARD_COMMAND.PLAY_PAUSE) {
      togglePlay();
    }
  };

  return (
    <div
      ref={sliderRef}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      aria-valuetext={getFullTimerLabel(getVideoDurationUnits(currentTime))}
      aria-label="Duration slider"
      className="slider-container"
    >
      <div className="slider">
        <div className="slider-elapsed" style={{ width: `${(currentTime / duration) * 100}%` }} />
        <div className="slider-remaining" style={{ width: `${((duration - currentTime) / duration) * 100}%` }} />
      </div>
      <div className="slider-thumb" style={{ left: `${(currentTime / duration) * 100}%` }} />
    </div>
  );
}
