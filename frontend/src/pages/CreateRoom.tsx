import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { roomService } from '../services/roomService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import './CreateRoom.css';

export function CreateRoom() {
  const [hostName, setHostName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!hostName.trim()) {
      setError('Digite seu nome');
      return;
    }

    try {
      setLoading(true);
      const response = await roomService.createRoom(hostName.trim());

      const { token, room, hostUser } = response.data;

      // Salvar autenticação
      login(token, room.code, hostUser.role);

      // Redirecionar para a sala
      navigate(`/room/${room.code}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar sala');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-room-container">
      <Card className="create-room-card">
        <h1 className="create-room-title">Criar Sala</h1>
        <p className="create-room-description">
          Digite seu nome para criar uma nova sessão
        </p>

        <form onSubmit={handleSubmit} className="create-room-form">
          <Input
            label="Seu nome"
            type="text"
            placeholder="Ex: João"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            error={error}
            disabled={loading}
            autoFocus
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Criando...' : 'Criar Sala'}
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