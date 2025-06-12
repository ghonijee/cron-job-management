# Backend Phase 1: Project Setup & Infrastructure

**Duration:** 2 days  
**Phase ID:** BE-P1

## Overview

Initialize the NestJS backend project with TypeScript, configure development environment, establish database connections, and set up the foundational infrastructure for the Cron Jobs Management System.

---

## Task 1: Project Initialization & Basic Setup

**Estimated Time:** 3 hours  
**Priority:** Critical

### Description

Create new NestJS project with TypeScript and configure basic project structure.

### Acceptance Criteria

- [ ] NestJS project created with TypeScript support
- [ ] Project starts successfully with `npm run start:dev`
- [ ] Hot reload functionality working
- [ ] Basic project structure matches guidelines

### Implementation Steps

1. **Initialize Project**

   ```bash
   npm i -g @nestjs/cli
   nest new cron-jobs-backend
   cd cron-jobs-backend
   ```

2. **Install Core Dependencies**

   ```bash
   npm install @nestjs/typeorm typeorm mysql2
   npm install @nestjs/config @nestjs/jwt @nestjs/passport
   npm install passport passport-jwt passport-local
   npm install class-validator class-transformer
   npm install @nestjs/swagger swagger-ui-express
   npm install @nestjs/schedule node-cron
   npm install axios @nestjs/axios
   npm install bcryptjs
   npm install helmet compression express-rate-limit
   ```

3. **Install Dev Dependencies**

   ```bash
   npm install -D @types/bcryptjs @types/passport-jwt
   npm install -D @types/passport-local @types/node-cron
   npm install -D @types/express jest @types/jest
   npm install -D supertest @types/supertest
   npm install -D ts-node typescript
   ```

4. **Verify Installation**
   - Start development server
   - Confirm hot reload works
   - Check TypeScript compilation

### Deliverables

- Working NestJS project
- Package.json with all required dependencies
- Basic main.ts with development server

---

## Task 2: TypeScript Configuration & ESLint Setup

**Estimated Time:** 1.5 hours  
**Priority:** High

### Description

Configure strict TypeScript settings and establish code quality standards with ESLint.

### Acceptance Criteria

- [ ] Strict TypeScript configuration applied
- [ ] ESLint rules configured per guidelines
- [ ] Prettier integration working
- [ ] No TypeScript or linting errors on build

### Implementation Steps

1. **Configure TypeScript (tsconfig.json)**

   ```json
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
       "forceConsistentCasingInFileNames": true,
       "module": "commonjs",
       "declaration": true,
       "removeComments": true,
       "emitDecoratorMetadata": true,
       "experimentalDecorators": true,
       "allowSyntheticDefaultImports": true,
       "target": "ES2020",
       "sourceMap": true,
       "outDir": "./dist",
       "baseUrl": "./",
       "incremental": true
     }
   }
   ```

2. **Setup ESLint Configuration**

   ```bash
   npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
   npm install -D eslint-config-prettier eslint-plugin-prettier
   ```

3. **Configure .eslintrc.js**

   ```javascript
   module.exports = {
     parser: "@typescript-eslint/parser",
     parserOptions: {
       project: "tsconfig.json",
       sourceType: "module",
     },
     plugins: ["@typescript-eslint/eslint-plugin"],
     extends: ["@typescript-eslint/recommended", "prettier"],
     root: true,
     env: {
       node: true,
       jest: true,
     },
     ignorePatterns: [".eslintrc.js"],
     rules: {
       "@typescript-eslint/interface-name-prefix": "off",
       "@typescript-eslint/explicit-function-return-type": "off",
       "@typescript-eslint/explicit-module-boundary-types": "off",
       "@typescript-eslint/no-explicit-any": "error",
       "@typescript-eslint/no-unused-vars": "error",
     },
   };
   ```

4. **Setup Prettier**
   ```json
   {
     "singleQuote": true,
     "trailingComma": "all",
     "tabWidth": 2,
     "semi": true,
     "printWidth": 80
   }
   ```

