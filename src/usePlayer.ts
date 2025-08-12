import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { CONTROLS_HIDE_DELAY, SKIP_VALUE } from './constants';

interface UsePlayerProps {
  videoEl: RefObject<HTMLVideoElement | null>;
  parentEl: RefObject<HTMLDivElement | null>;
}

export type UsePlayer = ReturnType<typeof usePlayer>;

export const usePlayer = ({ videoEl, parentEl }: UsePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  // eslint-disable-next-line no-undef
  const controlsVisibleRef = useRef<NodeJS.Timeout | null>(null);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (isPlaying) {
      delayedHideControls();
    }
  }, [isPlaying]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal, abort } = controller;

    const handleTimeUpdate = () => setCurrentTime(videoEl.current?.currentTime || 0);
    const handleLoadedMetadata = () => setDuration(videoEl.current?.duration || 0);

    if (videoEl.current) {
      videoEl.current.addEventListener('loadedmetadata', handleLoadedMetadata, { signal });
      videoEl.current.addEventListener('timeupdate', handleTimeUpdate, { signal });
    }

    return abort.bind(controller);
  }, [videoEl]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal, abort } = controller;

    if (parentEl.current) {
      const handleFocus = () => {
        if (parentEl.current?.contains(document.activeElement)) {
          showControls();
        }
      };

      document.addEventListener('focusin', handleFocus, { signal });
    }

    return abort.bind(controller);
  }, [parentEl, showControls]);

  const jumpToEnd = () => (videoEl.current!.currentTime = videoEl.current!.duration);
  const jumpToStart = () => (videoEl.current!.currentTime = 0);
  const skipForward = () => (videoEl.current!.currentTime += SKIP_VALUE);
  const skipBackward = () => (videoEl.current!.currentTime -= SKIP_VALUE);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      videoEl.current!.pause();
      setControlsVisible(true);
      if (controlsVisibleRef.current) {
        clearTimeout(controlsVisibleRef.current);
      }
    } else {
      setIsPlaying(true);
      videoEl.current!.play();
      if (controlsVisibleRef.current) {
        clearTimeout(controlsVisibleRef.current);
      }
      controlsVisibleRef.current = setTimeout(() => setControlsVisible(false), CONTROLS_HIDE_DELAY);
    }
  };

  const delayedHideControls = () => {
    if (controlsVisibleRef.current) {
      clearTimeout(controlsVisibleRef.current);
    }
    controlsVisibleRef.current = setTimeout(() => setControlsVisible(false), CONTROLS_HIDE_DELAY);
  };

  const togglePlayWithFocus = () => {
    togglePlay();
    videoEl.current?.focus();
  };

  const changeCurrentTime = (time: number) => {
    if (videoEl.current) {
      setCurrentTime(time);
      videoEl.current.currentTime = time;
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    controlsVisible,
    showControls,
    delayedHideControls,
    jumpToStart,
    jumpToEnd,
    skipForward,
    skipBackward,
    togglePlay,
    togglePlayWithFocus,
    changeCurrentTime,
  };
};
