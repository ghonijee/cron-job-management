import { Module } from '@nestjs/common';

@Module({
  providers: [
    // Global pipes, filters, interceptors will be added here
  ],
  exports: [
    // Exported utilities will be added here
  ],
})
export class CommonModule {}