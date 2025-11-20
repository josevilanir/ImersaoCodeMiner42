import { Button } from '../ui/Button';
import './RoomHeader.css';

interface RoomHeaderProps {
  isFinished: boolean;
  roomCode: string;
  copied: boolean;
  onCopyCode: () => void;
  onLeave: () => void;
}

export function RoomHeader({
  isFinished,
  roomCode,
  copied,
  onCopyCode,
  onLeave,
}: RoomHeaderProps) {
  return (
    <div className="room-header">
      <div className="room-header-info">
        <h1 className="room-title">
          {isFinished ? '🏆 Sala Finalizada' : '🎬 Movie Night'}
        </h1>
        <div className="room-code">
          <span>Código:</span>
          <strong>{roomCode}</strong>
          <button
            onClick={onCopyCode}
            className="copy-button"
            title="Copiar código"
          >
            {copied ? '✓' : '📋'}
          </button>
          {copied && <span className="copied-feedback">Copiado!</span>}
        </div>
      </div>
      <Button onClick={onLeave} variant="danger">
        Sair
      </Button>
    </div>
  );
}