import { Button } from '../ui/Button';
import './RoomFooter.css';

interface RoomFooterProps {
  onTransfer: () => void;
  onFinish: () => void;
  canFinish: boolean;
  hasGuests: boolean;
  finishing: boolean;
}

export function RoomFooter({
  onTransfer,
  onFinish,
  canFinish,
  hasGuests,
  finishing,
}: RoomFooterProps) {
  return (
    <div className="room-footer">
      <div className="room-footer-actions">
        <Button
          onClick={onTransfer}
          variant="secondary"
          disabled={!hasGuests}
        >
          👑 Transferir Sala
        </Button>
        <Button
          onClick={onFinish}
          disabled={finishing || !canFinish}
          fullWidth
        >
          {finishing ? 'Finalizando...' : '🎲 Finalizar e Sortear Vencedor'}
        </Button>
      </div>
      {!canFinish && (
        <p className="finish-warning">
          Adicione pelo menos um filme antes de finalizar
        </p>
      )}
    </div>
  );
}