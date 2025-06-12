# Overview

Aplikasi web/frontend cron-jobs-management for execute jobs call endpoint scheduled by cron. This project is frontend only, backend will be communicate with endpoint by API.

# Feature

1. Login
   1.1 Using email & Password
   1.2 without register, admin only for manage user
   1.3 rember login session
2. CRUD Category Jobs
   2.1 List category (name, color, desc, jumlah jobs, status)
   2.2 Seacrh by name
   2.3 Filter by status, color, and jumlah cron jobs
   2.4 Simple analytic/statistics for summary info category cron
3. CRUD Cron Jobs
   3.1 List Jobs (name, category, cron pattern, status)
   3.2 Search by name
   3.3 Filter by status, cron pattern, category, status
   3.4 Toggle active/inactive status
   3.5 Create jobs (name, desc, category, cron pattern, status, URL, HTTP Method, body, custom headers, auth, timeout, retry, retry delay)
   3.6 Update jobs (name, desc, category, cron pattern, status, URL, HTTP Method, body, custom headers, auth, timeout, retry, retry delay)
   3.7 Delete jobs
   3.8 Manual trigger jobs
   3.9 Action to redirect show History execution selected jobs
   3.10 Show detail jobs
   3.11 Basic summary analytic/statistics for each jobs (percentage success, percentage failed, total request)
   3.12 Add cron pattern validation for create/edit jobs, cron pattern must be valid
4. READ History execution Jobs
   4.1 List history execution jobs (jobs name, status, start time, end time, response time, response status, response body)
   4.2 Search by name
   4.3 filter by cron jobs id, category, status, start time, end time
   4.4 Show detail jobs execution history
5. Dashboard
   5.1 Show summary info category cron jobs
   5.2 Show summary info all jobs
   5.3 last execution jobs
