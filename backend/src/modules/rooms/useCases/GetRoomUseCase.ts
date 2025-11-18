import { RoomRepository } from '../../../domain/room/RoomRepository';
import { AppError } from '../../../shared/errors/AppError';

interface GetRoomInput {
  roomCode: string;
  currentUserId: string;
}

export class GetRoomUseCase {
  constructor(private roomRepository: RoomRepository) {}

  async execute(input: GetRoomInput) {
    const room = await this.roomRepository.findByCode(input.roomCode);

    if (!room) {
      throw new AppError('Room not found', 404, 'ROOM_NOT_FOUND');
    }

    // Encontrar o usuário atual
    const currentUser = room.users.find(u => u.id === input.currentUserId);

    if (!currentUser) {
      throw new AppError('User not found in this room', 403, 'USER_NOT_IN_ROOM');
    }

    return {
      room: {
        id: room.id,
        code: room.code,
        status: room.status,
        hostId: room.hostId,
        createdAt: room.createdAt,
        finishedAt: room.finishedAt,
        winnerMovie: room.winnerMovie ? {
          id: room.winnerMovie.id,
          title: room.winnerMovie.title,
          year: room.winnerMovie.year,
          suggestedBy: {
            id: room.winnerMovie.suggestedBy.id,
            displayName: room.winnerMovie.suggestedBy.displayName,
          },
        } : null,
      },
      users: room.users.map(user => ({ 
        id: user.id,
        displayName: user.displayName,
        role: user.role,
      })),
      movies: room.movies.map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.year,
        createdAt: movie.createdAt,
        suggestedBy: {
          id: movie.suggestedBy.id,
          displayName: movie.suggestedBy.displayName,
          role: movie.suggestedBy.role,
        },
      })),
      currentUser: {
        id: currentUser.id,
        displayName: currentUser.displayName,
        role: currentUser.role,
      },
    };
  }
}