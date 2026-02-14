# Quick Deploy Guide

Your repository: https://github.com/Mr-mpange/udsm-research-tracker.git

## Step 1: Install gh-pages

```bash
npm install
```

## Step 2: Add GitHub Secrets

Go to: https://github.com/Mr-mpange/udsm-research-tracker/settings/secrets/actions

Add these 3 secrets:
1. `VITE_SUPABASE_URL` = Your Supabase URL
2. `VITE_SUPABASE_PUBLISHABLE_KEY` = Your Supabase anon key
3. `VITE_SUPABASE_PROJECT_ID` = Your Supabase project ID

## Step 3: Enable GitHub Pages

Go to: https://github.com/Mr-mpange/udsm-research-tracker/settings/pages

Under "Build and deployment":
- Source: Select **GitHub Actions**

## Step 4: Deploy

### Option A: Automatic (Recommended)
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push
```

### Option B: Manual
```bash
npm run deploy
```

## Step 5: View Your Site

After 2-3 minutes, visit:
**https://Mr-mpange.github.io/udsm-research-tracker**

## Check Deployment Status

https://github.com/Mr-mpange/udsm-research-tracker/actions

---

✅ Configuration is already set for your repository!
