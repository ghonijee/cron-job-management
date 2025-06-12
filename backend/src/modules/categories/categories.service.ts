import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  getStatus(): string {
    return 'Categories service ready';
  }
}