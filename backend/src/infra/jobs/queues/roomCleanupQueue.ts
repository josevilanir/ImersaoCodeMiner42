import { Queue } from 'bullmq';
import { redisConfig } from '../../../config/redis';

export const roomCleanupQueue = new Queue('roomCleanup', redisConfig);

export async function scheduleRoomCleanup() {
  await roomCleanupQueue.add(
    'clean-old-rooms',
    {},
    {
      repeat: {
        pattern: '0 0 * * *', 
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
  
  console.log('✅ Room cleanup job scheduled');
}