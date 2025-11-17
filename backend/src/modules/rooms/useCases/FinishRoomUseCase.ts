import { RoomRepository } from '../../../domain/room/RoomRepository';
import { MovieService } from '../../../domain/movie/MovieService';
import { RoomService } from '../../../domain/room/RoomService';
import { AppError } from '../../../shared/errors/AppError';

interface FinishRoomInput {
  roomCode: string;
  hostId: string;
}

export class FinishRoomUseCase {
  constructor(
    private roomRepository: RoomRepository,
    private movieService: MovieService,
    private roomService: RoomService
  ) {}

  async execute(input: FinishRoomInput) {
    // Buscar sala
    const room = await this.roomRepository.findByCode(input.roomCode);

    if (!room) {
      throw new AppError('Room not found', 404, 'ROOM_NOT_FOUND');
    }

    // Validar se sala está aberta
    this.roomService.validateRoomIsOpen(room);

    // Validar se é o host
    if (room.hostId !== input.hostId) {
      throw new AppError('Only the host can finish the room', 403, 'FORBIDDEN');
    }

    // Sortear filme vencedor
    const winnerMovieId = await this.movieService.selectRandomWinner(room.id);

    // Atualizar sala
    const updatedRoom = await this.roomRepository.update(room.id, {
      status: 'FINISHED',
      finishedAt: new Date(),
      winnerMovieId,
    });

    return {
      room: {
        id: updatedRoom.id,
        code: updatedRoom.code,
        status: updatedRoom.status,
        finishedAt: updatedRoom.finishedAt,
        winnerMovieId: updatedRoom.winnerMovieId,
      },
    };
  }
}