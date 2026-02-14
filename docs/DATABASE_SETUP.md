# Database Setup Guide

Complete guide for setting up the UDSM Research Impact Dashboard database.

## Quick Start

1. Create a Supabase project at https://supabase.com
2. Copy your credentials to `.env`
3. Run migrations from `supabase/migrations/` in order
4. Data is automatically seeded

## Schema Overview

- **articles**: Research papers with downloads/citations
- **country_stats**: Geographic engagement data
- **reader_events**: Real-time reader tracking
- **ojs_***: Open Journal Systems integration

## Sample Data

Includes 20 UDSM articles, 18 countries, and 100+ reader events.

For detailed documentation, see the migration files in `supabase/migrations/`.
