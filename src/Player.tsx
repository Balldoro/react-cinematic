import { useRef } from 'react';
import Controls from './Controls';
import Overlay from './Overlay';
import Duration from './Duration';
import { PlayerProvider } from './usePlayerContext';
import PlayerKeyboard from './PlayerKeyboard';
import { InfoBox } from './InfoBox';

interface PlayerProps {
  src: string;
}

export default function Player({ src }: PlayerProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <PlayerProvider videoEl={videoRef} parentEl={videoContainerRef}>
      <div className="video-container" ref={videoContainerRef} tabIndex={0}>
        <video src={src} ref={videoRef} />
        <PlayerKeyboard />
        <Overlay />
        <Controls>
          <Duration />
        </Controls>
        <InfoBox />
      </div>
    </PlayerProvider>
  );
}