### Deliverables

- Configured tsconfig.json with strict settings
- Working ESLint configuration
- Prettier integration
- VS Code settings for development

---

## Task 3: Project Structure & Module Organization

**Estimated Time:** 2 hours  
**Priority:** High

### Description

Create feature-based folder structure following the backend guidelines and establish base modules.

### Acceptance Criteria

- [ ] Folder structure matches guidelines exactly
- [ ] Base modules created (Auth, Users, Categories, Jobs, History, Dashboard)
- [ ] Common module with shared utilities created
- [ ] Config module structure established

### Implementation Steps

1. **Create Folder Structure**

   ```
   src/
   ├── common/
   │   ├── decorators/
   │   ├── dto/
   │   ├── entities/
   │   ├── exceptions/
   │   ├── filters/
   │   ├── guards/
   │   ├── interceptors/
   │   ├── interfaces/
   │   ├── pipes/
   │   └── utils/
   ├── config/
   │   ├── database.config.ts
   │   ├── app.config.ts
   │   └── jwt.config.ts
   ├── database/
   │   ├── migrations/
   │   └── seeders/
   ├── modules/
   │   ├── auth/
   │   ├── users/
   │   ├── categories/
   │   ├── jobs/
   │   ├── scheduler/
   │   ├── history/
   │   └── dashboard/
   ```

2. **Create Base Module Files**

   - Generate modules: `nest g module modules/auth`
   - Generate controllers: `nest g controller modules/auth`
   - Generate services: `nest g service modules/auth`
   - Repeat for all modules

3. **Setup Common Module**

   ```typescript
   // src/common/common.module.ts
   @Module({
     providers: [
       // Global pipes, filters, interceptors
     ],
     exports: [
       // Exported utilities
     ],
   })
   export class CommonModule {}
   ```

