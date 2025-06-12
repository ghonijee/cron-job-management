# Backend Project Guidelines - Cron Jobs Management System

## Project Overview

The Cron Jobs Management System backend provides a robust API for managing scheduled HTTP endpoint calls using cron patterns. Built with NestJS and TypeScript, it offers comprehensive job scheduling, execution tracking, and monitoring capabilities with a focus on reliability, performance, and maintainability.

### Core Responsibilities

- User authentication and session management
- CRUD operations for categories and cron jobs
- Job scheduling and execution using node-cron
- Execution history tracking and analytics
- Real-time job monitoring and manual triggering
- Server-side search, filtering, and pagination

## Tech Stack

- **Framework**: NestJS 10+
- **Language**: TypeScript 5+
- **Database**: MySQL 8+
- **ORM**: TypeORM
- **Scheduler**: node-cron
- **Authentication**: JWT with refresh tokens
- **Validation**: class-validator & class-transformer
- **Testing**: Jest & Supertest
- **Documentation**: Swagger/OpenAPI

## Project Structure

```
src/
├── common/
│   ├── decorators/           # Custom decorators
│   ├── dto/                  # Shared DTOs
│   ├── entities/             # Base entities
│   ├── exceptions/           # Custom exceptions
│   ├── filters/              # Exception filters
│   ├── guards/               # Auth guards
│   ├── interceptors/         # Response interceptors
│   ├── interfaces/           # Shared interfaces
│   ├── pipes/                # Validation pipes
│   └── utils/                # Utility functions
├── config/
│   ├── database.config.ts
│   ├── app.config.ts
│   └── jwt.config.ts
├── database/
│   ├── migrations/           # TypeORM migrations
│   └── seeders/              # Data seeders
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   ├── strategies/
│   │   └── interfaces/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   └── interfaces/
│   ├── categories/
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   ├── categories.module.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   └── interfaces/
│   ├── jobs/
│   │   ├── jobs.controller.ts
│   │   ├── jobs.service.ts
│   │   ├── jobs.module.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   └── interfaces/
│   ├── scheduler/
│   │   ├── scheduler.service.ts
│   │   ├── scheduler.module.ts
│   │   ├── job-executor.service.ts
│   │   └── interfaces/
│   ├── history/
│   │   ├── history.controller.ts
│   │   ├── history.service.ts
│   │   ├── history.module.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   └── interfaces/
│   └── dashboard/
│       ├── dashboard.controller.ts
│       ├── dashboard.service.ts
│       └── dashboard.module.ts
├── app.module.ts
└── main.ts

test/
├── unit/                     # Unit tests
├── integration/              # Integration tests
└── e2e/                      # End-to-end tests
```

## TypeScript Best Practices

### Strict Configuration

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Type Safety Rules

```typescript
// ✅ DO: Use interfaces for data contracts
interface CreateJobDto {
  name: string;
  description: string;
  cronPattern: string;
  categoryId: number;
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retryAttempts?: number;
}

// ✅ DO: Use enums for constants
enum JobStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  FAILED = "failed",
}

// ✅ DO: Use generics for reusable types
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

// ❌ DON'T: Use any
// ✅ DO: Use unknown and type guards
function processPayload(payload: unknown): void {
  if (isValidPayload(payload)) {
    // Process validated payload
  }
}

// ✅ DO: Use readonly for immutable data
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}
```

## NestJS Best Practices

### Module Organization

```typescript
// categories.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Category]), CommonModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService], // Export for other modules
})
export class CategoriesModule {}
```

### Controller Best Practices

```typescript
@Controller("categories")
@ApiTags("categories")
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "Get all categories" })
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "status", enum: Status, required: false })
  @ApiPaginatedResponse(CategoryDto)
  async findAll(
    @Query() query: GetCategoriesDto,
    @Query() pagination: PaginationDto
  ): Promise<PaginatedResponse<CategoryDto>> {
    return this.categoriesService.findAll(query, pagination);
  }

  @Post()
  @ApiOperation({ summary: "Create category" })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({ type: CategoryDto })
  async create(@Body() dto: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoriesService.create(dto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get category by ID" })
  @ApiParam({ name: "id", type: "number" })
  @ApiOkResponse({ type: CategoryDto })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<CategoryDto> {
    return this.categoriesService.findOne(id);
  }
}
```

