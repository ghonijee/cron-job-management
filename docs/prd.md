# Product Requirements Document: Cron Jobs Management

## PRD Metadata

- **Document Version**: 1.0.0
- **Created Date**: 2025-06-18
- **Last Updated**: 2025-06-19
- **Status**: Draft
- **Product Owner**: Ahmad Yunus Afghoni
- **Target Release**: Q3 2025
- **Priority**: High

## Product Definition

### Product Name

Cron Jobs Management System

### Product Description

A comprehensive web application for managing, monitoring, and executing scheduled HTTP endpoint calls through cron jobs. The system provides a user-friendly interface for creating, editing, and monitoring automated tasks with detailed execution history and analytics.

### Target Users

- **Primary**: DevOps Engineers, System Administrators, Backend Developers
- **Secondary**: Technical Project Managers, Site Reliability Engineers
- **Personas**:
  - **Alex (DevOps Engineer)**: Manages multiple microservices and needs automated health checks
  - **Sarah (System Admin)**: Monitors system maintenance tasks and cleanup jobs
  - **Mike (Backend Developer)**: Creates automated data synchronization tasks

### Platform

- **Primary**: Web Application (Desktop Browser)
- **Responsive**: Mobile-friendly for monitoring on-the-go
- **Architecture**: Full-stack separation (Frontend + Backend API)

## Feature Overview

### F-001: Authentication & Authorization

**Business Value**: Secure access control and user session management
**Priority**: High
**Complexity**: Medium
**Dependencies**: None
**Related User Stories**: US-001, US-002, US-003, US-004, US-005

### F-002: Category Management

**Business Value**: Organize cron jobs into logical groups for better management
**Priority**: Medium
**Complexity**: Simple
**Dependencies**: F-001
**Related User Stories**: US-006, US-007, US-008, US-009, US-010

### F-003: Cron Jobs Management

**Business Value**: Core functionality for creating and managing scheduled tasks
**Priority**: High
**Complexity**: Complex
**Dependencies**: F-001, F-002
**Related User Stories**: US-011 to US-023

### F-004: Execution History & Monitoring

**Business Value**: Track job performance and troubleshoot issues
**Priority**: High
**Complexity**: Medium
**Dependencies**: F-003
**Related User Stories**: US-024, US-025, US-026, US-027

### F-005: Dashboard & Analytics

**Business Value**: Provide overview and insights for decision making
**Priority**: Medium
**Complexity**: Medium
**Dependencies**: F-002, F-003, F-004
**Related User Stories**: US-028, US-029, US-030

## Technical Specifications

### Frontend Tech Stack

- **Framework**: React 18+ with TypeScript
- **Routing**: TanStack Start (TanStack Router)
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **State Management**: TanStack Query (React Query)
- **Build Tool**: Vite
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Date/Time**: date-fns
- **Cron Expression**: cron-parser library

### Backend Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MySQL 8.0+
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Validation**: Class-validator
- **Scheduling**: node-cron
- **HTTP Client**: Axios
- **Logging**: Winston

### Architecture Patterns

- **Frontend**: Component-based architecture with custom hooks
- **Backend**: Modular architecture with dependency injection
- **API**: RESTful API with OpenAPI documentation
- **Database**: Normalized relational design
- **Security**: JWT-based authentication with refresh tokens
- **Scheduling**: Event-driven job registration with node-cron

### Job Scheduler Implementation

#### Core Components
- **JobRegistryService**: Manages in-memory job references and node-cron instances
- **JobSchedulerService**: Handles job registration, deregistration, and lifecycle
- **JobExecutorService**: Executes HTTP requests and handles retries
- **ExecutionLoggerService**: Tracks execution history and performance metrics

#### Job Registry Structure
```typescript
interface JobRegistry {
  [jobId: string]: {
    task: cron.ScheduledTask;
    job: CronJob;
    isRunning: boolean;
  };
}
```

