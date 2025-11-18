import { RoomRepository } from '../../../domain/room/RoomRepository';
import { RoomUserRepository } from '../../../domain/roomUser/RoomUserRepository';
import { RoomService } from '../../../domain/room/RoomService';
import { signToken } from '../../../shared/utils/jwt';
import { AppError } from '../../../shared/errors/AppError';

interface JoinRoomInput {
  roomCode: string;
  displayName: string;
}

interface JoinRoomOutput {
  room: {
    id: string;
    code: string;
    status: string;
  };
  User: {
    id: string;
    displayName: string;
    role: string;
  };
  token: string;
}

export class JoinRoomUseCase {
  constructor(
    private roomRepository: RoomRepository,
    private roomUserRepository: RoomUserRepository,
    private roomService: RoomService
  ) {}

  async execute(input: JoinRoomInput): Promise<JoinRoomOutput> {
    // Buscar sala
    const room = await this.roomRepository.findByCode(input.roomCode);

    if (!room) {
      throw new AppError('Room not found', 404, 'ROOM_NOT_FOUND');
    }

    // Validar se sala está aberta
    this.roomService.validateRoomIsOpen(room);

    // Criar usuário guest
    const guestUser = await this.roomUserRepository.create({
      roomId: room.id,
      displayName: input.displayName,
      role: 'GUEST',
    });

    // Gerar token JWT
    const token = signToken({
      sub: guestUser.id,
      roomId: room.id,
      role: 'GUEST',
      displayName: input.displayName,
    });

    return {
      room: {
        id: room.id,
        code: room.code,
        status: room.status,
      },
      User: {
        id: guestUser.id,
        displayName: guestUser.displayName,
        role: guestUser.role,
      },
      token,
    };
  }
}