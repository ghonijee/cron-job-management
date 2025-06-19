# **Cron Jobs Management**

# Overview

Application cron-jobs-management for execute jobs call endpoint scheduled by cron. This project is split frontend and backend, frontend will be communicate with backend by REST API.

# Feature

1. **Login**
   1. Using email & Password
   2. rember login session
   3. Store Token in localStorage (JWT)
   4. Refresh Token
   5. Logout
2. **CRUD Category Jobs**
   1. List category (name, color, desc, jumlah jobs, status)
   2. Seacrh by name
   3. Filter by status, color, and jumlah cron jobs
   4. Simple analytic/statistics for summary info category cron
3. **CRUD Cron Jobs**
   1. List Jobs (name, category, cron pattern, status)
   2. Search by name
   3. Filter by status, cron pattern, category, status
   4. Toggle active/inactive status
   5. Create jobs (name, desc, category, cron pattern, status, URL, HTTP Method, body, custom headers, auth, timeout, retry, retry delay)
   6. Update jobs (name, desc, category, cron pattern, status, URL, HTTP Method, body, custom headers, auth, timeout, retry, retry delay)
   7. Delete jobs
   8. Manual trigger jobs
   9. Action to redirect show History execution selected jobs
   10. Show detail jobs
   11. Basic summary analytic/statistics for each jobs (percentage success, percentage failed, total request)
   12. Add cron pattern validation for create/edit jobs, cron pattern must be valid
4. **READ History execution Jobs**
   1. List history execution jobs (jobs name, status, start time, end time, response time, response status, response body)
   2. Search by name
   3. filter by cron jobs id, category, status, start time, end time
   4. Show detail jobs execution history
5. **Dashboard**
   1. Show summary info category cron jobs
   2. Show summary info all jobs
   3. last execution jobs

# Tech Stack

## Frontend

- Typescript
- React
- [TanStack Start](https://tanstack.com/start/latest/docs/framework/react/overview) full-stack React framework powered by TanStack Router
- Vite
- TailwindCSS
- Axios
- TanStack Query

## Backend

- NodeJS
- TypeScript
- NestJS
- TypeORM
- MySQL