#### Lifecycle Events
- **onApplicationBootstrap**: Load and register all active jobs
- **onJobCreate**: Register new active jobs immediately
- **onJobUpdate**: Destroy old task, register updated job if active
- **onJobDelete**: Clean up scheduled task and registry entry
- **onJobToggle**: Register/deregister based on status change

## User Stories

### Epic 1: Authentication & User Management

#### US-001: User Login

**As a** system administrator  
**I want to** log in with email and password  
**So that** I can securely access the cron job management system

**Acceptance Criteria**:

- User can enter email and password
- System validates credentials against database
- On success, JWT token is generated and stored in localStorage
- User is redirected to dashboard
- Invalid credentials show appropriate error message
- Login form has proper validation (email format, required fields)

**Priority**: High | **Effort**: 3 points | **Dependencies**: None

#### US-002: Remember Login Session

**As a** user  
**I want to** stay logged in across browser sessions  
**So that** I don't have to enter credentials repeatedly

**Acceptance Criteria**:

- JWT token persists in localStorage
- System validates token on app initialization
- Expired tokens trigger automatic logout
- Invalid tokens are cleared from storage

**Priority**: High | **Effort**: 2 points | **Dependencies**: US-001

#### US-003: Token Refresh

**As a** user  
**I want to** have my session automatically renewed  
**So that** I don't get logged out while actively using the system

**Acceptance Criteria**:

- Refresh token is issued alongside access token
- System automatically refreshes tokens before expiration
- Failed refresh attempts trigger logout
- Refresh happens transparently without user intervention

**Priority**: Medium | **Effort**: 5 points | **Dependencies**: US-001

#### US-004: User Logout

**As a** user  
**I want to** log out of the system  
**So that** I can secure my session when finished

**Acceptance Criteria**:

- Logout button is accessible from navigation
- Tokens are cleared from localStorage
- User is redirected to login page
- Server-side token invalidation (optional)

**Priority**: Medium | **Effort**: 2 points | **Dependencies**: US-001

### Epic 2: Category Management

#### US-005: List Categories

**As a** administrator  
**I want to** view all job categories  
**So that** I can understand how jobs are organized

**Acceptance Criteria**:

- Display categories in table/card format
- Show name, color, description, job count, and status
- Implement pagination for large datasets
- Loading states and error handling
- Empty state when no categories exist

**Priority**: Medium | **Effort**: 3 points | **Dependencies**: US-001

#### US-006: Search Categories

**As a** user  
**I want to** search categories by name  
**So that** I can quickly find specific categories

**Acceptance Criteria**:

- Search input with real-time filtering
- Case-insensitive search
- Search results update as user types
- Clear search functionality
- No results state

**Priority**: Low | **Effort**: 2 points | **Dependencies**: US-005

#### US-007: Filter Categories

**As a** user  
**I want to** filter categories by status, color, and job count  
**So that** I can view categories that meet specific criteria

**Acceptance Criteria**:

- Multi-select filter for status (active/inactive)
- Color picker/selector for color filtering
- Range filter for job count
- Combined filters work together
- Filter reset functionality

**Priority**: Low | **Effort**: 3 points | **Dependencies**: US-005

#### US-008: Create/Edit Category

**As a** administrator  
**I want to** create and edit job categories  
**So that** I can organize cron jobs logically

**Acceptance Criteria**:

- Form with name, color, description, and status fields
- Name validation (required, unique)
- Color picker component
- Status toggle (active/inactive)
- Form validation and error messages
- Optimistic updates

**Priority**: Medium | **Effort**: 4 points | **Dependencies**: US-005

#### US-009: Delete Category

**As a** administrator  
**I want to** delete categories that are no longer needed  
**So that** I can keep the system organized

**Acceptance Criteria**:

- Delete confirmation dialog
- Prevent deletion if category has active jobs
- Cascade deletion handling for inactive jobs (optional)
- Success/error feedback

**Priority**: Low | **Effort**: 2 points | **Dependencies**: US-005

#### US-010: Category Analytics

