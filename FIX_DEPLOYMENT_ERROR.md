# 🔧 Fix Deployment Error

## The Problem
Your site shows: `supabaseUrl is required`

This means the environment variables are missing from the build.

## The Solution (3 Steps)

### ✅ Step 1: Add GitHub Secrets

1. Go to: https://github.com/Mr-mpange/udsm-research-tracker/settings/secrets/actions

2. Click "New repository secret" and add each of these:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://bnexttvxmysqrgdmmfap.supabase.co`

   **Secret 2:**
   - Name: `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuZXh0dHZ4bXlzcXJnZG1tZmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTcxNTMsImV4cCI6MjA4NjQ5MzE1M30.j_UqJu1PH92Llo63lHTLYluZb4lYVqJuj_6n6j7hfqg`

   **Secret 3:**
   - Name: `VITE_SUPABASE_PROJECT_ID`
   - Value: `bnexttvxmysqrgdmmfap`

### ✅ Step 2: Enable GitHub Pages

1. Go to: https://github.com/Mr-mpange/udsm-research-tracker/settings/pages

2. Under "Build and deployment":
   - Source: Select **"GitHub Actions"**

3. Click Save

### ✅ Step 3: Trigger Redeploy

Option A - Push empty commit:
```bash
git commit --allow-empty -m "Redeploy with secrets"
git push
```

Option B - Re-run workflow:
1. Go to: https://github.com/Mr-mpange/udsm-research-tracker/actions
2. Click the latest workflow
3. Click "Re-run all jobs"

### ✅ Step 4: Verify

Wait 2-3 minutes, then visit:
**https://Mr-mpange.github.io/udsm-research-tracker**

Your dashboard should now load correctly! 🎉

---

## Quick Checklist

- [ ] Added all 3 secrets to GitHub
- [ ] Enabled GitHub Pages (Source: GitHub Actions)
- [ ] Triggered a new deployment
- [ ] Waited 2-3 minutes
- [ ] Checked the live site

If still not working, check the Actions tab for error logs.
