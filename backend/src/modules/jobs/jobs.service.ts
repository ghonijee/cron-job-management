import { Injectable } from '@nestjs/common';

@Injectable()
export class JobsService {
  getStatus(): string {
    return 'Jobs service ready';
  }
}