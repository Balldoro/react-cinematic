import { RefObject, useEffect } from 'react';
import { KEYBOARD_COMMAND, VOLUME_STEP } from './constants';
import { usePlayerContext } from './usePlayerContext';

interface UseKeyboardProps {
  parentEl: RefObject<HTMLDivElement | null>;
  videoEl: RefObject<HTMLVideoElement | null>;
}

export const useKeyboard = ({ videoEl, parentEl }: UseKeyboardProps) => {
  const {
    volume,
    isMuted,
    setInfoBox,
    togglePlay,
    skipBackward,
    skipForward,
    jumpToEnd,
    jumpToStart,
    toggleFullscreen,
    toggleMute,
    updateVolume,
    showControls,
  } = usePlayerContext();

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      const withControlsShow = (cb: () => void) => {
        cb();
        showControls();
      };

      if (videoEl.current && parentEl.current?.contains(document.activeElement)) {
        switch (ev.key) {
          case KEYBOARD_COMMAND.SKIP_FORWARD:
            withControlsShow(skipForward);
            break;
          case KEYBOARD_COMMAND.SKIP_BACKWARD:
            withControlsShow(skipBackward);
            break;
          case KEYBOARD_COMMAND.JUMP_TO_START:
            withControlsShow(jumpToStart);
            break;
          case KEYBOARD_COMMAND.JUMP_TO_END:
            withControlsShow(jumpToEnd);
            break;
          case KEYBOARD_COMMAND.FULLSCREEN:
            toggleFullscreen();
            break;
          case KEYBOARD_COMMAND.MUTE:
            toggleMute();
            setInfoBox({ type: 'volume', from: !isMuted ? volume : 0, to: !isMuted ? volume : 0 });
            break;
          case KEYBOARD_COMMAND.VOLUME_UP:
            updateVolume(VOLUME_STEP);
            setInfoBox({
              type: 'volume',
              from: volume,
              to: Math.min(volume + VOLUME_STEP, 1),
            });
            break;
          case KEYBOARD_COMMAND.VOLUME_DOWN:
            updateVolume(-VOLUME_STEP);
            setInfoBox({
              type: 'volume',
              from: volume,
              to: Math.max(volume - VOLUME_STEP, 0),
            });
            break;
        }
      }

      if (parentEl.current === document.activeElement) {
        switch (ev.key) {
          case KEYBOARD_COMMAND.PLAY_PAUSE:
            togglePlay();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    volume,
    isMuted,
    setInfoBox,
    togglePlay,
    skipBackward,
    skipForward,
    jumpToEnd,
    jumpToStart,
    parentEl,
    videoEl,
    toggleFullscreen,
    toggleMute,
    updateVolume,
    showControls,
  ]);
};
