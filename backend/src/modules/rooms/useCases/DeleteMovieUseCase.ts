import { RoomRepository } from '../../../domain/room/RoomRepository';
import { MovieRepository } from '../../../domain/movie/MovieRepository';
import { AppError } from '../../../shared/errors/AppError';

interface DeleteMovieInput {
  roomCode: string;
  movieId: string;
  currentUserId: string;
  currentUserRole: string;
}

export class DeleteMovieUseCase {
  constructor(
    private roomRepository: RoomRepository,
    private movieRepository: MovieRepository
  ) {}

  async execute(input: DeleteMovieInput): Promise<void> {
    const room = await this.roomRepository.findByCode(input.roomCode);

    if (!room) {
      throw new AppError('Room not found', 404, 'ROOM_NOT_FOUND');
    }

    if (room.status === 'FINISHED') {
      throw new AppError(
        'Cannot delete movies from a finished room',
        400,
        'ROOM_FINISHED'
      );
    }

    const movie = await this.movieRepository.findById(input.movieId);

    if (!movie) {
      throw new AppError('Movie not found', 404, 'MOVIE_NOT_FOUND');
    }

    if (movie.roomId !== room.id) {
      throw new AppError(
        'Movie does not belong to this room',
        400,
        'MOVIE_NOT_IN_ROOM'
      );
    }

    const isOwner = movie.suggestedById === input.currentUserId;
    const isHost = input.currentUserRole === 'HOST';

    if (!isOwner && !isHost) {
      throw new AppError(
        'You can only delete your own movies or be the host',
        403,
        'FORBIDDEN'
      );
    }

    await this.movieRepository.delete(input.movieId);
  }
}