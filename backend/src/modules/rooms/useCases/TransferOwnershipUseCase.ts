import { RoomRepository } from '../../../domain/room/RoomRepository';
import { RoomUserRepository } from '../../../domain/roomUser/RoomUserRepository';
import { AppError } from '../../../shared/errors/AppError';
import { signToken } from '../../../shared/utils/jwt';
import { prisma } from '../../../config/database';

interface TransferOwnershipInput {
  roomCode: string;
  currentHostId: string;
  newHostId: string;
}

interface TransferOwnershipOutput {
  newHostToken: string;
  oldHostToken: string;
}

export class TransferOwnershipUseCase {
  constructor(
    private roomRepository: RoomRepository,
    private roomUserRepository: RoomUserRepository
  ) {}

  async execute(input: TransferOwnershipInput): Promise<TransferOwnershipOutput> {
    const room = await this.roomRepository.findByCode(input.roomCode);

    if (!room) {
      throw new AppError('Room not found', 404, 'ROOM_NOT_FOUND');
    }

    if (room.status === 'FINISHED') {
      throw new AppError(
        'Cannot transfer ownership of a finished room',
        400,
        'ROOM_FINISHED'
      );
    }

    if (room.hostId !== input.currentHostId) {
      throw new AppError(
        'Only the current host can transfer ownership',
        403,
        'FORBIDDEN'
      );
    }

    const newHost = await this.roomUserRepository.findById(input.newHostId);
    const oldHost = await this.roomUserRepository.findById(input.currentHostId);

    if (!newHost) {
      throw new AppError('New host not found', 404, 'USER_NOT_FOUND');
    }

    if (!oldHost) {
      throw new AppError('Current host not found', 404, 'USER_NOT_FOUND');
    }

    if (newHost.roomId !== room.id) {
      throw new AppError(
        'New host must be a member of this room',
        400,
        'USER_NOT_IN_ROOM'
      );
    }

    if (newHost.id === input.currentHostId) {
      throw new AppError(
        'You are already the host',
        400,
        'ALREADY_HOST'
      );
    }

    await prisma.$transaction([
      prisma.roomUser.update({
        where: { id: input.currentHostId },
        data: { role: 'GUEST' },
      }),
      prisma.roomUser.update({
        where: { id: input.newHostId },
        data: { role: 'HOST' },
      }),
      prisma.room.update({
        where: { id: room.id },
        data: { hostId: input.newHostId },
      }),
    ]);

    const newHostToken = signToken({
      sub: newHost.id,
      roomId: room.id,
      role: 'HOST',
      displayName: newHost.displayName,
    });

    const oldHostToken = signToken({
      sub: oldHost.id,
      roomId: room.id,
      role: 'GUEST',
      displayName: oldHost.displayName,
    });

    return {
      newHostToken,
      oldHostToken,
    };
  }
}