import { RoomUserRepository } from '../../../domain/roomUser/RoomUserRepository';
import { AppError } from '../../../shared/errors/AppError';
import { signToken } from '../../../shared/utils/jwt';

interface RefreshTokenInput {
  userId: string;
}

interface RefreshTokenOutput {
  token: string;
  role: string;
}

export class RefreshTokenUseCase {
  constructor(private roomUserRepository: RoomUserRepository) {}

  async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    const user = await this.roomUserRepository.findById(input.userId);

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const newToken = signToken({
      sub: user.id,
      roomId: user.roomId,
      role: user.role,
      displayName: user.displayName,
    });

    return {
      token: newToken,
      role: user.role,
    };
  }
}