import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Criar sala de teste
  const room = await prisma.room.create({
    data: {
      code: 'TEST01',
      status: 'OPEN'
    }
  });

  // Criar usuário de teste
  const user = await prisma.roomUser.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      displayName: 'Administrador',
      role: 'HOST',
      roomId: room.id
    }
  });

  console.log('✅ Usuário criado com sucesso!');
  console.log('Username:', user.username);
  console.log('Password: admin123');
  console.log('DisplayName:', user.displayName);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());