# Deploy to GitHub Pages - Step by Step Guide

## Prerequisites

- GitHub account
- Git installed on your computer
- Node.js installed

## Step 1: Update Configuration

1. Open `package.json` and update the `homepage` field:
```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME"
```

2. Open `vite.config.ts` and update the `base` field:
```typescript
base: mode === 'production' ? '/YOUR_REPO_NAME/' : '/',
```

Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your actual values.

## Step 2: Install Dependencies

```bash
npm install
```

This will install the `gh-pages` package needed for deployment.

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `udsm-research-dashboard`)
3. Don't initialize with README (we already have one)

## Step 4: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - UDSM Research Dashboard"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 5: Add Secrets to GitHub

1. Go to your repository on GitHub
2. Click Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add these three secrets:

   - Name: `VITE_SUPABASE_URL`
     Value: Your Supabase project URL

   - Name: `VITE_SUPABASE_PUBLISHABLE_KEY`
     Value: Your Supabase anon key

   - Name: `VITE_SUPABASE_PROJECT_ID`
     Value: Your Supabase project ID

## Step 6: Enable GitHub Pages

1. Go to Settings > Pages
2. Under "Build and deployment":
   - Source: Select "GitHub Actions"
3. Save

## Step 7: Deploy

### Option A: Automatic Deployment (Recommended)

The GitHub Action will automatically deploy when you push to main:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push
```

Go to the "Actions" tab to see the deployment progress.

### Option B: Manual Deployment

```bash
npm run deploy
```

This builds and deploys directly using gh-pages.

## Step 8: Access Your Site

After deployment completes (2-3 minutes), visit:
```
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME
```

## Troubleshooting

### 404 Error
- Check that the `base` in `vite.config.ts` matches your repo name
- Ensure GitHub Pages is enabled in repository settings
- Wait a few minutes for DNS propagation

### Build Fails
- Check that all secrets are correctly set in GitHub
- Verify your Supabase credentials are valid
- Check the Actions tab for error logs

### Blank Page
- Open browser console (F12) to check for errors
- Verify the `base` path in `vite.config.ts` is correct
- Check that environment variables are set

### Assets Not Loading
- Ensure `base` path ends with `/`
- Clear browser cache
- Check Network tab in browser DevTools

## Updating Your Site

To update your deployed site:

```bash
# Make your changes
git add .
git commit -m "Update dashboard"
git push
```

The GitHub Action will automatically rebuild and redeploy.

## Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. Add a `CNAME` file to the `public/` folder with your domain
3. Configure DNS settings with your domain provider
4. Enable custom domain in GitHub Pages settings

## Local Testing Before Deploy

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

Visit http://localhost:4173 to test the production build locally.

## Need Help?

- Check GitHub Actions logs for deployment errors
- Verify all environment variables are set correctly
- Ensure your Supabase project is accessible
- Check browser console for JavaScript errors

## Success! 🎉

Your UDSM Research Dashboard is now live on GitHub Pages!
