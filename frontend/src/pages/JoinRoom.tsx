import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { roomService } from '../services/roomService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import './JoinRoom.css';

export function JoinRoom() {
  const [roomCode, setRoomCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!roomCode.trim()) {
      setError('Digite o código da sala');
      return;
    }

    if (!displayName.trim()) {
      setError('Digite seu nome');
      return;
    }

    try {
      setLoading(true);
  
      const response = await roomService.joinRoom(
       roomCode.trim().toUpperCase(),
       displayName.trim()
      );

      console.log('✅ Resposta:', response);

      const { token, room, user } = response.data;

      // Salvar autenticação
      login(token, room.code, user.role);

      navigate(`/room/${room.code}`);
    } catch (err: any) {
      console.error('❌ Erro:', err);
      setError(err.response?.data?.error || 'Erro ao entrar na sala');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="join-room-container">
      <Card className="join-room-card">
        <h1 className="join-room-title">Entrar em Sala</h1>
        <p className="join-room-description">
          Digite o código da sala e seu nome para participar
        </p>

        <form onSubmit={handleSubmit} className="join-room-form">
          <Input
            label="Código da sala"
            type="text"
            placeholder="Ex: AB3D5"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={5}
            disabled={loading}
            autoFocus
          />

          <Input
            label="Seu nome"
            type="text"
            placeholder="Ex: Maria"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={loading}
          />

          {error && <p className="join-room-error">{error}</p>}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar na Sala'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Voltar
          </Button>
        </form>
      </Card>
    </div>
  );
}