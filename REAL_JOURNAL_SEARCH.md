# Real Journal Search Feature

## What Changed

The journal search now displays **REAL journals** from your actual database, not hardcoded data.

## How It Works

1. **Data Source**: Queries the `articles` table to get unique journal names
2. **Real Stats**: Shows actual article count and total downloads per journal
3. **Metadata Enrichment**: Adds ISSN, descriptions, and cover images for known UDSM journals
4. **Live Search**: Filters journals in real-time as you type

## Features

### Real Data
- Extracts unique journals from your articles database
- Calculates article count per journal
- Aggregates total downloads per journal
- Updates automatically when new articles are added

### Search Functionality
- Search by journal title
- Search by ISSN
- Search by description keywords
- Real-time filtering

### Journal Cards Display
- Cover image with hover zoom effect
- ISSN badge overlay
- Journal title and publisher
- Description (3 lines max)
- Article count (e.g., "15 articles")
- Total downloads (e.g., "12,450 downloads")
- Direct link to journal website

## Supported Journals

The system automatically detects and enriches these UDSM journals:

1. **Tanzania Journal of Science** (ISSN: 0856-1761)
2. **Tanzania Journal of Engineering and Technology** (ISSN: 0856-0196)
3. **Tanzania Journal of Health Research** (ISSN: 1821-9241)
4. **Tanzania Journal of Development Studies** (ISSN: 0856-4728)
5. **Tanzania Journal of Population Studies and Development** (ISSN: 0856-4728)
6. **African Journal of Marine Science** (ISSN: 1814-232X)
7. **Journal of Linguistics and Language in Education** (ISSN: 2221-7347)
8. **UDSM Journal of Arts and Social Sciences** (ISSN: 2672-4235)
9. **Eastern Africa Social Science Review** (ISSN: 1027-1775)

Any other journals in your database will also appear with default metadata.

## Example Search Queries

Try searching for:
- "Science" → Shows Tanzania Journal of Science
- "Health" → Shows Tanzania Journal of Health Research
- "0856" → Shows journals with that ISSN prefix
- "engineering" → Shows engineering-related journals

## Technical Details

- **Hook**: `useJournals()` - Fetches and aggregates journal data
- **Component**: `JournalSearch` - Displays searchable journal grid
- **Query**: Groups articles by journal name and calculates stats
- **Performance**: Uses React Query for caching and automatic updates

## No Database Migration Needed

This solution works with your existing database structure. It reads from the `articles` table that already exists, so no migration is required!
