import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getStatus(): string {
    return 'Dashboard service ready';
  }
}