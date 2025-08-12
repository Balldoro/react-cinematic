import { useOverlay } from './useOverlay';

export default function Overlay() {
  const { togglePlayWithFocus } = useOverlay();
  return <div className="overlay" onClick={togglePlayWithFocus} />;
}
