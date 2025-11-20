import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { roomService } from '../services/roomService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { TransferOwnershipModal } from '../components/TransferOwnershipModal';
import type { RoomDetails, Movie } from '../@types';
import { RoomHeader } from '../components/room/RoomHeader';
import './Room.css';

export function Room() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { userRole, logout, updateToken } = useAuth();

  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [movieTitle, setMovieTitle] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [addingMovie, setAddingMovie] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deletingMovieId, setDeletingMovieId] = useState<string | null>(null);
  
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferring, setTransferring] = useState(false);

  const isHost = userRole === 'HOST';
  const isFinished = room?.room.status === 'FINISHED';
  const currentUserId = room?.currentUser?.id;

async function fetchRoom(isPolling = false) {
  if (!code) return;

  try {
    if (!isPolling) {
      setLoading(true);
    }
    setError('');
    const response = await roomService.getRoom(code);
    setRoom(response.data);

    // SEMPRE verificar se o role mudou comparando com o state atual
    const currentRoleInDB = response.data.currentUser.role;
    const currentRoleInState = userRole;

    if (currentRoleInDB !== currentRoleInState) {
      console.log(`Role mudou de ${currentRoleInState} para ${currentRoleInDB}! Obtendo novo token...`);
      try {
        const refreshResponse = await roomService.refreshToken();
        updateToken(refreshResponse.data.token, refreshResponse.data.role);
        console.log('Token atualizado com sucesso!');
      } catch (refreshError) {
        console.error('Erro ao renovar token:', refreshError);
      }
    }
  } catch (err: any) {
    setError(err.response?.data?.error || 'Erro ao carregar sala');
  } finally {
    if (!isPolling) {
      setLoading(false);
    }
  }
}

  useEffect(() => {
    fetchRoom(false);

    const interval = setInterval(() => {
      if (!isFinished) {
        fetchRoom(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [code, isFinished]);

  async function handleAddMovie(e: FormEvent) {
    e.preventDefault();
    if (!code || !movieTitle.trim()) return;

    try {
      setAddingMovie(true);
      await roomService.addMovie(
        code,
        movieTitle.trim(),
        movieYear ? parseInt(movieYear) : undefined
      );

      setMovieTitle('');
      setMovieYear('');

      await fetchRoom(true);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao adicionar filme');
    } finally {
      setAddingMovie(false);
    }
  }

  async function handleDeleteMovie(movieId: string, movieTitle: string) {
    if (!code) return;

    const confirm = window.confirm(
      `Tem certeza que deseja deletar "${movieTitle}"?`
    );

    if (!confirm) return;

    try {
      setDeletingMovieId(movieId);
      await roomService.deleteMovie(code, movieId);
      await fetchRoom(true);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao deletar filme');
    } finally {
      setDeletingMovieId(null);
    }
  }

  async function handleTransferOwnership(newHostId: string) {
    if (!code) return;

    try {
      setTransferring(true);
      const response = await roomService.transferOwnership(code, newHostId);
      
      setShowTransferModal(false);
      
      updateToken(response.data.oldHostToken, 'GUEST');
      
      await fetchRoom(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao transferir sala');
    } finally {
      setTransferring(false);
    }
  }

  async function handleFinishRoom() {
    if (!code) return;

    const confirm = window.confirm(
      'Tem certeza que deseja finalizar a sala e sortear o vencedor?'
    );

    if (!confirm) return;

    try {
      setFinishing(true);
      await roomService.finishRoom(code);
      await fetchRoom(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao finalizar sala');
    } finally {
      setFinishing(false);
    }
  }

  async function handleCopyCode() {
    if (!room?.room.code) return;

    try {
      await navigator.clipboard.writeText(room.room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Erro ao copiar código. Tente copiar manualmente.');
    }
  }

  function handleLeaveRoom() {
    logout();
    navigate('/');
  }

  function canDeleteMovie(movie: Movie): boolean {
    if (isHost) return true;
    return movie.suggestedBy.id === currentUserId;
  }

  const guests = room?.users?.filter(user => user.role === 'GUEST') || [];

  if (loading && !room) {
    return <Loading message="Carregando sala..." />;
  }

  if (error) {
    return (
      <div className="room-error-container">
        <ErrorMessage message={error} onRetry={() => fetchRoom(false)} />
        <Button onClick={() => navigate('/')} variant="secondary">
          Voltar ao início
        </Button>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <div className="room-container">
      <div className="room-content">
        <RoomHeader
          isFinished={isFinished}
          roomCode={room.room.code}
          copied={copied}
          onCopyCode={handleCopyCode}
          onLeave={handleLeaveRoom}
        />

        {isFinished && room.room.winnerMovie && (
          <Card className="winner-card">
            <h2 className="winner-title">🎉 Filme Vencedor!</h2>
            <div className="winner-movie">
              <h3>{room.room.winnerMovie.title}</h3>
              {room.room.winnerMovie.year && <p>({room.room.winnerMovie.year})</p>}
              <p className="winner-suggested">
                Sugerido por: {room.room.winnerMovie.suggestedBy.displayName}
              </p>
            </div>
          </Card>
        )}

        <div className="room-grid">
          {!isFinished && (
            <Card className="add-movie-card">
              <h2>Adicionar Filme</h2>
              <form onSubmit={handleAddMovie} className="add-movie-form">
                <Input
                  label="Título do filme"
                  type="text"
                  placeholder="Ex: Matrix"
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                  disabled={addingMovie}
                  required
                />
                <Input
                  label="Ano (opcional)"
                  type="number"
                  placeholder="Ex: 1999"
                  value={movieYear}
                  onChange={(e) => setMovieYear(e.target.value)}
                  disabled={addingMovie}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                />
                <Button type="submit" fullWidth disabled={addingMovie}>
                  {addingMovie ? 'Adicionando...' : '+ Adicionar'}
                </Button>
              </form>
            </Card>
          )}

          <Card className="movies-card">
            <h2>
              Filmes Sugeridos ({room?.movies?.length || 0})
            </h2>
            {!room?.movies || room.movies.length === 0 ? (
              <p className="no-movies">Nenhum filme adicionado ainda</p>
            ) : (
              <ul className="movies-list">
                {room.movies.map((movie) => (
                  <li key={movie.id} className="movie-item">
                    <div className="movie-info">
                      <strong>{movie.title}</strong>
                      {movie.year && <span className="movie-year">({movie.year})</span>}
                    </div>
                    <div className="movie-actions">
                      <span className="movie-suggested-by">
                        por {movie.suggestedBy.displayName}
                      </span>
                      {!isFinished && canDeleteMovie(movie) && (
                        <button
                          onClick={() => handleDeleteMovie(movie.id, movie.title)}
                          className="delete-movie-button"
                          disabled={deletingMovieId === movie.id}
                          title="Deletar filme"
                        >
                          {deletingMovieId === movie.id ? '⏳' : '🗑️'}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="users-card">
            <h2>Participantes ({room?.users?.length || 0})</h2>
            <ul className="users-list">
              {room?.users?.map((user) => (
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
        </div>

        {isHost && !isFinished && (
          <div className="room-footer">
            <div className="room-footer-actions">
              <Button
                onClick={() => setShowTransferModal(true)}
                variant="secondary"
                disabled={guests.length === 0}
              >
                👑 Transferir Sala
              </Button>
              <Button
                onClick={handleFinishRoom}
                disabled={finishing || !room?.movies || room.movies.length === 0}
                fullWidth
              >
                {finishing
                  ? 'Finalizando...'
                  : '🎲 Finalizar e Sortear Vencedor'}
              </Button>
            </div>
            {(!room?.movies || room.movies.length === 0) && (
              <p className="finish-warning">
                Adicione pelo menos um filme antes de finalizar
              </p>
            )}
          </div>
        )}
      </div>

      {showTransferModal && (
        <TransferOwnershipModal
          guests={guests}
          onTransfer={handleTransferOwnership}
          onClose={() => setShowTransferModal(false)}
          isTransferring={transferring}
        />
      )}
    </div>
  );
}