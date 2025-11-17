import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UserRole } from '@prisma/client';

export interface JWTPayload {
  sub: string;
  roomId: string;
  role: UserRole;
  displayName: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(
    payload,
    env.jwt.secret,
    { expiresIn: '2h' }
  );
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, env.jwt.secret) as JWTPayload;
}