### Service Layer Pattern

```typescript
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async findAll(
    filters: GetCategoriesDto,
    pagination: PaginationDto
  ): Promise<PaginatedResponse<Category>> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.jobs", "jobs");

    // Apply filters
    if (filters.search) {
      queryBuilder.andWhere("category.name LIKE :search", {
        search: `%${filters.search}%`,
      });
    }

    if (filters.status) {
      queryBuilder.andWhere("category.status = :status", {
        status: filters.status,
      });
    }

    // Apply pagination
    const [data, total] = await queryBuilder
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page: pagination.page,
        lastPage: Math.ceil(total / pagination.limit),
      },
    };
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ["jobs"],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }
}
```

## Database & TypeORM

### Entity Best Practices

```typescript
// base.entity.ts
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "boolean", default: true })
  isActive: boolean;
}

// category.entity.ts
@Entity("categories")
export class Category extends BaseEntity {
  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ length: 7 })
  color: string;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @OneToMany(() => Job, (job) => job.category)
  jobs: Job[];

  @Column({ default: 0 })
  jobCount: number;
}

// job.entity.ts
@Entity("jobs")
export class Job extends BaseEntity {
  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ length: 100 })
  cronPattern: string;

  @Column({ length: 500 })
  url: string;

  @Column({
    type: "enum",
    enum: HttpMethod,
    default: HttpMethod.GET,
  })
  method: HttpMethod;

  @Column({ type: "json", nullable: true })
  headers: Record<string, string>;

  @Column({ type: "json", nullable: true })
  body: unknown;

  @Column({ default: 30000 })
  timeout: number;

  @Column({ default: 3 })
  retryAttempts: number;

  @Column({ default: 1000 })
  retryDelay: number;

  @ManyToOne(() => Category, (category) => category.jobs)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @Column()
  categoryId: number;

  @OneToMany(() => ExecutionHistory, (history) => history.job)
  executions: ExecutionHistory[];
}
```

### Migration Strategy

```typescript
// 1234567890-CreateCategoriesTable.ts
export class CreateCategoriesTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "categories",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
            isUnique: true,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "color",
            type: "varchar",
            length: "7",
          },
          {
            name: "status",
            type: "enum",
            enum: ["active", "inactive"],
            default: "'active'",
          },
          {
            name: "jobCount",
            type: "int",
            default: 0,
          },
          {
            name: "isActive",
            type: "boolean",
            default: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
        indices: [
          {
            name: "IDX_CATEGORY_STATUS",
            columnNames: ["status"],
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("categories");
  }
}
```

### Seeder Implementation

```typescript
// database/seeders/category.seeder.ts
export class CategorySeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const categoryRepository = connection.getRepository(Category);

    const categories = [
      {
        name: "Data Sync",
        description: "Jobs for synchronizing data between systems",
        color: "#3B82F6",
        status: Status.ACTIVE,
      },
      {
        name: "Reports",
        description: "Scheduled report generation jobs",
        color: "#10B981",
        status: Status.ACTIVE,
      },
      {
        name: "Maintenance",
        description: "System maintenance and cleanup jobs",
        color: "#F59E0B",
        status: Status.ACTIVE,
      },
      {
        name: "Notifications",
        description: "Email and webhook notification jobs",
        color: "#8B5CF6",
        status: Status.ACTIVE,
      },
    ];

    for (const categoryData of categories) {
      const category = categoryRepository.create(categoryData);
      await categoryRepository.save(category);
    }
  }
}
```

## API Response Standards

### Unified Response Format

```typescript
// common/interceptors/response.interceptor.ts
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      }))
    );
  }
}

// common/interfaces/api-response.interface.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  errors?: object;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    perPage: number;
  };
}
```

### Error Handling

