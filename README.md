# UDSM Research Impact Dashboard

A real-time dashboard for tracking research impact from the University of Dar es Salaam (UDSM) journals.

## Features

- **Real-time Tracking**: Monitor research article downloads and citations in real-time
- **Geographic Reach**: Interactive world map showing global access to UDSM research
- **Article Management**: Browse and manage research publications
- **Impact Metrics**: Track downloads, citations, and reader engagement
- **OAI-PMH Integration**: Harvest metadata from UDSM journal repositories
- **Admin Panel**: Manage data and system settings

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet
- **Charts**: Recharts
- **Authentication**: Supabase Auth

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:8080/

### Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

## Project Structure

```
src/
├── components/       # React components
│   ├── dashboard/   # Dashboard-specific components
│   └── ui/          # Reusable UI components
├── hooks/           # Custom React hooks
├── integrations/    # External service integrations
├── pages/           # Page components
├── services/        # Business logic and API calls
└── utils/           # Utility functions

supabase/
└── migrations/      # Database migrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Database Schema

The application uses the following main tables:

- `articles` - Research article metadata
- `country_stats` - Geographic statistics
- `reader_events` - Reader activity tracking
- `profiles` - User profiles
- `user_roles` - User permissions

## Features in Detail

### Dashboard
- Live metrics cards showing total downloads, citations, active readers, and countries reached
- Interactive world map with country-level statistics
- Trend charts for download patterns
- Recent activity feed
- Searchable articles table

### Admin Panel
- OAI-PMH harvester for importing article metadata
- Citation enrichment via Crossref API
- Country statistics initialization
- User management

### Real-time Updates
- Live tracking of reader activity
- Automatic data refresh
- Simulated real-time events for demonstration

## Development

### Adding New Components

Components follow the shadcn/ui pattern:

```bash
# Add a new component
npx shadcn-ui@latest add [component-name]
```

### Database Migrations

Migrations are in `supabase/migrations/`. Apply them via Supabase Dashboard SQL Editor.

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set environment variables
3. Deploy

## Contributing

This project was developed for the UDSM ICT Innovation Challenge 2026.

## License

© 2026 University of Dar es Salaam

## Support

For issues or questions, contact the development team.

---

**Built with ❤️ for UDSM Research Community**