**As a** user  
**I want to** see basic statistics for categories  
**So that** I can understand category usage patterns

**Acceptance Criteria**:

- Show total number of jobs per category
- Display active vs inactive job ratio
- Success rate aggregation per category
- Visual indicators (charts/graphs)

**Priority**: Low | **Effort**: 3 points | **Dependencies**: US-005

### Epic 3: Cron Jobs Management

#### US-011: List Cron Jobs

**As a** user  
**I want to** view all cron jobs  
**So that** I can monitor and manage scheduled tasks

**Acceptance Criteria**:

- Display jobs in table format
- Show name, category, cron pattern, status, last execution
- Sortable columns
- Pagination with configurable page size
- Loading and error states

**Priority**: High | **Effort**: 4 points | **Dependencies**: US-001, US-005

#### US-012: Search Cron Jobs

**As a** user  
**I want to** search jobs by name  
**So that** I can quickly locate specific jobs

**Acceptance Criteria**:

- Real-time search with debouncing
- Search across job names and descriptions
- Highlight search terms in results
- Search history/suggestions (optional)

**Priority**: Medium | **Effort**: 2 points | **Dependencies**: US-011

#### US-013: Filter Cron Jobs

**As a** user  
**I want to** filter jobs by various criteria  
**So that** I can focus on relevant jobs

**Acceptance Criteria**:

- Filter by status (active/inactive/running)
- Filter by category
- Filter by cron pattern complexity
- Date range filter for last execution
- Filter persistence across sessions

**Priority**: Medium | **Effort**: 4 points | **Dependencies**: US-011

#### US-014: Toggle Job Status

**As a** user  
**I want to** quickly enable/disable jobs  
**So that** I can control job execution without full editing

**Acceptance Criteria**:

- Toggle switch in job list
- Immediate status change with optimistic updates
- Confirmation for status changes
- Visual feedback for current status

**Priority**: High | **Effort**: 2 points | **Dependencies**: US-011

#### US-015: Create Cron Job

**As a** administrator  
**I want to** create new scheduled jobs  
**So that** I can automate endpoint calls

**Acceptance Criteria**:

- Comprehensive form with all job fields
- Cron pattern builder/validator
- HTTP method selection (GET, POST, PUT, DELETE)
- URL validation
- Custom headers editor (key-value pairs)
- Authentication options (none, basic, bearer)
- Request body editor with JSON validation
- Timeout and retry configuration
- Category selection
- Form validation with helpful error messages

**Priority**: High | **Effort**: 8 points | **Dependencies**: US-008

#### US-016: Edit Cron Job

**As a** administrator  
**I want to** modify existing jobs  
**So that** I can update job configurations as requirements change

**Acceptance Criteria**:

- Pre-populated form with current job data
- All fields editable except creation timestamp
- Validation same as create form
- Change tracking and confirmation
- Optimistic updates with rollback on error

**Priority**: High | **Effort**: 6 points | **Dependencies**: US-015

#### US-017: Delete Cron Job

**As a** administrator  
**I want to** remove jobs that are no longer needed  
**So that** I can keep the system clean

**Acceptance Criteria**:

- Confirmation dialog with job details
- Option to stop running job before deletion
- Cascade deletion of execution history (optional)
- Soft delete option for audit purposes

**Priority**: Medium | **Effort**: 2 points | **Dependencies**: US-011

#### US-018: Manual Job Trigger

**As a** user  
**I want to** manually execute jobs  
**So that** I can test jobs or run them outside their schedule

**Acceptance Criteria**:

- Trigger button in job list and detail view
- Execution starts immediately
- Real-time status updates
- Result display after completion
- Prevent multiple simultaneous executions

**Priority**: High | **Effort**: 4 points | **Dependencies**: US-011

#### US-019: View Job Details

**As a** user  
**I want to** see complete job information  
**So that** I can understand job configuration and performance

**Acceptance Criteria**:

- Dedicated job detail page
- Display all job configuration
- Show execution statistics
- Recent execution history
- Edit and delete actions available