```typescript
// common/filters/http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exceptionResponse["message"] || exception.message,
      errors: exceptionResponse["errors"] || null,
    };

    response.status(status).json(error);
  }
}

// common/exceptions/business.exception.ts
export class BusinessException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST
  ) {
    super({ message, errors: null }, statusCode);
  }
}
```

## Job Scheduler Implementation

### Scheduler Service

```typescript
@Injectable()
export class SchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SchedulerService.name);
  private scheduledJobs = new Map<number, ScheduledTask>();

  constructor(
    private readonly jobsService: JobsService,
    private readonly jobExecutor: JobExecutorService
  ) {}

  async onModuleInit() {
    await this.loadActiveJobs();
  }

  onModuleDestroy() {
    this.stopAllJobs();
  }

  private async loadActiveJobs() {
    const activeJobs = await this.jobsService.findActiveJobs();

    for (const job of activeJobs) {
      this.scheduleJob(job);
    }

    this.logger.log(`Loaded ${activeJobs.length} active jobs`);
  }

  scheduleJob(job: Job): void {
    // Stop existing schedule if any
    this.stopJob(job.id);

    try {
      const task = cron.schedule(
        job.cronPattern,
        async () => {
          await this.jobExecutor.execute(job);
        },
        {
          scheduled: true,
          timezone: "UTC",
        }
      );

      this.scheduledJobs.set(job.id, task);
      this.logger.log(
        `Scheduled job: ${job.name} with pattern: ${job.cronPattern}`
      );
    } catch (error) {
      this.logger.error(`Failed to schedule job ${job.name}: ${error.message}`);
      throw new BusinessException(`Invalid cron pattern: ${job.cronPattern}`);
    }
  }

  stopJob(jobId: number): void {
    const task = this.scheduledJobs.get(jobId);

    if (task) {
      task.stop();
      this.scheduledJobs.delete(jobId);
      this.logger.log(`Stopped job with ID: ${jobId}`);
    }
  }

  private stopAllJobs(): void {
    this.scheduledJobs.forEach((task, jobId) => {
      task.stop();
    });

    this.scheduledJobs.clear();
    this.logger.log("All scheduled jobs stopped");
  }
}
```

### Job Executor Service

```typescript
@Injectable()
export class JobExecutorService {
  private readonly logger = new Logger(JobExecutorService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly historyService: HistoryService
  ) {}

  async execute(job: Job): Promise<ExecutionHistory> {
    const startTime = Date.now();
    const execution = await this.historyService.createExecution({
      jobId: job.id,
      status: ExecutionStatus.RUNNING,
      startedAt: new Date(),
    });

    try {
      const response = await this.executeHttpRequest(job);

      const endTime = Date.now();
      const duration = endTime - startTime;

      return await this.historyService.updateExecution(execution.id, {
        status: ExecutionStatus.SUCCESS,
        endedAt: new Date(),
        duration,
        responseStatus: response.status,
        responseBody: response.data,
      });
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      return await this.historyService.updateExecution(execution.id, {
        status: ExecutionStatus.FAILED,
        endedAt: new Date(),
        duration,
        error: error.message,
        responseStatus: error.response?.status,
        responseBody: error.response?.data,
      });
    }
  }

  private async executeHttpRequest(job: Job): Promise<any> {
    const config: AxiosRequestConfig = {
      method: job.method,
      url: job.url,
      headers: job.headers || {},
      data: job.body,
      timeout: job.timeout,
    };

    let lastError: any;

    for (let attempt = 0; attempt <= job.retryAttempts; attempt++) {
      try {
        if (attempt > 0) {
          await this.delay(job.retryDelay);
          this.logger.log(`Retry attempt ${attempt} for job: ${job.name}`);
        }

        return await this.httpService.axiosRef.request(config);
      } catch (error) {
        lastError = error;
        this.logger.error(
          `Job ${job.name} failed on attempt ${attempt + 1}: ${error.message}`
        );
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

## Authentication Implementation

### JWT Strategy

```typescript
// auth/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid token");
    }

    return user;
  }
}

// auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this.generateTokens(user);

    if (dto.rememberMe) {
      await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
    }

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private async generateTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get("JWT_ACCESS_EXPIRY"),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get("JWT_REFRESH_EXPIRY"),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
```

## Testing Strategy

### Unit Testing

```typescript
// categories.service.spec.ts
describe("CategoriesService", () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  describe("create", () => {
    it("should create a category", async () => {
      const dto: CreateCategoryDto = {
        name: "Test Category",
        description: "Test Description",
        color: "#000000",
        status: Status.ACTIVE,
      };

      const savedCategory = { id: 1, ...dto };

      jest.spyOn(repository, "create").mockReturnValue(savedCategory as any);
      jest.spyOn(repository, "save").mockResolvedValue(savedCategory as any);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(savedCategory);
      expect(result).toEqual(savedCategory);
    });
  });

  describe("findAll", () => {
    it("should return paginated categories", async () => {
      const filters: GetCategoriesDto = { search: "test" };
      const pagination: PaginationDto = { page: 1, limit: 10 };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      jest
        .spyOn(repository, "createQueryBuilder")
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll(filters, pagination);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "category.name LIKE :search",
        { search: "%test%" }
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result.meta.page).toBe(1);
    });
  });
});
```

### Integration Testing

```typescript
// test/integration/categories.integration.spec.ts
describe("Categories Integration", () => {
  let app: INestApplication;
  let repository: Repository<Category>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    repository = moduleFixture.get<Repository<Category>>(
      getRepositoryToken(Category)
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await repository.query("DELETE FROM categories");
  });

  describe("POST /categories", () => {
    it("should create a category", async () => {
      const dto = {
        name: "Test Category",
        description: "Test Description",
        color: "#FF0000",
        status: "active",
      };

      const response = await request(app.getHttpServer())
        .post("/categories")
        .set("Authorization", `Bearer ${getTestToken()}`)
        .send(dto)
        .expect(201);

      expect(response.body.data).toMatchObject(dto);
      expect(response.body.data.id).toBeDefined();

      const saved = await repository.findOne({ where: { name: dto.name } });
      expect(saved).toBeDefined();
    });

    it("should validate required fields", async () => {
      const response = await request(app.getHttpServer())
        .post("/categories")
        .set("Authorization", `Bearer ${getTestToken()}`)
        .send({})
        .expect(400);

      expect(response.body.errors).toBeDefined();
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /categories", () => {
    it("should return paginated categories", async () => {
      // Seed test data
      const categories = Array.from({ length: 15 }, (_, i) => ({
        name: `Category ${i}`,
        color: "#000000",
        status: Status.ACTIVE,
      }));

      await repository.save(categories);

      const response = await request(app.getHttpServer())
        .get("/categories?page=2&limit=10")
        .set("Authorization", `Bearer ${getTestToken()}`)
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.meta.total).toBe(15);
      expect(response.body.meta.page).toBe(2);
      expect(response.body.meta.lastPage).toBe(2);
    });
  });
});
```

### E2E Testing

```typescript
// test/e2e/job-execution.e2e.spec.ts
describe("Job Execution E2E", () => {
  let app: INestApplication;
  let jobsRepository: Repository<Job>;
  let historyRepository: Repository<ExecutionHistory>;

  beforeAll(async () => {
    // Setup app...
  });

  it("should execute a job and record history", async () => {
    // Create a job
    const job = await jobsRepository.save({
      name: "Test Job",
      cronPattern: "* * * * *",
      url: "https://httpbin.org/get",
      method: HttpMethod.GET,
      categoryId: 1,
    });

    // Trigger manual execution
    const response = await request(app.getHttpServer())
      .post(`/jobs/${job.id}/execute`)
      .set("Authorization", `Bearer ${getTestToken()}`)
      .expect(200);

    expect(response.body.data.status).toBe("success");

    // Verify history
    const history = await historyRepository.findOne({
      where: { jobId: job.id },
      order: { createdAt: "DESC" },
    });

    expect(history).toBeDefined();
    expect(history.status).toBe(ExecutionStatus.SUCCESS);
    expect(history.responseStatus).toBe(200);
  });
});
```

## Performance Optimization

### Database Query Optimization

```typescript
// Use query builder for complex queries
const jobs = await this.jobRepository
  .createQueryBuilder("job")
  .leftJoinAndSelect("job.category", "category")
  .leftJoin("job.executions", "execution")
  .addSelect([
    "COUNT(execution.id) as totalExecutions",
    "SUM(CASE WHEN execution.status = :success THEN 1 ELSE 0 END) as successCount",
  ])
  .setParameter("success", ExecutionStatus.SUCCESS)
  .where("job.status = :status", { status: JobStatus.ACTIVE })
  .groupBy("job.id")
  .getRawAndEntities();

