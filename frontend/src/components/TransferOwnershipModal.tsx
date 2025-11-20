import { useState } from 'react';
import { Button } from './ui/Button';
import type { RoomUser } from '../@types';
import './TransferOwnershipModal.css';

interface TransferOwnershipModalProps {
  guests: RoomUser[];
  onTransfer: (newHostId: string) => void;
  onClose: () => void;
  isTransferring: boolean;
}

export function TransferOwnershipModal({
  guests,
  onTransfer,
  onClose,
  isTransferring,
}: TransferOwnershipModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  function handleSubmit() {
    if (!selectedUserId) {
      alert('Selecione um participante para transferir a sala');
      return;
    }
    onTransfer(selectedUserId);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👑 Transferir Sala</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Selecione um participante para se tornar o novo host da sala.
            Você perderá os privilégios de host.
          </p>

          {guests.length === 0 ? (
            <p className="no-guests">
              Não há outros participantes na sala para transferir a ownership.
            </p>
          ) : (
            <div className="guests-list">
              {guests.map((guest) => (
                <label key={guest.id} className="guest-item">
                  <input
                    type="radio"
                    name="newHost"
                    value={guest.id}
                    checked={selectedUserId === guest.id}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    disabled={isTransferring}
                  />
                  <span className="guest-name">{guest.displayName}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={isTransferring}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isTransferring || !selectedUserId || guests.length === 0}
          >
            {isTransferring ? 'Transferindo...' : 'Transferir'}
          </Button>
        </div>
      </div>
    </div>
  );
}