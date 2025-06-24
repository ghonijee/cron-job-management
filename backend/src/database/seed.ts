#!/usr/bin/env ts-node
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { seedDevData } from './seeds/dev-data.seed';

// Load environment variables from .env file
dotenv.config();

// Create DataSource instance for seeding
const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'cron_jobs',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Never use synchronize in production
  logging: true,
});

async function runSeed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Initialize the data source
    await dataSource.initialize();
    console.log('📡 Database connection established');

    // Run the seed data
    await seedDevData(dataSource);
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    // Close the connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  runSeed();
}

export { runSeed };
