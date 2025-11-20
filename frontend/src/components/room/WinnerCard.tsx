import { Card } from '../ui/Card';
import './WinnerCard.css';

interface WinnerMovie {
  id: string;
  title: string;
  year?: number;
  suggestedBy: {
    id: string;
    displayName: string;
    role: string;
  };
}

interface WinnerCardProps {
  movie: WinnerMovie;
}

export function WinnerCard({ movie }: WinnerCardProps) {
  return (
    <Card className="winner-card">
      <h2 className="winner-title">🎉 Filme Vencedor!</h2>
      <div className="winner-movie">
        <h3>{movie.title}</h3>
        {movie.year && <p>({movie.year})</p>}
        <p className="winner-suggested">
          Sugerido por: {movie.suggestedBy.displayName}
        </p>
      </div>
    </Card>
  );
}