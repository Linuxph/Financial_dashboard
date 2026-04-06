import { UserRole } from '../models/User';

export interface AuthPayload {
  userId: string;
  role: UserRole;
}
