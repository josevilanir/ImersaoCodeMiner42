import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        roomId: string;
        role: UserRole;
        displayName: string;
      };
    }
  }
}

export {};