// Use indexes for frequently queried columns
@Index(["status", "createdAt"])
@Index(["categoryId", "status"])
export class Job extends BaseEntity {
  // ...
}
```

### Caching Strategy

```typescript
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async findAll(/* ... */): Promise<PaginatedResponse<Category>> {
    const cacheKey = `categories:${JSON.stringify({ filters, pagination })}`;

    // Check cache
    const cached = await this.cacheManager.get<PaginatedResponse<Category>>(
      cacheKey
    );
    if (cached) return cached;

    // Fetch from database
    const result = await this.fetchFromDatabase(filters, pagination);

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300);

    return result;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.save(
      this.categoryRepository.create(dto)
    );

    // Invalidate related caches
    await this.invalidateCategoryCache();

    return category;
  }

  private async invalidateCategoryCache(): Promise<void> {
    const keys = await this.cacheManager.store.keys("categories:*");
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }
}
```

### Connection Pooling

```typescript
// database.config.ts
export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  extra: {
    connectionLimit: 10,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
  },
});
```

## Security Best Practices

### Input Validation

```typescript
// dto/create-job.dto.ts
export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Matches(/^[a-zA-Z0-9\s\-_]+$/, {
    message:
      "Name can only contain letters, numbers, spaces, hyphens, and underscores",
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 1000)
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsCronExpression()
  cronPattern: string;

  @IsNotEmpty()
  @IsUrl({
    protocols: ["http", "https"],
    require_protocol: true,
  })
  url: string;

  @IsEnum(HttpMethod)
  method: HttpMethod;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => HeadersDto)
  headers?: Record<string, string>;

  @IsOptional()
  @IsJSON()
  body?: string;

  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(300000)
  timeout?: number = 30000;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  retryAttempts?: number = 3;
}

// Custom validators
@ValidatorConstraint({ name: "isCronExpression", async: false })
export class IsCronExpressionConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string): boolean {
    try {
      cron.validate(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return "Invalid cron expression";
  }
}

export function IsCronExpression(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCronExpressionConstraint,
    });
  };
}
```

### Rate Limiting

```typescript
// main.ts
import rateLimit from "express-rate-limit";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global rate limit
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP",
    })
  );

  // Strict rate limit for auth endpoints
  app.use(
    "/auth/*",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      skipSuccessfulRequests: true,
    })
  );

  await app.listen(3000);
}
```

### SQL Injection Prevention

```typescript
// Always use parameterized queries
@Injectable()
export class JobsService {
  async searchJobs(searchTerm: string): Promise<Job[]> {
    // ✅ Safe - parameterized query
    return this.jobRepository
      .createQueryBuilder("job")
      .where("job.name LIKE :search OR job.description LIKE :search", {
        search: `%${searchTerm}%`,
      })
      .getMany();

    // ❌ Unsafe - DO NOT use string concatenation
    // .where(`job.name LIKE '%${searchTerm}%'`)
  }

  async executeRawQuery(categoryId: number): Promise<any> {
    // ✅ Safe - using parameters
    return this.jobRepository.query(
      "SELECT * FROM jobs WHERE categoryId = ? AND status = ?",
      [categoryId, JobStatus.ACTIVE]
    );

    // ❌ Unsafe - DO NOT concatenate user input
    // .query(`SELECT * FROM jobs WHERE categoryId = ${categoryId}`)
  }
}
```

## Environment Configuration

### Configuration Module Setup

```typescript
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRY || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRY || "7d",
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
  },
});

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test")
          .default("development"),
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRY: Joi.string().default("15m"),
        JWT_REFRESH_EXPIRY: Joi.string().default("7d"),
      }),
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

