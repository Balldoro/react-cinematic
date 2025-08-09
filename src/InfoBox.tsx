import { CSSProperties, useEffect, useState } from 'react';
import { VolumeUpIcon } from './icons';

interface InfoBoxProps {
  type: 'volume' | null;
  from: number;
  to: number;
  isMuted: boolean;
  updateVolume: (volume: number) => void;
}

export function InfoBox({ type, from, to, updateVolume, isMuted }: InfoBoxProps) {
  const [value, setValue] = useState(from);
  const [delayedIsMuted, setDelayedIsMuted] = useState<boolean | null>(null);
  console.log(delayedIsMuted);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue(to);
      updateVolume(to);
      setDelayedIsMuted(isMuted);
    }, 0);
    return () => clearTimeout(timeout);
  }, [to, updateVolume, isMuted]);

  const getContent = () => {
    const filledCircles = Math.round(delayedIsMuted ? 0 : value * 10);
    switch (type) {
      case 'volume':
        return (
          <>
            <div
              className="info-box-icon"
              data-filled-circles={filledCircles}
              style={
                {
                  '--position': value,
                  '--rotation': `${getVolumeRotation(delayedIsMuted ? 0 : value)}deg`,
                } as CSSProperties
              }
            >
              <VolumeUpIcon />
            </div>
            <span className="volume-percentage">
              Volume:
              <span className="volume-percentage-value">{delayedIsMuted ? 0 : (value * 100).toFixed(0)}%</span>
            </span>
          </>
        );
      default:
        return null;
    }
  };

  return <div className="info-box">{getContent()}</div>;
}

const getVolumeRotation = (value: number) => 32.5 * (value * 10);
