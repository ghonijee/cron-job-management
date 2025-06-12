# CLAUDE.md - React TypeScript Rules (Small-Medium Projects)

## Project Setup

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: React hooks (useState, useReducer)
- **HTTP**: Native fetch or axios

## File Structure (Feature-Based)

```
src/
├── components/
│   ├── shared/           # Reusable across features
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── Layout/
│   ├── auth/            # Authentication feature
│   │   ├── LoginForm/
│   │   └── SignupForm/
│   └── user/            # User management feature
│       ├── UserCard/
│       └── UserProfile/
├── hooks/
│   ├── shared/          # useLocalStorage, useDebounce
│   ├── auth/           # useAuth, useLogin
│   └── user/           # useUser, useUserList
├── services/
│   ├── shared/         # baseApi, httpClient
│   ├── auth/          # authService
│   └── user/          # userService
├── types/
│   ├── shared/        # ApiResponse, BaseEntity
│   ├── auth/         # User, LoginData
│   └── user/         # UserProfile, UserSettings
├── utils/
│   ├── shared/       # formatDate, validation
│   └── [feature]/    # Feature-specific utilities
└── pages/           # Page components by feature
    ├── auth/
    ├── user/
    └── dashboard/
```

## Naming Rules

- Components: `UserCard.tsx` (PascalCase)
- Hooks: `useUser.ts` (camelCase with 'use')
- Files: `userService.ts` (camelCase)
- Types: `User`, `ApiResponse` (PascalCase)
- Folders: `user/`, `auth/` (lowercase)
- Feature folders: Group by domain/feature, use `shared/` for common code

## TypeScript Essentials

### Type Everything Important

```typescript
// Props
interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;
}

// API Response
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Avoid 'any' - use 'unknown' if needed
```

### Keep Types Simple

- Use `interface` for object shapes
- Use `type` for unions: `type Status = 'idle' | 'loading' | 'error'`
- Co-locate types with components when possible

## Component Best Practices

## Component Organization

### Feature-Based Structure

```typescript
// components/user/UserCard/UserCard.tsx
import { useState } from "react";
import { Button } from "@/components/shared/Button";
import type { User } from "@/types/user";

// components/shared/Button/Button.tsx - Reusable across features
interface ButtonProps {
  variant?: "primary" | "secondary";
  onClick: () => void;
  children: React.ReactNode;
}

// Each component folder can contain:
// - ComponentName.tsx (main component)
// - index.ts (barrel export)
// - types.ts (component-specific types)
// - ComponentName.test.tsx (tests)
```

### Import Patterns

```typescript
// From same feature
import { UserCard } from "../UserCard";

// From shared components
import { Button, Modal } from "@/components/shared";

// From other features (minimize this)
import { LoginForm } from "@/components/auth";
```

### Component Guidelines

- Keep components under 100 lines
- Use functional components only
- Extract logic to custom hooks when complex
- Use optional chaining: `user?.name`
- Default props in parameters: `{ size = 'md' }`

## Custom Hooks (Feature-Based)

```typescript
// hooks/user/useUser.ts
export const useUser = (id: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(id); // from services/user/
        setUser(userData);
      } catch (err) {
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return { user, loading, error };
};

// hooks/shared/useLocalStorage.ts - Shared across features
export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  // Implementation here
};
```

## State Management (Keep Simple)

### Local State

- `useState` for simple values
- `useReducer` only for complex state with multiple actions
- Keep state close to where it's used

### Global State (Only When Needed)

```typescript
// Simple context for small global state
const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({} as any);

// Use in provider
const [user, setUser] = useState<User | null>(null);
```

## API Services (Feature-Based)

```typescript
// services/user/userService.ts
import { apiClient } from "@/services/shared/apiClient";
import type { User, CreateUserData } from "@/types/user";

export const getUserById = async (id: string): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: CreateUserData): Promise<User> => {
  const response = await apiClient.post("/users", data);
  return response.data;
};

// services/shared/apiClient.ts - Shared HTTP client
export const apiClient = {
  get: async (url: string) => {
    const response = await fetch(`/api${url}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { data: await response.json() };
  },
  // post, put, delete methods...
};
```

## Error Handling (Practical)

```typescript
// Simple error handling in components
const UserProfile = ({ userId }: { userId: string }) => {
  const { user, loading, error } = useUser(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.name}</div>;
};
```

## Performance (When Needed)

### Only Optimize When You Have Problems

```typescript
// Use React.memo for expensive components
const ExpensiveList = React.memo(({ items }: { items: Item[] }) => {
  return (
    <div>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return items.filter((item) => item.active).length;
}, [items]);
```

## Code Quality (Essential Only)

### ESLint Basics

```json
{
  "extends": ["@typescript-eslint/recommended", "react-hooks/recommended"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "error"
  }
}
```

### Import Order (Feature-Based)

```typescript
// 1. React
import { useState, useEffect } from "react";
// 2. External libraries
import axios from "axios";
// 3. Shared components/hooks
import { Button } from "@/components/shared";
import { useLocalStorage } from "@/hooks/shared";
// 4. Same feature
import { UserCard } from "../UserCard";
import { useUser } from "@/hooks/user";
// 5. Types
import type { User } from "@/types/user";
```

## Testing (Minimal)

### Test What Matters

- Test custom hooks with important logic
- Test components with complex interactions
- Don't aim for coverage numbers, test behavior

```typescript
// Simple test example
test("should show user name", () => {
  render(<UserCard user={{ id: "1", name: "John" }} />);
  expect(screen.getByText("John")).toBeInTheDocument();
});
```

## Security Basics

- Validate user inputs
- Use HTTPS
- Don't store sensitive data in localStorage
- Sanitize data before rendering

## Quick Rules

### Do:

- ✅ Keep components small and focused
- ✅ Type props and important data
- ✅ Use custom hooks for reusable logic
- ✅ Handle loading and error states
- ✅ Use semantic HTML
- ✅ Use same standart API Response for all API calls

### Don't:

- ❌ Over-abstract early
- ❌ Create unnecessary folders
- ❌ Use classes for services
- ❌ Add error boundaries unless needed
- ❌ Optimize before you have performance issues

## Checklist Before Submit

- [ ] TypeScript errors resolved
- [ ] Component works as expected
- [ ] No console.logs left
- [ ] Proper error handling for API calls
- [ ] Accessible HTML elements used
