import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get categories service status' })
  @ApiResponse({ status: 200, description: 'Service status' })
  getStatus(): string {
    return this.categoriesService.getStatus();
  }
}