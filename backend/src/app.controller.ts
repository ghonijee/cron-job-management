import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get()
  @ApiOkResponse({ description: 'API health check', type: String })
  getHello() {
    return {
      message: 'API is running',
    };
  }
}
