import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HistoryService } from './history.service';

@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get history service status' })
  @ApiResponse({ status: 200, description: 'Service status' })
  getStatus(): string {
    return this.historyService.getStatus();
  }
}