import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import './Home.css';

export function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, roomCode } = useAuth();

  useEffect(() => {
    if (isAuthenticated && roomCode) {
      navigate(`/room/${roomCode}`, { replace: true });
    }
  }, [isAuthenticated, roomCode, navigate]);

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">🎬 Movie Night</h1>
          <p className="home-subtitle">
            Escolha filmes com amigos de forma democrática e aleatória
          </p>
        </div>

        <div className="home-actions">
          <Card className="action-card">
            <h2>Criar Sala</h2>
            <p>Comece uma nova sessão e convide seus amigos</p>
            <Button onClick={() => navigate('/create')} fullWidth>
              Criar Sala
            </Button>
          </Card>

          <Card className="action-card">
            <h2>Entrar em Sala</h2>
            <p>Participe de uma sessão existente com o código</p>
            <Button
              onClick={() => navigate('/join')}
              variant="secondary"
              fullWidth
            >
              Entrar em Sala
            </Button>
          </Card>
        </div>

        <div className="home-features">
          <h3>Como funciona?</h3>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">1️⃣</span>
              <h4>Crie ou entre</h4>
              <p>O host cria a sala e compartilha o código</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">2️⃣</span>
              <h4>Sugiram filmes</h4>
              <p>Todos podem adicionar suas sugestões</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">3️⃣</span>
              <h4>Sorteio justo</h4>
              <p>O sistema escolhe aleatoriamente o vencedor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}