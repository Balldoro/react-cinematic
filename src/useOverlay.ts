import { useEffect } from 'react';
import { usePlayerContext } from './usePlayerContext';

export const useOverlay = () => {
  const { isPlaying, parentEl, toggleFullscreen, showControls, delayedHideControls, togglePlayWithFocus } =
    usePlayerContext();

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const handlePointerMove = () => {
      if (isPlaying) {
        showControls();
        delayedHideControls();
      }
    };

    if (parentEl.current) {
      parentEl.current.addEventListener('dblclick', toggleFullscreen, { signal });
      parentEl.current.addEventListener('pointermove', handlePointerMove, { signal });
    }

    return () => {
      abortController.abort();
    };
  }, [parentEl, isPlaying, showControls, delayedHideControls, toggleFullscreen]);

  return { togglePlayWithFocus };
};
