import { MovieRepository } from './MovieRepository';
import { AppError } from '../../shared/errors/AppError';

export class MovieService {
  constructor(private movieRepository: MovieRepository) {}

  validateTitle(title: string) {
    if (!title || title.trim().length === 0) {
      throw new AppError('Movie title is required', 400, 'INVALID_TITLE');
    }
  }

  async selectRandomWinner(roomId: string): Promise<string> {
    const movies = await this.movieRepository.findAllByRoomId(roomId);

    if (movies.length === 0) {
      throw new AppError('At least one movie is required to finish the room', 400, 'NO_MOVIES');
    }

    const randomIndex = Math.floor(Math.random() * movies.length);
    return movies[randomIndex].id;
  }
}