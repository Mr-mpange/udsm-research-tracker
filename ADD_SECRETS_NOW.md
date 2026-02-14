# 🔐 Add GitHub Secrets - URGENT

Your site is deployed but showing an error because the Supabase credentials are missing.

## Step 1: Go to Secrets Page

Click this link: https://github.com/Mr-mpange/udsm-research-tracker/settings/secrets/actions

## Step 2: Add These 3 Secrets

Click "New repository secret" for each one:

### Secret 1
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://bnexttvxmysqrgdmmfap.supabase.co`

### Secret 2
- **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuZXh0dHZ4bXlzcXJnZG1tZmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTcxNTMsImV4cCI6MjA4NjQ5MzE1M30.j_UqJu1PH92Llo63lHTLYluZb4lYVqJuj_6n6j7hfqg`

### Secret 3
- **Name**: `VITE_SUPABASE_PROJECT_ID`
- **Value**: `bnexttvxmysqrgdmmfap`

## Step 3: Redeploy

After adding all 3 secrets, go to:
https://github.com/Mr-mpange/udsm-research-tracker/actions

1. Click on the latest workflow run
2. Click "Re-run all jobs"

OR simply push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy with secrets"
git push
```

## Step 4: Wait & Check

Wait 2-3 minutes, then visit:
https://Mr-mpange.github.io/udsm-research-tracker

The error should be gone! ✅

---

## Why This Happened

GitHub Actions needs the Supabase credentials to build your app, but they weren't added as secrets yet. Once you add them, the next deployment will include them in the build.
