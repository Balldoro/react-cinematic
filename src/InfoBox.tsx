import { CSSProperties, useEffect, useState } from 'react';
import { VolumeUpIcon } from './icons';
import { usePlayerContext } from './usePlayerContext';

export function InfoBox() {
  const { infoBox } = usePlayerContext();
  const [value, setValue] = useState(infoBox?.from);
  const [delayedIsMuted, setDelayedIsMuted] = useState<boolean | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue(infoBox?.to);
      // updateVolume(to);
      // setDelayedIsMuted(isMuted);
    }, 0);
    return () => clearTimeout(timeout);
  }, [infoBox?.to]);

  if (!infoBox || value == undefined) return null;

  const getContent = () => {
    const filledCircles = Math.round(delayedIsMuted ? 0 : value * 10);
    switch (infoBox?.type) {
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
              Volume: <span className="volume-percentage-value">{delayedIsMuted ? 0 : (value * 100).toFixed(0)}%</span>
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
