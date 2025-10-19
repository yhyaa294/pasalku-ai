# Project Structure

## Root Directory Organization

```
pasalku-ai/
├── app/                    # Next.js 14 App Router pages
├── backend/                # FastAPI Python backend
├── components/             # React components
├── lib/                    # Utility libraries and configurations
├── public/                 # Static assets
├── docs/                   # Documentation
├── deployment/             # Deployment scripts and configs
├── scripts/                # Build and utility scripts
├── tests/                  # Test files
└── monitoring/             # Health checks and monitoring
```

## Frontend Structure (`app/` directory)

- **App Router**: Uses Next.js 14 App Router pattern
- **Route Groups**: Organized by feature (admin, analytics, chat, etc.)
- **Layout Files**: `layout.tsx` for shared layouts
- **Page Files**: `page.tsx` for route endpoints
- **API Routes**: `api/` directory for server-side API endpoints

## Components Organization

```
components/
├── ui/                     # shadcn/ui base components
├── chat/                   # Chat interface components
├── analytics/              # Dashboard and analytics
├── payments/               # Payment processing UI
├── konsultasi/             # Legal consultation components
├── monitoring/             # System monitoring components
└── [feature]/              # Feature-specific components
```

## Backend Structure (`backend/` directory)

```
backend/
├── core/                   # Core configuration and settings
├── models/                 # SQLAlchemy database models
├── schemas/                # Pydantic schemas for validation
├── routers/                # FastAPI route handlers
├── services/               # Business logic services
├── middleware/             # Custom middleware
├── alembic/                # Database migrations
├── tests/                  # Backend tests
├── app.py                  # Main FastAPI application
├── database.py             # Database connections
└── requirements.txt        # Python dependencies
```

## Key Configuration Files

- **`next.config.js`**: Next.js configuration with Sentry integration
- **`tailwind.config.js`**: TailwindCSS with custom theme and animations
- **`components.json`**: shadcn/ui configuration
- **`tsconfig.json`**: TypeScript configuration with path aliases
- **`package.json`**: Frontend dependencies and scripts
- **`backend/requirements.txt`**: Python dependencies

## Environment Files

- **`.env.local`**: Frontend environment variables
- **`backend/.env`**: Backend environment variables
- **`.env.example`**: Template for required environment variables

## Database Models Location

- **SQLAlchemy Models**: `backend/models/`
- **Pydantic Schemas**: `backend/schemas/`
- **Migrations**: `backend/alembic/versions/`

## API Router Organization

Each major feature has its own router in `backend/routers/`:
- `auth_updated.py` - Authentication
- `chat_updated.py` - Chat functionality
- `documents.py` - Document processing
- `advanced_ai.py` - AI services
- `knowledge_base.py` - Legal knowledge
- And 20+ other specialized routers

## Naming Conventions

- **Files**: kebab-case for components, snake_case for Python
- **Components**: PascalCase React components
- **API Routes**: RESTful naming with version prefix (`/api/v1/`)
- **Database Tables**: snake_case with descriptive names
- **Environment Variables**: UPPER_SNAKE_CASE

## Import Patterns

- **Frontend**: Use `@/` alias for root imports
- **Backend**: Relative imports within backend, absolute for external
- **Components**: Import from `@/components/ui` for base UI components

## File Organization Rules

1. Group related functionality together
2. Keep components close to where they're used
3. Separate business logic from UI components
4. Use index files for clean imports
5. Place shared utilities in `lib/` directory