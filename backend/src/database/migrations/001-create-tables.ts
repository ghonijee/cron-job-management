import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1000000000001 implements MigrationInterface {
  name = 'CreateTables1000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_email\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`categories\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`description\` text,
        \`color\` varchar(7) NOT NULL DEFAULT '#3B82F6',
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_category_name\` (\`name\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`cron_jobs\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`description\` text,
        \`endpoint\` varchar(2048) NOT NULL,
        \`httpMethod\` varchar(10) NOT NULL DEFAULT 'GET',
        \`headers\` json,
        \`payload\` text,
        \`cronSchedule\` varchar(100) NOT NULL,
        \`status\` enum('active', 'inactive', 'paused') NOT NULL DEFAULT 'active',
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`timeoutSeconds\` int NOT NULL DEFAULT 30,
        \`retryCount\` int NOT NULL DEFAULT 3,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`userId\` int NOT NULL,
        \`categoryId\` int,
        INDEX \`IDX_cron_jobs_status_active\` (\`status\`, \`isActive\`),
        INDEX \`IDX_cron_jobs_schedule\` (\`cronSchedule\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`execution_histories\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`status\` enum('success', 'failed', 'timeout', 'retry') NOT NULL,
        \`httpStatusCode\` int NOT NULL,
        \`responseBody\` text,
        \`errorMessage\` text,
        \`executionTimeMs\` decimal(10,3) NOT NULL,
        \`attemptNumber\` int NOT NULL DEFAULT 1,
        \`executedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`cronJobId\` int NOT NULL,
        INDEX \`IDX_execution_histories_job_date\` (\`cronJobId\`, \`executedAt\`),
        INDEX \`IDX_execution_histories_status\` (\`status\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD CONSTRAINT \`FK_cron_jobs_user\` 
      FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`cron_jobs\` 
      ADD CONSTRAINT \`FK_cron_jobs_category\` 
      FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`execution_histories\` 
      ADD CONSTRAINT \`FK_execution_histories_cron_job\` 
      FOREIGN KEY (\`cronJobId\`) REFERENCES \`cron_jobs\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`execution_histories\` DROP FOREIGN KEY \`FK_execution_histories_cron_job\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cron_jobs\` DROP FOREIGN KEY \`FK_cron_jobs_category\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cron_jobs\` DROP FOREIGN KEY \`FK_cron_jobs_user\``,
    );
    await queryRunner.query(`DROP TABLE \`execution_histories\``);
    await queryRunner.query(`DROP TABLE \`cron_jobs\``);
    await queryRunner.query(`DROP TABLE \`categories\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
