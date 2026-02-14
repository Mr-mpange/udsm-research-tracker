# Deployment Guide

## Build for Production

```bash
npm run build
# or
bun run build
```

This creates an optimized build in the `dist/` folder.

## Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

## Deploy to Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Set environment variables in Netlify dashboard

## Deploy to GitHub Pages

1. Update `vite.config.ts` with your base path
2. Build: `npm run build`
3. Deploy the `dist/` folder to GitHub Pages

## Environment Variables

Required for all deployments:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon key
- `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

## Performance Tips

- Enable gzip compression
- Use CDN for static assets
- Enable caching headers
- Monitor with Lighthouse
