interface OverlayProps {
  onClick: () => void;
}

export default function Overlay({ onClick }: OverlayProps) {
  return <div className="overlay" onClick={onClick} />;
}
