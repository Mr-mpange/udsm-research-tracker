# Contributing to UDSM Research Impact Dashboard

Thank you for your interest in contributing to the UDSM Research Impact Dashboard!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install` or `bun install`
3. Copy `.env.example` to `.env` and configure your Supabase credentials
4. Run the development server: `npm run dev`

## Code Style

- We use TypeScript for type safety
- Follow the existing code structure and naming conventions
- Use functional components with hooks
- Keep components small and focused
- Write meaningful commit messages

## Component Guidelines

### File Organization
- Place reusable UI components in `src/components/ui/`
- Place dashboard-specific components in `src/components/dashboard/`
- Keep business logic in `src/services/` or custom hooks in `src/hooks/`

### Naming Conventions
- Components: PascalCase (e.g., `JournalSearch.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useJournals.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)

### TypeScript
- Always define proper types/interfaces
- Avoid using `any` type
- Export types that might be reused

## Database Changes

- Create new migration files in `supabase/migrations/`
- Use descriptive migration names with timestamps
- Test migrations locally before pushing
- Document schema changes in migration comments

## Testing

- Write tests for critical business logic
- Run tests before submitting: `npm test`
- Ensure all tests pass

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear, descriptive commits
3. Update documentation if needed
4. Test your changes thoroughly
5. Submit a pull request with a clear description

## Questions?

Feel free to open an issue for any questions or concerns.
