import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCronJobSchema1000000000002 implements MigrationInterface {
  name = 'UpdateCronJobSchema1000000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new fields to cron_jobs table
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`cronPattern\` varchar(100) NOT NULL DEFAULT '' AFTER \`cronSchedule\`
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`url\` varchar(2048) NOT NULL DEFAULT '' AFTER \`endpoint\`
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`method\` varchar(10) NOT NULL DEFAULT 'GET' AFTER \`httpMethod\`
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`body\` text NULL AFTER \`payload\`
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`authType\` enum('none', 'basic', 'bearer', 'api_key') NOT NULL DEFAULT 'none'
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`authConfig\` json NULL
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`timeout\` int NOT NULL DEFAULT 30
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`retryDelay\` int NOT NULL DEFAULT 5000
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`nextExecution\` datetime NULL
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`lastExecution\` datetime NULL
    `);

    // Copy data from old fields to new fields
    await queryRunner.query(`UPDATE \`cron_jobs\` SET \`cronPattern\` = \`cronSchedule\``);
    await queryRunner.query(`UPDATE \`cron_jobs\` SET \`url\` = \`endpoint\``);
    await queryRunner.query(`UPDATE \`cron_jobs\` SET \`method\` = \`httpMethod\``);
    await queryRunner.query(`UPDATE \`cron_jobs\` SET \`body\` = \`payload\``);
    await queryRunner.query(`UPDATE \`cron_jobs\` SET \`timeout\` = \`timeoutSeconds\``);

    // Update status enum to include 'error' status
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      MODIFY COLUMN \`status\` enum('active', 'inactive', 'paused', 'error') NOT NULL DEFAULT 'inactive'
    `);

    // Drop old columns after copying data
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`cronSchedule\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`endpoint\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`httpMethod\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`payload\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`timeoutSeconds\``);

    // Update execution_histories table
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD COLUMN \`triggerType\` enum('scheduled', 'manual') NOT NULL DEFAULT 'scheduled'
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD COLUMN \`startedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD COLUMN \`completedAt\` datetime NULL
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD COLUMN \`duration\` int NOT NULL DEFAULT 0
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD COLUMN \`requestBody\` text NULL
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD COLUMN \`requestHeaders\` json NULL
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD COLUMN \`responseHeaders\` json NULL
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD COLUMN \`errorStack\` text NULL
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD COLUMN \`retryAttempt\` int NOT NULL DEFAULT 0
    `);

    // Migrate data from old columns to new columns
    await queryRunner.query(`UPDATE \`execution_histories\` SET \`duration\` = ROUND(\`executionTimeMs\`)`);
    await queryRunner.query(`UPDATE \`execution_histories\` SET \`retryAttempt\` = \`attemptNumber\` - 1`);
    await queryRunner.query(`UPDATE \`execution_histories\` SET \`startedAt\` = \`executedAt\``);
    await queryRunner.query(`UPDATE \`execution_histories\` SET \`completedAt\` = \`executedAt\``);

    // Update status enum to include new statuses
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      MODIFY COLUMN \`status\` enum('success', 'failed', 'timeout', 'retrying', 'running') NOT NULL
    `);

    // Drop old columns after copying data
    await queryRunner.query(`ALTER TABLE \`execution_histories\` DROP COLUMN \`executionTimeMs\``);
    await queryRunner.query(`ALTER TABLE \`execution_histories\` DROP COLUMN \`attemptNumber\``);
    await queryRunner.query(`ALTER TABLE \`execution_histories\` DROP COLUMN \`executedAt\``);

    // Add new indexes for performance
    await queryRunner.query(`DROP INDEX \`IDX_cron_jobs_schedule\` ON \`cron_jobs\``);
    await queryRunner.query(`CREATE INDEX \`IDX_cron_jobs_pattern\` ON \`cron_jobs\` (\`cronPattern\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_cron_jobs_user_category\` ON \`cron_jobs\` (\`userId\`, \`categoryId\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_cron_jobs_next_execution\` ON \`cron_jobs\` (\`nextExecution\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_execution_histories_trigger\` ON \`execution_histories\` (\`triggerType\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove new indexes
    await queryRunner.query(`DROP INDEX \`IDX_execution_histories_trigger\` ON \`execution_histories\``);
    await queryRunner.query(`DROP INDEX \`IDX_cron_jobs_next_execution\` ON \`cron_jobs\``);
    await queryRunner.query(`DROP INDEX \`IDX_cron_jobs_user_category\` ON \`cron_jobs\``);
    await queryRunner.query(`DROP INDEX \`IDX_cron_jobs_pattern\` ON \`cron_jobs\``);

    // Restore old columns in execution_histories
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD COLUMN \`executedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD COLUMN \`executionTimeMs\` decimal(10,3) NOT NULL DEFAULT 0
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD COLUMN \`attemptNumber\` int NOT NULL DEFAULT 1
    `);

    // Copy data back to old columns
    await queryRunner.query(`UPDATE \`execution_histories\` SET \`executionTimeMs\` = \`duration\``);
    await queryRunner.query(`UPDATE \`execution_histories\` SET \`attemptNumber\` = \`retryAttempt\` + 1`);
    await queryRunner.query(`UPDATE \`execution_histories\` SET \`executedAt\` = COALESCE(\`completedAt\`, \`startedAt\`)`);

    // Remove new columns from execution_histories
    await queryRunner.query(`ALTER TABLE \`execution_histories\` DROP COLUMN \`retryAttempt\``);
    await queryRunner.query(`ALTER TABLE \`execution_histories\` DROP COLUMN \`errorStack\``);
    await queryRunner.query(`ALTER TABLE \`execution_histories\` DROP COLUMN \`responseHeaders\``);
    await queryRunner.query(`ALTER TABLE \`execution_histories\` DROP COLUMN \`requestHeaders\``);
    await queryRunner.query(`ALTER TABLE \`execution_histories\` DROP COLUMN \`requestBody\``);
    await queryRunner.query(`ALTER TABLE \`execution_histories\` DROP COLUMN \`duration\``);
    await queryRunner.query(`ALTER TABLE \`execution_histories\` DROP COLUMN \`completedAt\``);
    await queryRunner.query(`ALTER TABLE \`execution_histories\` DROP COLUMN \`startedAt\``);
    await queryRunner.query(`ALTER TABLE \`execution_histories\` DROP COLUMN \`triggerType\``);

    // Restore original status enum for execution_histories
    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      MODIFY COLUMN \`status\` enum('success', 'failed', 'timeout', 'retry') NOT NULL
    `);

    // Restore old columns in cron_jobs
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`cronSchedule\` varchar(100) NOT NULL DEFAULT ''
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`endpoint\` varchar(2048) NOT NULL DEFAULT ''
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`httpMethod\` varchar(10) NOT NULL DEFAULT 'GET'
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`payload\` text NULL
    `);
    
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD COLUMN \`timeoutSeconds\` int NOT NULL DEFAULT 30
    `);

    // Copy data back to old columns
    await queryRunner.query(`UPDATE \`cron_jobs\` SET \`cronSchedule\` = \`cronPattern\``);
    await queryRunner.query(`UPDATE \`cron_jobs\` SET \`endpoint\` = \`url\``);
    await queryRunner.query(`UPDATE \`cron_jobs\` SET \`httpMethod\` = \`method\``);
    await queryRunner.query(`UPDATE \`cron_jobs\` SET \`payload\` = \`body\``);
    await queryRunner.query(`UPDATE \`cron_jobs\` SET \`timeoutSeconds\` = \`timeout\``);

    // Remove new columns from cron_jobs
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`lastExecution\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`nextExecution\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`retryDelay\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`timeout\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`authConfig\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`authType\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`body\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`method\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`url\``);
    await queryRunner.query(`ALTER TABLE \`cron_jobs\` DROP COLUMN \`cronPattern\``);

    // Restore original status enum and index
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      MODIFY COLUMN \`status\` enum('active', 'inactive', 'paused') NOT NULL DEFAULT 'active'
    `);
    
    await queryRunner.query(`CREATE INDEX \`IDX_cron_jobs_schedule\` ON \`cron_jobs\` (\`cronSchedule\`)`);
  }
}