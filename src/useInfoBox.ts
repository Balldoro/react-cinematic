import { useEffect, useState } from 'react';

interface InfoBox {
  type: 'volume';
  from: number;
  to: number;
}

export type UseInfoBox = ReturnType<typeof useInfoBox>;

export const useInfoBox = () => {
  const [infoBox, setInfoBox] = useState<InfoBox | null>(null);

  useEffect(() => {
    if (infoBox) {
      const timeout = setTimeout(() => {
        setInfoBox(null);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [infoBox]);

  return { infoBox, setInfoBox };
};
