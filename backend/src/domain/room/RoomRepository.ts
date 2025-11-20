import { prisma } from '../../config/database';
import { RoomStatus } from '@prisma/client';
import { RoomEntity } from './RoomEntity';

export class RoomRepository {
  async create(data: {
    code: string;
    hostId: string;
  }): Promise<RoomEntity> {
    return await prisma.room.create({
      data: {
        code: data.code,
        hostId: data.hostId,
        status: 'OPEN',
      },
    });
  }

  async findByCode(code: string) {
    return await prisma.room.findUnique({
      where: { code },
      include: {
        host: true,
        users: true,
        movies: {
          include: {
            suggestedBy: true,
          },
        },
        winnerMovie: {
          include: {
            suggestedBy: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return await prisma.room.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: {
    status?: RoomStatus;
    finishedAt?: Date;
    winnerMovieId?: string;
  }) {
    return await prisma.room.update({
      where: { id },
      data,
    });
  }

  async updateHost(roomId: string, newHostId: string) {
    return await prisma.room.update({
      where: { id: roomId },
      data: { hostId: newHostId },
    });
  }

  async findFinishedRoomsOlderThan(days: number) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);

    return await prisma.room.findMany({
      where: {
        status: 'FINISHED',
        finishedAt: {
          lt: thresholdDate,
        },
      },
    });
  }

  async deleteById(id: string) {
    await prisma.room.delete({
      where: { id },
    });
  }
}