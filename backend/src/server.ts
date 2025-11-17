import { app } from './app';
import { env } from './config/env';
import { scheduleRoomCleanup } from './infra/jobs/queues/roomCleanupQueue';

const PORT = env.port;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${env.nodeEnv}`);
  
  // Agendar job de limpeza
  await scheduleRoomCleanup();
});