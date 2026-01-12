import { RoomUserRepository } from '../../../domain/roomUser/RoomUserRepository';
import { signToken } from '../../../shared/utils/jwt';
import { AppError } from '../../../shared/errors/AppError';
import * as bcrypt from 'bcryptjs';

interface LoginInput {
  username: string;
  password: string;
}

interface LoginOutput {
  user: {
    id: string;
    username: string;
    displayName: string;
  };
  token: string;
}

export class LoginUseCase {
  constructor(private roomUserRepository: RoomUserRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    if (!input.username || !input.password) {
      throw new AppError('Username and password are required', 400, 'INVALID_CREDENTIALS');
    }

    const user = await this.roomUserRepository.findByUsername(input.username);

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password || '');

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const token = signToken({
      sub: user.id,
      displayName: user.displayName,
      roomId: user.roomId,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        username: input.username,
        displayName: user.displayName,
      },
      token,
    };
  }
}