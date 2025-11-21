import { Card } from '../ui/Card';
import type { RoomUser } from '../../@types';
import './ParticipantsList.css';

interface ParticipantsListProps {
  users: RoomUser[];
  currentUserId: string | undefined;
}

export function ParticipantsList({ users, currentUserId }: ParticipantsListProps) {
  return (
    <Card className="users-card">
      <h2>Participantes ({users?.length || 0})</h2>
      <ul className="users-list">
        {users?.map((user) => (
          <li key={user.id} className="user-item">
            <span className="user-info">
              {user.id === currentUserId && (
                <span className="user-indicator" title="Você">●</span>
              )}
              <span className="user-name">
                {user.displayName}
                {user.role === 'HOST' && ' 👑'}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}