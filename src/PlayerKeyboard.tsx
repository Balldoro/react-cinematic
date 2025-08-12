import { useKeyboard } from './useKeyboard';
import { usePlayerContext } from './usePlayerContext';

export default function PlayerKeyboard() {
  const { videoEl, parentEl } = usePlayerContext();
  useKeyboard({ videoEl, parentEl });

  return null;
}
