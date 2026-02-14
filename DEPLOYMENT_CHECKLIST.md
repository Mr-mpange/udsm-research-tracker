# GitHub Pages Deployment Checklist

## Before You Deploy

- [ ] Update `package.json` homepage field with your GitHub username and repo name
- [ ] Update `vite.config.ts` base field with your repo name
- [ ] Test locally with `npm run build` and `npm run preview`
- [ ] Commit all changes to git

## GitHub Setup

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Add Supabase secrets to GitHub repository:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
  - [ ] `VITE_SUPABASE_PROJECT_ID`
- [ ] Enable GitHub Pages in repository settings (Source: GitHub Actions)

## Deploy

- [ ] Push to main branch (automatic deployment)
  OR
- [ ] Run `npm run deploy` (manual deployment)

## Verify

- [ ] Check Actions tab for successful deployment
- [ ] Visit your GitHub Pages URL
- [ ] Test all features work correctly
- [ ] Check browser console for errors
- [ ] Test on mobile devices

## Post-Deployment

- [ ] Update README with live demo link
- [ ] Share your dashboard URL
- [ ] Monitor for any issues

---

**Your site will be live at:**
`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

**Need help?** See `DEPLOY_GITHUB_PAGES.md` for detailed instructions.
