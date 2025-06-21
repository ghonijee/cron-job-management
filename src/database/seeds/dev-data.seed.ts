import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Category } from '../../entities/category.entity';
import { CronJob, JobStatus } from '../../entities/cron-job.entity';
import * as bcrypt from 'bcryptjs';

export async function seedDevData(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const categoryRepository = dataSource.getRepository(Category);
  const cronJobRepository = dataSource.getRepository(CronJob);

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const testUser = userRepository.create({
    email: 'test@example.com',
    password: hashedPassword,
    firstName: 'Test',
    lastName: 'User',
    role: 'admin',
  });
  await userRepository.save(testUser);

  // Create default categories
  const categories = [
    {
      name: 'API Monitoring',
      description: 'Health checks and API monitoring',
      color: '#10B981',
    },
    {
      name: 'Data Sync',
      description: 'Data synchronization tasks',
      color: '#F59E0B',
    },
    {
      name: 'Maintenance',
      description: 'System maintenance tasks',
      color: '#EF4444',
    },
    { name: 'Reports', description: 'Automated reporting', color: '#8B5CF6' },
  ];

  const savedCategories = await categoryRepository.save(categories);

  // Create sample cron jobs
  const cronJobs = [
    {
      name: 'Health Check',
      description: 'Check API health status',
      endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
      httpMethod: 'GET',
      cronSchedule: '*/5 * * * *', // Every 5 minutes
      status: JobStatus.ACTIVE,
      user: testUser,
      category: savedCategories[0],
    },
    {
      name: 'Weekly Report',
      description: 'Generate weekly analytics report',
      endpoint: 'https://jsonplaceholder.typicode.com/posts',
      httpMethod: 'GET',
      cronSchedule: '0 9 * * 1', // Every Monday at 9 AM
      status: JobStatus.ACTIVE,
      user: testUser,
      category: savedCategories[3],
    },
  ];

  await cronJobRepository.save(cronJobs);
}
