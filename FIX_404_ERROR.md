# 🔧 Fix 404 Error - GitHub Pages Not Configured

## The Problem

GitHub Pages is showing a 404 error because it's not properly enabled or configured.

## Solution: Enable GitHub Pages Manually

### Step 1: Go to Repository Settings

Visit: https://github.com/Mr-mpange/udsm-research-tracker/settings/pages

### Step 2: Configure Source

Under "Build and deployment":

1. **Source**: Select **"GitHub Actions"** (NOT "Deploy from a branch")
2. Click **Save**

### Step 3: Check Workflow Permissions

Visit: https://github.com/Mr-mpange/udsm-research-tracker/settings/actions

Scroll down to "Workflow permissions" and ensure:
- ✅ **"Read and write permissions"** is selected
- ✅ **"Allow GitHub Actions to create and approve pull requests"** is checked

Click **Save**

### Step 4: Trigger New Deployment

Run this command:

```bash
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push
```

### Step 5: Wait and Check

1. Go to Actions: https://github.com/Mr-mpange/udsm-research-tracker/actions
2. Wait for the workflow to complete (green checkmark)
3. Visit: https://mr-mpange.github.io/udsm-research-tracker/

## Alternative: Check if Pages is Enabled

Sometimes GitHub Pages needs to be enabled first:

1. Go to: https://github.com/Mr-mpange/udsm-research-tracker/settings/pages
2. If you see "GitHub Pages is currently disabled"
3. Under "Source", select **"GitHub Actions"**
4. This will enable Pages for your repository

## Verify Deployment

After enabling Pages and pushing:

1. Check Actions tab for successful deployment
2. Look for "pages build and deployment" workflow
3. Should show green checkmark ✅
4. Site URL will appear in Pages settings

---

## Quick Checklist

- [ ] GitHub Pages enabled in settings
- [ ] Source set to "GitHub Actions"
- [ ] Workflow permissions set to "Read and write"
- [ ] Latest commit pushed
- [ ] Actions workflow completed successfully
- [ ] Site accessible at URL

## If Still Not Working

The deployment might be queued. Check:
- Actions tab for any failed workflows
- Pages settings for any error messages
- Repository visibility (must be public for free GitHub Pages)
