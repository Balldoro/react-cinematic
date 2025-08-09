import { useCallback, useEffect, useRef, useState } from 'react';
import Controls from './Controls';
import Overlay from './Overlay';
import Duration from './Duration';
import { KEYBOARD_COMMAND, SKIP_VALUE } from './constants';
import { InfoBox } from './InfoBox';

interface PlayerProps {
  src: string;
}

export default function Player({ src }: PlayerProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [infoBox, setInfoBox] = useState<{ type: 'volume' | null; from: number } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal, abort } = controller;

    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    const handleTimeUpdate = () => setCurrentTime(videoRef.current?.currentTime || 0);
    const handleLoadedMetadata = () => setDuration(videoRef.current?.duration || 0);

    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { signal });
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate, { signal });
    }
    if (videoContainerRef.current) {
      videoContainerRef.current.addEventListener('fullscreenchange', handleFullscreenChange, { signal });
    }

    return abort.bind(controller);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      document.exitFullscreen();
      if (videoRef.current) {
        videoRef.current.playbackRate = 1;
      }
    } else {
      if (videoRef.current) {
        videoRef.current.playbackRate = 4;
      }
      videoContainerRef.current?.requestFullscreen();
    }
    setIsFullscreen((isFullscreen) => !isFullscreen);
  }, [isFullscreen]);

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
          case KEYBOARD_COMMAND.FULLSCREEN:
            toggleFullscreen();
            break;
          case KEYBOARD_COMMAND.MUTE:
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted((isMuted) => !isMuted);
            setInfoBox({ type: 'volume', from: !isMuted ? volume : 0 });
            break;
          case KEYBOARD_COMMAND.VOLUME_UP:
            videoRef.current.muted = false;
            setVolume((volume) => +Math.min(volume + 0.1, 1).toFixed(2));
            setIsMuted(false);
            setInfoBox({
              type: 'volume',
              from: volume,
            });
            break;
          case KEYBOARD_COMMAND.VOLUME_DOWN:
            videoRef.current.muted = false;
            setVolume((volume) => +Math.max(volume - 0.1, 0).toFixed(2));
            setIsMuted(false);
            setInfoBox({
              type: 'volume',
              from: volume,
            });
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
  }, [toggleFullscreen, volume, isMuted]);

  // useEffect(() => {
  //   if (infoBox) {
  //     const timeout = setTimeout(() => {
  //       setInfoBox(null);
  //     }, 1000);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [infoBox]);

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

  const toggleMute = () => {
    videoRef.current!.muted = !videoRef.current!.muted;
    setIsMuted((isMuted) => !isMuted);
  };

  const updateVolume = (volume: number) => {
    if (videoRef.current) {
      setVolume(volume);
      videoRef.current.volume = volume;
    }
  };

  return (
    <div className="video-container" ref={videoContainerRef} tabIndex={0}>
      <video src={src} ref={videoRef} />
      {videoRef.current !== null && (
        <>
          <Overlay onClick={togglePlayerWithFocus} />
          <Controls
            isPlaying={isPlaying}
            togglePlayer={togglePlayer}
            toggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
            volume={volume}
            isMuted={isMuted}
            toggleMute={toggleMute}
            updateVolume={updateVolume}
          >
            <Duration duration={duration} currentTime={currentTime} updateCurrentTime={updateCurrentTime} />
          </Controls>
        </>
      )}
      {infoBox && (
        <InfoBox type={infoBox.type} from={infoBox.from} to={volume} updateVolume={updateVolume} isMuted={isMuted} />
      )}
    </div>
  );
}
