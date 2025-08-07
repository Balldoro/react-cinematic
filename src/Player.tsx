import { useEffect, useRef, useState } from 'react';
import Controls from './Controls';
import Overlay from './Overlay';
import Duration from './Duration';
import { KEYBOARD_COMMAND, SKIP_VALUE } from './constants';

interface PlayerProps {
  src: string;
}

export default function Player({ src }: PlayerProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal, abort } = controller;

    const handleTimeUpdate = () => setCurrentTime(videoRef.current?.currentTime || 0);
    const handleLoadedMetadata = () => setDuration(videoRef.current?.duration || 0);

    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { signal });
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate, { signal });
    }

    return abort.bind(controller);
  }, []);

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (videoRef.current && videoContainerRef.current?.contains(document.activeElement)) {
        switch (ev.key) {
          case KEYBOARD_COMMAND.SKIP_FORWARD:
            videoRef.current.currentTime += SKIP_VALUE;
            break;
          case KEYBOARD_COMMAND.SKIP_BACKWARD:
            videoRef.current.currentTime -= SKIP_VALUE;
            break;
          case KEYBOARD_COMMAND.JUMP_TO_START:
            videoRef.current.currentTime = 0;
            break;
          case KEYBOARD_COMMAND.JUMP_TO_END:
            videoRef.current.currentTime = videoRef.current.duration;
            break;
        }
      }

      if (videoContainerRef.current === document.activeElement) {
        switch (ev.key) {
          case KEYBOARD_COMMAND.PLAY_PAUSE:
            if (videoRef.current?.paused) {
              handlePlay();
            } else {
              handlePause();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePlay = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlayerWithFocus = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
    videoContainerRef.current?.focus();
  };

  const togglePlayer = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const updateCurrentTime = (time: number) => {
    if (videoRef.current) {
      setCurrentTime(time);
      videoRef.current.currentTime = time;
    }
  };

  return (
    <div className="video-container" ref={videoContainerRef} tabIndex={0}>
      <video src={src} ref={videoRef} />
      {videoRef.current !== null && (
        <>
          <Overlay onClick={togglePlayerWithFocus} />
          <Controls isPlaying={isPlaying} togglePlayer={togglePlayer}>
            <Duration duration={duration} currentTime={currentTime} updateCurrentTime={updateCurrentTime} />
          </Controls>
        </>
      )}
    </div>
  );
}
