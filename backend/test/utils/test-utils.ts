import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

export const createTestingModule = async (moduleMetadata: any) => {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
      }),
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      ...moduleMetadata.imports,
    ],
    controllers: moduleMetadata.controllers,
    providers: moduleMetadata.providers,
  }).compile();
};