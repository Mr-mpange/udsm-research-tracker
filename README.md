# UDSM Research Impact Dashboard

A real-time research impact monitoring system for the University of Dar es Salaam (UDSM), built for the ICT Innovation Challenge 2026.

## Features

### 📊 Live Metrics Dashboard
- Real-time tracking of downloads, citations, and active readers
- Global reach visualization with country statistics
- Interactive world map showing research impact by region

### 🔍 Journal Search
- Search UDSM academic journals by title, ISSN, or keywords
- View journal covers, descriptions, and statistics
- Direct links to journal websites
- Real-time article count and download metrics

### 📈 Analytics & Visualization
- Trend charts showing research impact over time
- Activity feed with live reader events
- Top articles ranked by downloads and citations
- Country-level engagement statistics

### 🌍 Global Impact Tracking
- Geographic visualization of research reach
- Country-specific download and citation data
- Real-time reader event tracking

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: TanStack Query (React Query)
- **Maps**: Leaflet
- **Charts**: Recharts
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account (or local Supabase CLI)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd udsm-research-dashboard
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

4. Run database migrations:
```bash
# If using Supabase CLI locally
supabase db reset

# Or push to remote database
supabase db push
```

5. Start the development server:
```bash
npm run dev
# or
bun dev
```

Visit `http://localhost:5173` to see the dashboard.

## Database Schema

### Tables

- **articles**: Research articles with metadata, downloads, and citations
- **country_stats**: Aggregated statistics by country
- **reader_events**: Individual reader engagement events
- **ojs_***: Open Journal Systems integration tables

### Key Features

- Row Level Security (RLS) enabled
- Real-time subscriptions support
- Automatic timestamp tracking
- Geographic data with lat/lng coordinates

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── dashboard/        # Dashboard-specific components
│   │   └── ui/               # Reusable UI components (shadcn)
│   ├── hooks/                # Custom React hooks
│   ├── integrations/         # Supabase client & types
│   ├── pages/                # Page components
│   ├── services/             # Business logic & data services
│   └── utils/                # Utility functions
├── supabase/
│   ├── migrations/           # Database migrations
│   └── functions/            # Edge functions
└── scripts/                  # Data import & seeding scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Data Sources

The dashboard integrates with:
- UDSM Open Journal Systems (OJS)
- Crossref API for DOI metadata
- Real-time reader analytics

## Contributing

This project was developed for the UDSM ICT Innovation Challenge 2026.

## License

© 2026 University of Dar es Salaam

## Acknowledgments

- UDSM ICT Innovation Challenge organizers
- Open Journal Systems (OJS) community
- shadcn/ui for the component library


## For live demo 
-Visit  https://mr-mpange.github.io/udsm-research-tracker/