import { RefObject, useEffect, useState } from 'react';

interface UseFullscreenProps {
  element: RefObject<HTMLDivElement | null>;
}

export type UseFullscreen = ReturnType<typeof useFullscreen>;

export const useFullscreen = ({ element }: UseFullscreenProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal, abort } = controller;

    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);

    if (element.current) {
      element.current.addEventListener('fullscreenchange', handleFullscreenChange, { signal });
    }

    return abort.bind(controller);
  }, [element]);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      element.current?.requestFullscreen();
    }
    setIsFullscreen((isFullscreen) => !isFullscreen);
  };

  return { isFullscreen, toggleFullscreen };
};
