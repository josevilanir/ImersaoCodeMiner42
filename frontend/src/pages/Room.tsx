import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { roomService } from '../services/roomService';
import { Loading } from '../components/ui/Loading';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Button } from '../components/ui/Button';
import { RoomHeader } from '../components/room/RoomHeader';
import { WinnerCard } from '../components/room/WinnerCard';
import { AddMovieForm } from '../components/room/AddMovieForm';
import { MoviesList } from '../components/room/MoviesList';
import { ParticipantsList } from '../components/room/ParticipantsList';
import { RoomFooter } from '../components/room/RoomFooter';
import { TransferOwnershipModal } from '../components/TransferOwnershipModal';
import type { RoomDetails, Movie } from '../@types';
import './Room.css';

export function Room() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { userRole, logout, updateToken } = useAuth();

  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  async function handleAddMovie(title: string, year: string) {
    if (!code) return;

    try {
      setAddingMovie(true);
      await roomService.addMovie(
        code,
        title.trim(),
        year ? parseInt(year) : undefined
      );
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

  function canDeleteMovie(movie: { id: string; suggestedBy: { id: string } }): boolean {
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
          <WinnerCard movie={room.room.winnerMovie} />
        )}

        <div className="room-grid">
          {!isFinished && (
            <AddMovieForm 
              onSubmit={handleAddMovie}
              loading={addingMovie}
            />
          )}

          <MoviesList
            movies={room.movies || []}
            isFinished={isFinished}
            canDelete={canDeleteMovie}
            onDelete={handleDeleteMovie}
            deletingId={deletingMovieId}
          />

          <ParticipantsList
            users={room.users || []}
            currentUserId={currentUserId}
          />
        </div>

        {isHost && !isFinished && (
          <RoomFooter
            onTransfer={() => setShowTransferModal(true)}
            onFinish={handleFinishRoom}
            canFinish={!!room?.movies && room.movies.length > 0}
            hasGuests={guests.length > 0}
            finishing={finishing}
          />
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