**Priority**: Medium | **Effort**: 3 points | **Dependencies**: US-011

#### US-020: Job Analytics

**As a** user  
**I want to** see job performance metrics  
**So that** I can monitor job health and reliability

**Acceptance Criteria**:

- Success/failure percentage
- Average response time
- Total executions count
- Last 30 days execution trend
- Error rate analysis

**Priority**: Medium | **Effort**: 4 points | **Dependencies**: US-011

#### US-021: Cron Pattern Validation

**As a** administrator  
**I want to** validate cron patterns  
**So that** I can ensure jobs will run as expected

**Acceptance Criteria**:

- Real-time validation of cron expressions
- Visual feedback for valid/invalid patterns
- Next execution time preview
- Common pattern suggestions
- Human-readable pattern description

**Priority**: High | **Effort**: 3 points | **Dependencies**: US-015

### Epic 4: Execution History & Monitoring

#### US-022: List Execution History

**As a** user  
**I want to** view job execution history  
**So that** I can monitor job performance and troubleshoot issues

**Acceptance Criteria**:

- Chronological list of executions
- Show job name, status, start/end time, response time
- Status indicators (success, failure, timeout)
- Pagination for large histories
- Filter by date range and status

**Priority**: High | **Effort**: 4 points | **Dependencies**: US-011

#### US-023: Search Execution History

**As a** user  
**I want to** search execution history  
**So that** I can find specific execution records

**Acceptance Criteria**:

- Search by job name
- Filter by execution status
- Date range filtering
- Response status code filtering
- Combined search criteria

**Priority**: Medium | **Effort**: 3 points | **Dependencies**: US-022

#### US-024: View Execution Details

**As a** user  
**I want to** see detailed execution information  
**So that** I can debug failed jobs and understand responses

**Acceptance Criteria**:

- Complete request details (URL, headers, body)
- Full response details (status, headers, body)
- Execution timeline and duration
- Error messages and stack traces
- Retry attempt information

**Priority**: High | **Effort**: 3 points | **Dependencies**: US-022

### Epic 5: Dashboard & Analytics

#### US-025: System Dashboard

**As a** user  
**I want to** see an overview of the system  
**So that** I can quickly assess system health

**Acceptance Criteria**:

- Total jobs count (active/inactive)
- Recent execution summary
- System status indicators
- Quick access to common actions
- Responsive design for mobile viewing

**Priority**: Medium | **Effort**: 4 points | **Dependencies**: US-011, US-022

#### US-026: Category Summary

**As a** user  
**I want to** see category statistics on dashboard  
**So that** I can understand job distribution

**Acceptance Criteria**:

- Jobs count per category
- Success rates by category
- Visual charts/graphs
- Drill-down to category details

**Priority**: Low | **Effort**: 3 points | **Dependencies**: US-025

#### US-027: Recent Executions Widget

**As a** user  
**I want to** see recent job executions  
**So that** I can quickly spot issues

**Acceptance Criteria**:

- Last 10-20 executions
- Status indicators
- Quick links to job details
- Real-time updates (optional)

**Priority**: Medium | **Effort**: 3 points | **Dependencies**: US-025

## Task Breakdown

### Epic 1 Tasks (Authentication)

- **T-001**: Setup authentication module (NestJS + Passport) - 5 points
- **T-002**: Implement JWT token service - 3 points
- **T-003**: Create login API endpoint - 2 points
- **T-004**: Design login form component - 2 points
- **T-005**: Implement login flow with token storage - 3 points
- **T-006**: Add token refresh mechanism - 5 points
- **T-007**: Implement logout functionality - 2 points

### Epic 2 Tasks (Categories)

- **T-008**: Create Category entity and database schema - 2 points
- **T-009**: Build Category CRUD API endpoints - 4 points
- **T-010**: Implement category list component - 3 points
- **T-011**: Add search and filter functionality - 3 points
- **T-012**: Create category form component - 3 points
- **T-013**: Add category analytics calculations - 2 points

