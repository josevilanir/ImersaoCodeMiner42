import { Worker } from 'bullmq';
import { redisConfig } from '../../../config/redis';
import { RoomRepository } from '../../../domain/room/RoomRepository';
import { env } from '../../../config/env';

const roomRepository = new RoomRepository();

const worker = new Worker(
  'roomCleanup',
  async (job) => {
    console.log(`🧹 Processing job: ${job.name}`);

    try {
      // Buscar salas finalizadas há mais de X dias
      const oldRooms = await roomRepository.findFinishedRoomsOlderThan(
        env.jobs.cleanupDaysThreshold
      );

      console.log(`Found ${oldRooms.length} old finished rooms to clean`);

      // Deletar cada sala (cascade vai deletar users e movies)
      for (const room of oldRooms) {
        await roomRepository.deleteById(room.id);
        console.log(`Deleted room: ${room.code}`);
      }

      console.log(`✅ Cleanup completed. Deleted ${oldRooms.length} rooms`);

      return { deletedCount: oldRooms.length };
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      throw error;
    }
  },
  redisConfig
);

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});

console.log('🚀 Room cleanup worker started');