import { RoomRepository } from '../../../domain/room/RoomRepository';
import { RoomUserRepository } from '../../../domain/roomUser/RoomUserRepository';
import { RoomService } from '../../../domain/room/RoomService';
import { signToken } from '../../../shared/utils/jwt';
import { prisma } from '../../../config/database';

interface CreateRoomInput {
  hostName: string;
}

interface CreateRoomOutput {
  room: {
    id: string;
    code: string;
    status: string;
  };
  hostUser: {
    id: string;
    displayName: string;
    role: string;
  };
  token: string;
}

export class CreateRoomUseCase {
  constructor(
    private roomRepository: RoomRepository,
    private roomUserRepository: RoomUserRepository,
    private roomService: RoomService
  ) {}

  async execute(input: CreateRoomInput): Promise<CreateRoomOutput> {
    // Gerar código único
    const code = await this.roomService.generateUniqueCode();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar sala SEM host primeiro (hostId é opcional agora)
      const room = await tx.room.create({
        data: {
          code,
          status: 'OPEN',
        },
      });

      // 2. Criar o host COM o roomId correto
      const hostUser = await tx.roomUser.create({
        data: {
          roomId: room.id,
          displayName: input.hostName,
          role: 'HOST',
        },
      });

      // 3. Atualizar sala com o hostId
      const updatedRoom = await tx.room.update({
        where: { id: room.id },
        data: { hostId: hostUser.id },
      });

      return { room: updatedRoom, hostUser };
    });

    // Gerar token JWT
    const token = signToken({
      sub: result.hostUser.id,
      roomId: result.room.id,
      role: 'HOST',
      displayName: input.hostName,
    });

    return {
      room: {
        id: result.room.id,
        code: result.room.code,
        status: result.room.status,
      },
      hostUser: {
        id: result.hostUser.id,
        displayName: result.hostUser.displayName,
        role: result.hostUser.role,
      },
      token,
    };
  }
}