### Epic 3 Tasks (Cron Jobs)

- **T-014**: Create CronJob entity with all fields - 3 points
- **T-015**: Implement cron job CRUD API - 6 points
- **T-016**: Setup node-cron job registration service - 5 points
- **T-017**: Build job execution engine - 8 points
- **T-018**: Create job list component - 4 points
- **T-019**: Implement job form with validation - 8 points
- **T-020**: Add cron pattern validator - 3 points
- **T-021**: Build manual trigger functionality - 3 points
- **T-022**: Create job details view - 3 points
- **T-023**: Implement job analytics - 4 points

### Epic 4 Tasks (Execution History)

- **T-024**: Create ExecutionHistory entity - 2 points
- **T-025**: Build execution logging service - 4 points
- **T-026**: Implement history API endpoints - 3 points
- **T-027**: Create execution history components - 4 points
- **T-028**: Add execution detail modal - 3 points

### Epic 5 Tasks (Dashboard)

- **T-029**: Design dashboard layout - 2 points
- **T-030**: Implement dashboard API - 3 points
- **T-031**: Create dashboard components - 4 points
- **T-032**: Add analytics charts - 3 points

### Infrastructure Tasks

- **T-033**: Setup database migrations - 2 points
- **T-034**: Configure environment variables - 1 point
- **T-035**: Setup API documentation (Swagger) - 2 points
- **T-036**: Implement error handling middleware - 2 points
- **T-037**: Add logging and monitoring - 3 points
- **T-038**: Setup CI/CD pipeline - 5 points
- **T-039**: Configure production deployment - 3 points

## Data Flow & Business Logic

### Core Entities

#### User

```typescript
interface User {
  id: string;
  email: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}
```

#### Category

```typescript
interface Category {
  id: string;
  name: string;
  description?: string;
  color: string; // hex color
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
  jobs: CronJob[];
}
```

#### CronJob

```typescript
interface CronJob {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  cronPattern: string;
  status: "active" | "inactive";
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: string;
  authType: "none" | "basic" | "bearer";
  authConfig?: AuthConfig;
  timeout: number; // milliseconds
  retryCount: number;
  retryDelay: number; // milliseconds
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  executions: ExecutionHistory[];
}
```

#### ExecutionHistory

```typescript
interface ExecutionHistory {
  id: string;
  cronJobId: string;
  status: "success" | "failure" | "timeout" | "running";
  startTime: Date;
  endTime?: Date;
  responseTime?: number; // milliseconds
  responseStatus?: number; // HTTP status
  responseHeaders?: Record<string, string>;
  responseBody?: string;
  errorMessage?: string;
  retryAttempt: number;
  triggeredBy: "schedule" | "manual";
  cronJob: CronJob;
}
```

### Business Rules

1. **Authentication**:

   - JWT tokens expire after 1 hour
   - Refresh tokens expire after 7 days
   - Failed login attempts are logged

2. **Categories**:

   - Category names must be unique
   - Cannot delete categories with active jobs
   - Color must be valid hex code

3. **Cron Jobs**:

   - Cron patterns must be valid (validated using cron-parser)
   - URLs must be valid HTTP/HTTPS endpoints
   - Timeout must be between 1 second and 5 minutes
   - Retry count cannot exceed 5
   - Jobs in 'inactive' status are not executed

4. **Execution**:
   - Only one execution per job can run simultaneously
   - Failed executions are retried based on job configuration
   - Execution history is kept for 90 days by default
   - Manual triggers bypass schedule validation

### Workflow Diagrams

#### Job Execution Flow (using node-cron)

1. **Application Startup**:
   - Load all active jobs from database
   - Register each job with node-cron scheduler
   - Store job references in memory for management

2. **Job Creation**:
   - Validate cron pattern and job configuration
   - Save job to database
   - If status is 'active', immediately register with node-cron
   - Store job reference for future management

