import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getStatus(): string {
    return 'Auth service ready';
  }
}