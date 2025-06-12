import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getStatus(): string {
    return 'Users service ready';
  }
}