import { Card } from '../ui/Card';
import './MoviesList.css';

interface MovieItem {
  id: string;
  title: string;
  year?: number;
  suggestedBy: {
    id: string;
    displayName: string;
  };
}

interface MoviesListProps {
  movies: MovieItem[];
  isFinished: boolean;
  canDelete: (movie: MovieItem) => boolean;
  onDelete: (movieId: string, movieTitle: string) => void;
  deletingId: string | null;
}

export function MoviesList({
  movies,
  isFinished,
  canDelete,
  onDelete,
  deletingId,
}: MoviesListProps) {
  return (
    <Card className="movies-card">
      <h2>Filmes Sugeridos ({movies?.length || 0})</h2>
      {!movies || movies.length === 0 ? (
        <p className="no-movies">Nenhum filme adicionado ainda</p>
      ) : (
        <ul className="movies-list">
          {movies.map((movie) => (
            <li key={movie.id} className="movie-item">
              <div className="movie-info">
                <strong>{movie.title}</strong>
                {movie.year && <span className="movie-year">({movie.year})</span>}
              </div>
              <div className="movie-actions">
                <span className="movie-suggested-by">
                  por {movie.suggestedBy.displayName}
                </span>
                {!isFinished && canDelete(movie) && (
                  <button
                    onClick={() => onDelete(movie.id, movie.title)}
                    className="delete-movie-button"
                    disabled={deletingId === movie.id}
                    title="Deletar filme"
                  >
                    {deletingId === movie.id ? '⏳' : '🗑️'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}