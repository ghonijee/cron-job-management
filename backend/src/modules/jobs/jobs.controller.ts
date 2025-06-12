import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JobsService } from './jobs.service';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get jobs service status' })
  @ApiResponse({ status: 200, description: 'Service status' })
  getStatus(): string {
    return this.jobsService.getStatus();
  }
}