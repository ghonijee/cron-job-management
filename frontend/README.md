# Cron Jobs Management System - Frontend

A modern React application for managing cron jobs with a clean, type-safe architecture.

## 🛠️ Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript 5.8** - Type-safe development
- **Vite 6** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **ESLint & Prettier** - Code quality and formatting

## 🏗️ Architecture

This project follows a **feature-based architecture** for better maintainability and scalability:

```
src/
├── components/          # Reusable UI components
│   ├── shared/         # Common components (Button, Input, Modal)
│   ├── auth/           # Authentication components
│   ├── category/       # Category management components
│   ├── job/            # Job management components
│   ├── history/        # History viewing components
│   └── dashboard/      # Dashboard components
├── hooks/              # Custom React hooks (organized by feature)
├── services/           # API services and business logic
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── pages/              # Route components
└── routes/             # Route constants and configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🌍 Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Application Configuration  
VITE_APP_NAME=Cron Jobs Management
VITE_APP_VERSION=1.0.0

# Development Configuration
VITE_ENABLE_MOCK_API=true
```

## 🛡️ Code Quality

### ESLint Configuration
- TypeScript ESLint rules
- React hooks rules
- Prettier integration
- Custom rules for unused variables and dependencies

### Prettier Configuration
- Single quotes
- 2-space indentation
- 80 character line width
- Trailing commas for ES5

## 🧭 Routing

The application uses React Router with the following routes:

- `/` - Dashboard (main page)
- `/auth/login` - User authentication
- `/categories` - Category management
- `/jobs` - Cron job management
- `/history` - Execution history
- `*` - 404 Not Found page

## 📁 Path Aliases

Configured path aliases for clean imports:

```typescript
import { Button } from '@/components/shared';
import { useAuth } from '@/hooks/auth';
import { JobService } from '@/services/job';
import { Job } from '@/types/job';
import { formatDate } from '@/utils/shared';
```

## 🔧 Development Guidelines

### Component Creation
- Use functional components with TypeScript
- Follow the feature-based folder structure
- Export components from barrel files (`index.ts`)
- Use Tailwind CSS for styling

### State Management
- Use React hooks for local state
- Custom hooks for shared logic
- Context API for global state (when needed)

### Type Safety
- Define interfaces in `types/` folders
- Use strict TypeScript configuration
- Leverage type inference where possible

### Code Style
- Follow ESLint and Prettier configurations
- Use descriptive variable and function names
- Write self-documenting code
- Add comments for complex logic

## 🚀 Build & Deployment

### Production Build
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Build Analysis
- Build size: ~225KB (gzipped: ~72KB)
- CSS size: ~2.4KB (gzipped: ~0.7KB)
- Optimized for modern browsers

## 🏆 Phase 1 Completion Status

✅ **Completed Tasks:**
- [x] Vite + React + TypeScript project initialization
- [x] Tailwind CSS configuration
- [x] ESLint and Prettier setup
- [x] Feature-based folder structure with path aliases
- [x] React Router configuration
- [x] Environment variables setup
- [x] Placeholder pages for all routes
- [x] Build process verification
- [x] Code quality verification
- [x] Project documentation

**Success Metrics:**
- ✅ Development server starts in < 10 seconds
- ✅ 0 ESLint errors/warnings
- ✅ 0 TypeScript errors
- ✅ All planned folders and files created
- ✅ Clean, well-documented setup

## 🔄 Next Steps (Phase 2)

Ready to proceed to **Phase 2: Shared Components Library**
- Design system implementation
- Reusable UI components
- Component documentation
- Storybook integration (optional)

## 🤝 Contributing

1. Follow the established folder structure
2. Run linting and formatting before commits
3. Ensure all TypeScript types are properly defined
4. Test new components and features
5. Update documentation as needed

## 📄 License

This project is part of the Cron Jobs Management System.