### Environment Files

```bash
# .env.example
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=cron_jobs

# JWT
JWT_SECRET=your-secret-key-here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Redis (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

## Logging & Monitoring

### Structured Logging

```typescript
// common/logger/logger.service.ts
import { Injectable, LoggerService as NestLoggerService } from "@nestjs/common";
import * as winston from "winston";

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: "cron-jobs-api" },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
        }),
        new winston.transports.File({
          filename: "logs/combined.log",
        }),
      ],
    });
  }

  log(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, ...meta });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { context, trace });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
}

// Usage in services
@Injectable()
export class JobExecutorService {
  constructor(private readonly logger: LoggerService) {}

  async execute(job: Job): Promise<void> {
    this.logger.log("Starting job execution", JobExecutorService.name, {
      jobId: job.id,
      jobName: job.name,
      url: job.url,
    });

    try {
      // ... execution logic

      this.logger.log("Job executed successfully", JobExecutorService.name, {
        jobId: job.id,
        duration: executionTime,
      });
    } catch (error) {
      this.logger.error(
        "Job execution failed",
        error.stack,
        JobExecutorService.name
      );
    }
  }
}
```

### Health Checks

```typescript
// health/health.controller.ts
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck("database"),
      () =>
        this.http.pingCheck("external-api", "https://api.example.com/health"),
      () => this.memory.checkHeap("memory_heap", 150 * 1024 * 1024), // 150MB
      () => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024), // 300MB
    ]);
  }

  @Get("live")
  liveness() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @Get("ready")
  async readiness() {
    try {
      // Check database connection
      await this.db.pingCheck("database");
      return { status: "ready", timestamp: new Date().toISOString() };
    } catch (error) {
      throw new ServiceUnavailableException("Service not ready");
    }
  }
}
```

## API Documentation

### Swagger Configuration

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("Cron Jobs Management API")
    .setDescription("API for managing scheduled HTTP endpoint calls")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth", "Authentication endpoints")
    .addTag("categories", "Category management")
    .addTag("jobs", "Job management")
    .addTag("history", "Execution history")
    .addTag("dashboard", "Dashboard and analytics")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
}

// Custom decorators for common responses
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(model) },
              },
              meta: {
                type: "object",
                properties: {
                  total: { type: "number" },
                  page: { type: "number" },
                  lastPage: { type: "number" },
                  perPage: { type: "number" },
                },
              },
            },
          },
        ],
      },
    })
  );
};
```

## Deployment Considerations

### Production Configuration

```typescript
// main.ts - Production setup
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  });

  // Global middleware
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;
  await app.listen(port, "0.0.0.0");

  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main"]
```

### Database Migrations in Production

```json
// package.json scripts
{
  "scripts": {
    "migration:generate": "npm run build && npx typeorm migration:generate -d dist/database/data-source.js",
    "migration:create": "npx typeorm migration:create",
    "migration:run": "npm run build && npx typeorm migration:run -d dist/database/data-source.js",
    "migration:revert": "npm run build && npx typeorm migration:revert -d dist/database/data-source.js",
    "seed:run": "npm run build && node dist/database/seeders/run-seeders.js"
  }
}
```

## Summary

This backend implementation provides a robust, scalable, and maintainable API for the Cron Jobs Management System. Key features include:

1. **Clean Architecture**: Feature-based module organization with clear separation of concerns
2. **Type Safety**: Comprehensive TypeScript usage with strict configuration
3. **Security**: Input validation, authentication, rate limiting, and SQL injection prevention
4. **Performance**: Database optimization, caching strategies, and connection pooling
5. **Reliability**: Comprehensive error handling, logging, and health checks
6. **Testing**: Unit, integration, and E2E testing strategies
7. **Documentation**: Auto-generated API documentation with Swagger
8. **Deployment Ready**: Docker support and production configurations

The implementation follows NestJS best practices while maintaining simplicity and focusing on production readiness.
