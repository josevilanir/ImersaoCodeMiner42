import { RoomRepository } from './RoomRepository';
import { generateRoomCode } from '../../shared/utils/randomCode';
import { AppError } from '../../shared/errors/AppError';

export class RoomService {
  constructor(private roomRepository: RoomRepository) {}

  async generateUniqueCode(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const code = generateRoomCode();
      const existingRoom = await this.roomRepository.findByCode(code);

      if (!existingRoom) {
        return code;
      }

      attempts++;
    }

    throw new AppError('Failed to generate unique room code', 500, 'CODE_GENERATION_FAILED');
  }

  validateRoomIsOpen(room: { status: string }) {
    if (room.status !== 'OPEN') {
      throw new AppError('Room is already finished', 400, 'ROOM_FINISHED');
    }
  }
}