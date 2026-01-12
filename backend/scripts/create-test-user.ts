import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Verificar se já existe uma sala de teste
    let room = await prisma.room.findUnique({
      where: { code: 'TEST01' }
    });

    // Se não existir, criar
    if (!room) {
      room = await prisma.room.create({
        data: {
          code: 'TEST01',
          status: 'OPEN'
        }
      });
      console.log('✅ Sala criada:', room.code);
    } else {
      console.log('ℹ️  Sala já existe:', room.code);
    }

    // Verificar se já existe usuário admin
    const existingUser = await prisma.roomUser.findUnique({
      where: { username: 'admin' }
    });

    if (existingUser) {
      console.log('⚠️  Usuário admin já existe!');
      console.log('ID:', existingUser.id);
      console.log('Username:', existingUser.username);
      console.log('DisplayName:', existingUser.displayName);
      return;
    }

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
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());