3. **Job Update**:
   - Update job in database
   - Destroy existing scheduled task if exists
   - If new status is 'active', register updated job with node-cron
   - If new status is 'inactive', remove from scheduler

4. **Job Deletion**:
   - Destroy scheduled task from node-cron
   - Remove job reference from memory
   - Delete job from database

5. **Job Execution Trigger**:
   - node-cron triggers job at scheduled time
   - Check if previous execution is still running
   - Create execution record with 'running' status
   - Execute HTTP request with configured parameters
   - Handle response/error and retry logic
   - Update execution record with final status

6. **Job Status Toggle**:
   - Update job status in database
   - If toggled to 'active': register with node-cron
   - If toggled to 'inactive': destroy scheduled task

#### Authentication Flow

1. User submits login credentials
2. System validates credentials
3. Generate JWT access token (1h) and refresh token (7d)
4. Store tokens in localStorage
5. Include access token in API requests
6. Auto-refresh tokens before expiration

## UI/UX Guidelines

### Design System

#### Color Palette

- **Primary**: #3B82F6 (Blue-500)
- **Secondary**: #10B981 (Emerald-500)
- **Success**: #22C55E (Green-500)
- **Warning**: #F59E0B (Amber-500)
- **Error**: #EF4444 (Red-500)
- **Neutral**: #64748B (Slate-500)

#### Typography

- **Headers**: Inter, Bold
- **Body**: Inter, Regular
- **Code**: JetBrains Mono, Regular

#### Component Library

##### Buttons

- Primary: Solid with primary color
- Secondary: Outline with primary color
- Destructive: Solid with error color
- Ghost: Transparent with hover effect

##### Forms

- Input fields with focus states
- Validation messages below fields
- Required field indicators
- Helper text for complex fields

##### Data Tables

- Sortable headers
- Pagination controls
- Loading skeletons
- Empty states
- Action buttons in rows

##### Status Indicators

- Success: Green dot + "Active"
- Error: Red dot + "Failed"
- Warning: Yellow dot + "Inactive"
- Info: Blue dot + "Running"

### Responsive Design

- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Collapsible sidebar on mobile
- Responsive tables with horizontal scroll
- Touch-friendly button sizes

## AI Collaboration Configuration

### Agent Behavior Settings

```yaml
autonomy_level: "supervised"
task_complexity_threshold: "medium"
escalation_triggers:
  - breaking_changes: true
  - security_concerns: true
  - architectural_decisions: true
  - external_dependencies: true

communication_protocol:
  progress_updates: "daily"
  blocker_notifications: "immediate"
  completion_confirmation: "required"

code_quality_standards:
  test_coverage_minimum: 80
  linting_compliance: "strict"
  documentation_required: true

approval_requirements:
  database_changes: true
  api_endpoint_changes: true
  security_implementations: true
  deployment_configurations: true
```

### Task Assignment Rules

- **Simple tasks** (1-3 points): Can be completed autonomously
- **Medium tasks** (4-6 points): Require human review before implementation
- **Complex tasks** (7+ points): Require human collaboration throughout

### Progress Reporting Format

```yaml
task_id: "T-XXX"
status: "in_progress|completed|blocked|needs_review"
completion_percentage: 0-100
time_spent: "Xh Ym"
blockers: []
questions: []
changes_made: []
tests_added: []
documentation_updated: boolean
```

### Error Handling & Escalation

- **Code compilation errors**: Attempt auto-fix, escalate if unresolved
- **Test failures**: Analyze and fix, escalate complex failures
- **Dependency conflicts**: Escalate immediately
- **Design ambiguities**: Request clarification from product owner

### Quality Assurance Checklist

- [ ] Code follows established patterns
- [ ] All functions have appropriate tests
- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Security best practices followed
- [ ] Documentation is complete and accurate
- [ ] UI components match design system
- [ ] Responsive design implemented

---

**Document Status**: Ready for Development
**Next Review Date**: 2025-07-18
**Approval Required**: Technical Lead, Product Owner
