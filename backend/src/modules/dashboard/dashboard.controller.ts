import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get dashboard service status' })
  @ApiResponse({ status: 200, description: 'Service status' })
  getStatus(): string {
    return this.dashboardService.getStatus();
  }
}