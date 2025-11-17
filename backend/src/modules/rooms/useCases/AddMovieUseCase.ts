import { RoomRepository } from '../../../domain/room/RoomRepository';
import { MovieRepository } from '../../../domain/movie/MovieRepository';
import { MovieService } from '../../../domain/movie/MovieService';
import { RoomService } from '../../../domain/room/RoomService';
import { AppError } from '../../../shared/errors/AppError';

interface AddMovieInput {
  roomCode: string;
  currentUserId: string;
  title: string;
  year?: number;
}

export class AddMovieUseCase {
  constructor(
    private roomRepository: RoomRepository,
    private movieRepository: MovieRepository,
    private movieService: MovieService,
    private roomService: RoomService
  ) {}

  async execute(input: AddMovieInput) {
    // Validar título
    this.movieService.validateTitle(input.title);

    // Buscar sala
    const room = await this.roomRepository.findByCode(input.roomCode);

    if (!room) {
      throw new AppError('Room not found', 404, 'ROOM_NOT_FOUND');
    }

    // Validar se sala está aberta
    this.roomService.validateRoomIsOpen(room);

    // Criar filme
    const movie = await this.movieRepository.create({
      roomId: room.id,
      suggestedById: input.currentUserId,
      title: input.title,
      year: input.year,
    });

    return {
      movie: {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        createdAt: movie.createdAt,
      },
    };
  }
}