4. **Create Base Interfaces**

   ```typescript
   // src/common/interfaces/api-response.interface.ts
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

### Deliverables

- Complete folder structure
- Generated base modules
- Common module with shared interfaces
- Base controller and service files

---

## Task 4: Database Configuration & Connection Setup

**Estimated Time:** 2.5 hours  
**Priority:** Critical

### Description

Configure TypeORM with MySQL database connection and establish base entity structures.

### Acceptance Criteria

- [ ] TypeORM configured with MySQL connection
- [ ] Database connection working with environment variables
- [ ] Base entity class created
- [ ] Connection pool configured properly
- [ ] Database configuration service working

### Implementation Steps

1. **Create Database Configuration**

   ```typescript
   // src/config/database.config.ts
   import { TypeOrmModuleOptions } from "@nestjs/typeorm";

   export const databaseConfig = (): TypeOrmModuleOptions => ({
     type: "mysql",
     host: process.env.DB_HOST || "localhost",
     port: parseInt(process.env.DB_PORT, 10) || 3306,
     username: process.env.DB_USERNAME || "root",
     password: process.env.DB_PASSWORD || "password",
     database: process.env.DB_DATABASE || "cron_jobs",
     entities: [__dirname + "/../**/*.entity{.ts,.js}"],
     synchronize: process.env.NODE_ENV === "development",
     logging: process.env.NODE_ENV === "development",
     extra: {
       connectionLimit: 10,
       connectTimeout: 60000,
       acquireTimeout: 60000,
       timeout: 60000,
     },
   });
   ```

2. **Create Base Entity**

   ```typescript
   // src/common/entities/base.entity.ts
   import {
     PrimaryGeneratedColumn,
     CreateDateColumn,
     UpdateDateColumn,
     Column,
   } from "typeorm";

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
   ```

3. **Setup Database Module in App**

   ```typescript
   // src/app.module.ts
   @Module({
     imports: [
       ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
       }),
       TypeOrmModule.forRootAsync({
         imports: [ConfigModule],
         useFactory: databaseConfig,
       }),
       // Other modules...
     ],
   })
   export class AppModule {}
   ```

4. **Create Environment Configuration**
   ```typescript
   // src/config/app.config.ts
   export default () => ({
     port: parseInt(process.env.PORT, 10) || 3000,
     environment: process.env.NODE_ENV || "development",
     database: {
       host: process.env.DB_HOST || "localhost",
       port: parseInt(process.env.DB_PORT, 10) || 3306,
       username: process.env.DB_USERNAME || "root",
       password: process.env.DB_PASSWORD || "password",
       database: process.env.DB_DATABASE || "cron_jobs",
     },
   });
   ```

### Deliverables

- Working database configuration
- Base entity class
- Environment-based configuration
- Database connection established

---

## Task 5: Environment Variables & Configuration Management

**Estimated Time:** 1.5 hours  
**Priority:** High

### Description

Setup comprehensive environment configuration with validation and multiple environment support.

### Acceptance Criteria

- [ ] Environment files for different environments created
- [ ] Configuration validation implemented
- [ ] Environment variables properly typed
- [ ] Configuration service accessible globally

### Implementation Steps

1. **Create Environment Files**

   ```bash
   # .env.development
   NODE_ENV=development
   PORT=3000

   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=password
   DB_DATABASE=cron_jobs_dev

   # JWT
   JWT_SECRET=development-secret-key
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d

   # Redis (for future caching)
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # CORS
   CORS_ORIGIN=http://localhost:5173

   # Logging
   LOG_LEVEL=debug
   ```

   ```bash
   # .env.test
   NODE_ENV=test
   PORT=3001
   DB_DATABASE=cron_jobs_test
   JWT_SECRET=test-secret-key
   LOG_LEVEL=error
   ```

   ```bash
   # .env.production
   NODE_ENV=production
   PORT=3000
   # Production values (to be filled)
   ```

2. **Install Validation Dependencies**

   ```bash
   npm install joi
   npm install -D @types/joi
   ```

3. **Setup Configuration Validation**

   ```typescript
   // src/config/configuration.ts
   import * as Joi from "joi";

   export const validationSchema = Joi.object({
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
   });

   export default () => ({
     port: parseInt(process.env.PORT, 10) || 3000,
     environment: process.env.NODE_ENV || "development",
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
   });
   ```

4. **Update App Module with Validation**
   ```typescript
   @Module({
     imports: [
       ConfigModule.forRoot({
         isGlobal: true,
         load: [configuration],
         validationSchema,
         envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
       }),
       // ... other modules
     ],
   })
   export class AppModule {}
   ```

### Deliverables

- Environment files for all environments
- Configuration validation schema
- Typed configuration service
- Environment-specific database configurations

---

## Task 6: Basic Security & Middleware Setup

**Estimated Time:** 2 hours  
**Priority:** High

### Description

Configure essential security middleware, CORS, rate limiting, and request validation.

### Acceptance Criteria

- [ ] Helmet security middleware configured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Global validation pipe setup
- [ ] Basic security headers applied

### Implementation Steps

1. **Configure Security Middleware**

   ```typescript
   // src/main.ts
   import { NestFactory } from "@nestjs/core";
   import { ValidationPipe } from "@nestjs/common";
   import { AppModule } from "./app.module";
   import * as helmet from "helmet";
   import * as compression from "compression";
   import * as rateLimit from "express-rate-limit";

   async function bootstrap() {
     const app = await NestFactory.create(AppModule);

     // Security
     app.use(helmet());

     // CORS
     app.enableCors({
       origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
       credentials: true,
       methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
       allowedHeaders: "Content-Type,Authorization",
     });

     // Compression
     app.use(compression());

     // Rate limiting
     app.use(
       rateLimit({
         windowMs: 15 * 60 * 1000, // 15 minutes
         max: 100, // limit each IP to 100 requests per windowMs
         message: "Too many requests from this IP",
       })
     );

     // Global validation pipe
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

     const port = process.env.PORT || 3000;
     await app.listen(port);
     console.log(`Application is running on: http://localhost:${port}`);
   }
   bootstrap();
   ```

2. **Create Global Exception Filter**

   ```typescript
   // src/common/filters/http-exception.filter.ts
   import {
     ExceptionFilter,
     Catch,
     ArgumentsHost,
     HttpException,
     HttpStatus,
   } from "@nestjs/common";
   import { Response, Request } from "express";

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
   ```

3. **Create Response Interceptor**

   ```typescript
   // src/common/interceptors/response.interceptor.ts
   import {
     Injectable,
     NestInterceptor,
     ExecutionContext,
     CallHandler,
   } from "@nestjs/common";
   import { Observable } from "rxjs";
   import { map } from "rxjs/operators";

   @Injectable()
   export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
     intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
       return next.handle().pipe(
         map((data) => ({
           success: true,
           data,
           timestamp: new Date().toISOString(),
         }))
       );
     }
   }
   ```

### Deliverables

- Configured security middleware
- Global exception filter
- Response interceptor
- Rate limiting setup
- CORS configuration

---

## Task 7: Basic API Documentation Setup

**Estimated Time:** 1.5 hours  
**Priority:** Medium

### Description

Configure Swagger/OpenAPI documentation with basic setup and standardized responses.

### Acceptance Criteria

- [ ] Swagger UI accessible at /api/docs
- [ ] Basic API documentation structure
- [ ] Common response schemas defined
- [ ] API versioning setup
- [ ] Authentication documentation prepared

### Implementation Steps

1. **Configure Swagger in main.ts**

   ```typescript
   import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

   async function bootstrap() {
     const app = await NestFactory.create(AppModule);

     // ... other middleware

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

     await app.listen(port);
   }
   ```

2. **Create Common DTO Classes**

   ```typescript
   // src/common/dto/pagination.dto.ts
   import { IsOptional, IsInt, Min, Max } from "class-validator";
   import { Type } from "class-transformer";
   import { ApiPropertyOptional } from "@nestjs/swagger";

   export class PaginationDto {
     @ApiPropertyOptional({ default: 1, minimum: 1 })
     @IsOptional()
     @Type(() => Number)
     @IsInt()
     @Min(1)
     page: number = 1;

     @ApiPropertyOptional({ default: 25, minimum: 1, maximum: 100 })
     @IsOptional()
     @Type(() => Number)
     @IsInt()
     @Min(1)
     @Max(100)
     limit: number = 25;
   }
   ```

3. **Create Response Schema Decorators**

   ```typescript
   // src/common/decorators/api-paginated-response.decorator.ts
   import { applyDecorators, Type } from "@nestjs/common";
   import { ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

   export const ApiPaginatedResponse = <TModel extends Type<any>>(
     model: TModel
   ) => {
     return applyDecorators(
       ApiOkResponse({
         schema: {
           allOf: [
             {
               properties: {
                 success: { type: "boolean", example: true },
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
                 timestamp: { type: "string", format: "date-time" },
               },
             },
           ],
         },
       })
     );
   };
   ```

### Deliverables

- Working Swagger UI at /api/docs
- Basic API documentation structure
- Common DTO classes
- Response decorators
- API tags and basic schema

---

## Task 8: Testing Infrastructure Setup

**Estimated Time:** 2 hours  
**Priority:** Medium

### Description

Configure Jest testing environment with unit, integration, and e2e test structure.

### Acceptance Criteria

- [ ] Jest configured for unit tests
- [ ] Integration test setup ready
- [ ] E2E test environment configured
- [ ] Test database configuration
- [ ] Basic test examples working

### Implementation Steps

1. **Configure Jest for Different Test Types**

   ```json
   // jest.config.js
   module.exports = {
     moduleFileExtensions: ['js', 'json', 'ts'],
     rootDir: 'src',
     testRegex: '.*\\.spec\\.ts$',
     transform: {
       '^.+\\.(t|j)s$': 'ts-jest',
     },
     collectCoverageFrom: [
       '**/*.(t|j)s',
       '!**/*.spec.ts',
       '!**/*.interface.ts',
       '!**/node_modules/**',
     ],
     coverageDirectory: '../coverage',
     testEnvironment: 'node',
     moduleNameMapping: {
       '^src/(.*)$': '<rootDir>/$1',
     },
   };
   ```

2. **Create Test Utilities**

   ```typescript
   // test/utils/test-utils.ts
   import { Test, TestingModule } from "@nestjs/testing";
   import { TypeOrmModule } from "@nestjs/typeorm";
   import { ConfigModule } from "@nestjs/config";

   export const createTestingModule = async (moduleMetadata: any) => {
     return await Test.createTestingModule({
       imports: [
         ConfigModule.forRoot({
           isGlobal: true,
           envFilePath: ".env.test",
         }),
         TypeOrmModule.forRoot({
           type: "sqlite",
           database: ":memory:",
           entities: [__dirname + "/../../src/**/*.entity{.ts,.js}"],
           synchronize: true,
         }),
         ...moduleMetadata.imports,
       ],
       controllers: moduleMetadata.controllers,
       providers: moduleMetadata.providers,
     }).compile();
   };
   ```

3. **Setup Package.json Scripts**

   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:cov": "jest --coverage",
       "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
       "test:e2e": "jest --config ./test/jest-e2e.json",
       "test:integration": "jest --config ./test/jest-integration.json"
     }
   }
   ```

4. **Create Basic Test Examples**

   ```typescript
   // src/app.controller.spec.ts
   import { Test, TestingModule } from "@nestjs/testing";
   import { AppController } from "./app.controller";
   import { AppService } from "./app.service";

   describe("AppController", () => {
     let appController: AppController;

     beforeEach(async () => {
       const app: TestingModule = await Test.createTestingModule({
         controllers: [AppController],
         providers: [AppService],
       }).compile();

       appController = app.get<AppController>(AppController);
     });

     describe("root", () => {
       it('should return "Hello World!"', () => {
         expect(appController.getHello()).toBe("Hello World!");
       });
     });
   });
   ```

### Deliverables

- Jest configuration for all test types
- Test utilities and helpers
- Package.json test scripts
- Basic test examples
- Test environment configuration

---

## Phase 1 Completion Checklist

### Technical Deliverables

- [ ] NestJS project with TypeScript successfully created
- [ ] All dependencies installed and configured
- [ ] Strict TypeScript configuration applied
- [ ] ESLint and Prettier working
- [ ] Feature-based folder structure implemented
- [ ] Database connection with TypeORM configured
- [ ] Environment configuration with validation
- [ ] Security middleware and CORS setup
- [ ] Global exception handling and response formatting
- [ ] Swagger API documentation accessible
- [ ] Testing infrastructure configured

### Quality Assurance

- [ ] Project builds without errors
- [ ] Development server starts successfully
- [ ] Hot reload functionality working
- [ ] No TypeScript or ESLint errors
- [ ] Database connection test successful
- [ ] Environment variables loading correctly
- [ ] Basic tests passing
- [ ] Swagger UI accessible and functional

### Documentation

- [ ] README.md with setup instructions
- [ ] Environment variables documented
- [ ] API documentation structure ready
- [ ] Development guidelines established

### Next Phase Preparation

- [ ] Database models ready for implementation
- [ ] Authentication module structure prepared
- [ ] Core entities architecture planned
- [ ] Migration strategy documented

---

## Risk Mitigation

### Potential Issues & Solutions

1. **Database Connection Issues**

   - Solution: Verify MySQL installation, check credentials, use Docker if needed

2. **TypeScript Configuration Problems**

   - Solution: Use provided strict configuration, verify all type definitions

3. **Environment Variable Loading**

   - Solution: Verify file naming, check ConfigModule setup, validate schema

4. **Security Middleware Conflicts**
   - Solution: Test each middleware individually, check order of application

### Dependencies for Next Phase

- Working database connection
- Base project structure
- Configuration system
- Security foundation
- Testing infrastructure

This completes the infrastructure foundation needed for Phase 2: Authentication & User Management implementation.
