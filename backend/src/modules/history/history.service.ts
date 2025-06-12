import { Injectable } from '@nestjs/common';

@Injectable()
export class HistoryService {
  getStatus(): string {
    return 'History service ready';
  }
}