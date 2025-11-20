import { useState, FormEvent } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import './AddMovieForm.css';

interface AddMovieFormProps {
  onSubmit: (title: string, year: string) => Promise<void>;
  loading: boolean;
}

export function AddMovieForm({ onSubmit, loading }: AddMovieFormProps) {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieYear, setMovieYear] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!movieTitle.trim()) return;

    await onSubmit(movieTitle, movieYear);
    
    setMovieTitle('');
    setMovieYear('');
  }

  return (
    <Card className="add-movie-card">
      <h2>Adicionar Filme</h2>
      <form onSubmit={handleSubmit} className="add-movie-form">
        <Input
          label="Título do filme"
          type="text"
          placeholder="Ex: Matrix"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          disabled={loading}
          required
        />
        <Input
          label="Ano (opcional)"
          type="number"
          placeholder="Ex: 1999"
          value={movieYear}
          onChange={(e) => setMovieYear(e.target.value)}
          disabled={loading}
          min="1900"
          max={new Date().getFullYear() + 5}
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Adicionando...' : '+ Adicionar'}
        </Button>
      </form>
    </Card>
  );
}