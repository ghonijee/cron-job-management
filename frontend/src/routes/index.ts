export const ROUTES = {
  DASHBOARD: '/',
  LOGIN: '/auth/login',
  CATEGORIES: '/categories',
  JOBS: '/jobs',
  HISTORY: '/history',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
