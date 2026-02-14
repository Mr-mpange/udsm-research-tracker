# Journal Search Feature

## What's New

Added a beautiful journal search component with cover page display to the dashboard.

## Features

- **Search Functionality**: Real-time search by journal title, description, or ISSN
- **Cover Page Display**: Each journal shows an attractive cover image
- **Responsive Grid Layout**: Adapts to mobile, tablet, and desktop screens
- **Hover Effects**: Smooth animations when hovering over journal cards
- **External Links**: Direct links to each journal's website

## Components Created

1. **JournalSearch.tsx** - Main search component with card grid layout
2. **useJournals.ts** - React Query hook to fetch journals from database
3. **Database Migration** - Creates journals table with sample UDSM journals

## Database Schema

The `journals` table includes:
- `title` - Journal name
- `issn` - International Standard Serial Number
- `description` - Brief description of the journal
- `cover_image_url` - URL to cover image
- `website_url` - Link to journal website
- `publisher` - Publisher name (defaults to UDSM)

## Sample Journals Included

1. Tanzania Journal of Population Studies and Development
2. Tanzania Journal of Science
3. Tanzania Journal of Engineering and Technology
4. Huria: Journal of the Open University of Tanzania
5. Tanzania Journal of Health Research
6. Business Management Review

## Usage

The journal search appears on the dashboard between the world map and trend chart sections. Users can:
- Type in the search box to filter journals
- Click on journal cards to view details
- Click "Visit Journal" to open the journal website in a new tab

## Next Steps

To apply the database migration, run:
```bash
supabase db reset
```

Or if you're using a remote database:
```bash
supabase db push
```
