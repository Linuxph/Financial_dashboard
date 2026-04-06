import jwt, { SignOptions } from 'jsonwebtoken';
import { appConfig } from '../config/app';
import { AuthPayload } from '../types/auth';

export const signToken = (payload: AuthPayload) => {
  const options: SignOptions = { expiresIn: appConfig.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, appConfig.jwtSecret, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, appConfig.jwtSecret) as AuthPayload;
};
