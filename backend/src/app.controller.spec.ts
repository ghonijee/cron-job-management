import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'environment') return 'test';
              if (key === 'port') return 3001;
              return undefined;
            }),
          },
        },
        {
          provide: Connection,
          useValue: {
            isConnected: false,
            options: { database: 'test_db' },
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a welcome message', () => {
      expect(appController.getHello()).toBe('Cron Jobs Management API is running!');
    });
  });

  describe('health', () => {
    it('should return health status', () => {
      const health = appController.getHealth();
      expect(health).toHaveProperty('status', 'ok');
      expect(health).toHaveProperty('service', 'cron-jobs-backend');
      expect(health).toHaveProperty('environment', 'test');
      expect(health).toHaveProperty('port', 3001);
    });
  });
});