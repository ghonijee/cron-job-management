# Backend Project Guidelines - Cron Jobs Management System

## Project Overview

The Cron Jobs Management System backend provides a robust API for managing scheduled HTTP endpoint calls using cron patterns. Built with NestJS and TypeScript, it offers comprehensive job scheduling, execution tracking, and monitoring capabilities.

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
│   └── utils/                # Utility functions
├── config/
├── database/
│   ├── migrations/           # TypeORM migrations
│   └── seeders/              # Data seeders
├── modules/
│   ├── auth/
│   ├── users/
│   ├── categories/
│   ├── jobs/
│   ├── scheduler/
│   ├── history/
│   └── dashboard/
├── app.module.ts
└── main.ts
```

## TypeScript Best Practices

### Configuration Rules

- Enable strict mode with all strict checks
- Enforce consistent casing and no implicit returns
- Use interfaces for data contracts and DTOs
- Use enums for constant values
- Prefer unknown over any, implement type guards
- Use readonly for immutable properties
- Apply generics for reusable types (PaginatedResponse<T>)

## NestJS Best Practices

### Module Organization

- Each feature has its own module with clear imports/exports
- Use TypeOrmModule.forFeature() for entity registration
- Export services that other modules need
- Keep modules focused on single responsibility

### Controller Guidelines

- Use decorators for route definition and validation
- Implement proper HTTP status codes
- Use ParseIntPipe for numeric parameters
- Apply guards at controller or method level
- Return consistent response formats
- Document endpoints with Swagger decorators

### Service Layer Rules

- Inject repositories using @InjectRepository
- Handle business logic and data transformation
- Throw appropriate HTTP exceptions
- Use QueryBuilder for complex queries
- Implement transaction support where needed
- Keep methods focused and testable

## Database & TypeORM

### Entity Design Rules

- Extend from BaseEntity with common fields (id, createdAt, updatedAt)
- Use appropriate column types and constraints
- Define relations clearly with proper decorators
- Add indexes for frequently queried columns
- Use enums for status fields
- Implement soft deletes where appropriate

### Migration Guidelines

- Never use synchronize in production
- Create migrations for all schema changes
- Name migrations with timestamp prefix
- Include both up and down methods
- Test migrations in development first
- Use QueryRunner for raw SQL when needed

### Seeder Implementation

- Create seeders for initial/test data
- Make seeders idempotent
- Use repository methods for data insertion
- Group related data in single seeder
- Provide clear logging of seeded data

## API Response Standards

### Response Format Rules

- Implement consistent response structure: `{ success, data, message?, errors }`
- Use response interceptor for automatic formatting
- Include metadata for paginated responses
- Standardize error response format
- Return appropriate HTTP status codes

### Error Handling Guidelines

- Create custom exception filter for consistent error responses
- Include error details in development mode only
- Log errors with appropriate context
- Implement business exceptions for domain errors
- Provide actionable error messages

## Job Scheduler Implementation

### Scheduler Service Rules

- Load active jobs on module initialization
- Stop all jobs on module destruction
- Validate cron patterns before scheduling
- Handle job scheduling errors gracefully
- Maintain job registry for lifecycle management
- Support timezone configuration

### Job Executor Guidelines

- Create execution history before running
- Implement retry logic with exponential backoff
- Set appropriate timeouts for HTTP requests
- Handle and log all execution errors
- Update execution history with results
- Support configurable retry attempts

## Authentication Implementation

### JWT Strategy Rules

- Implement access and refresh token flow
- Validate user status in JWT strategy
- Store minimal data in JWT payload
- Configure appropriate token expiration
- Handle token refresh securely
- Implement remember me functionality

### Security Guidelines

- Hash passwords using bcrypt
- Validate all user inputs
- Implement rate limiting on auth endpoints
- Use parameterized queries only
- Sanitize data before database operations
- Apply CORS configuration properly
- Use Helmet for security headers
- Implement request validation pipeline

## Testing Strategy

### Unit Testing

```typescript
describe("CategoriesService", () => {
  it("should create a category", async () => {
    const dto: CreateCategoryDto = { name: "Test", color: "#000" };
    const savedCategory = { id: 1, ...dto };

    jest.spyOn(repository, "save").mockResolvedValue(savedCategory);
    const result = await service.create(dto);

    expect(result).toEqual(savedCategory);
  });
});
```

### Integration Testing

```typescript
describe("Categories Integration", () => {
  it("should create category via API", async () => {
    const response = await request(app.getHttpServer())
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test", color: "#000" })
      .expect(201);

    expect(response.body.data.id).toBeDefined();
  });
});
```

### E2E Testing

```typescript
describe("Job Execution E2E", () => {
  it("should execute job and record history", async () => {
    const response = await request(app.getHttpServer())
      .post(`/jobs/${jobId}/execute`)
      .expect(200);

    const history = await historyRepository.findOne({ where: { jobId } });
    expect(history.status).toBe("success");
  });
});
```

## Performance Optimization

### Database Optimization Rules

- Use QueryBuilder for complex queries with joins
- Add composite indexes for multi-column queries
- Implement pagination at database level
- Use select specific columns when possible
- Avoid N+1 queries with proper joins
- Monitor slow queries in development

### Caching Strategy

- Cache frequently accessed static data
- Implement cache invalidation on data changes
- Use Redis for distributed caching
- Set appropriate TTL for cached data
- Cache expensive computation results
- Implement cache warming for critical data
- Clear related caches on entity updates

## Environment Configuration

### Configuration Rules

- Use ConfigModule with validation schema
- Load configuration from environment variables
- Provide sensible defaults for non-critical values
- Validate required variables on startup
- Use separate configs for different environments
- Never commit sensitive data to repository

## Logging & Monitoring

### Logging Guidelines

- Use Winston for structured logging
- Include correlation IDs in logs
- Log appropriate levels (error, warn, info, debug)
- Avoid logging sensitive information
- Include contextual metadata in logs
- Implement log rotation in production
- Monitor error rates and patterns

## Deployment Considerations

### Production Setup Rules

- Enable CORS with specific origins
- Implement global exception filters
- Use compression middleware
- Enable graceful shutdown
- Set proper Node.js memory limits
- Configure PM2 or similar process manager
- Implement health check endpoints
- Monitor application metrics

## Summary

This implementation provides a production-ready backend with:

- Clean architecture with feature-based modules
- Comprehensive TypeScript type safety
- Robust error handling and logging
- Optimized database queries and caching
- Secure authentication and authorization
- Comprehensive testing coverage
- Production-ready configuration
