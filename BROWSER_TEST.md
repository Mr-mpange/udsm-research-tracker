# 🧪 Browser Test Instructions

## Step 1: Open Your Site

Visit: **https://mr-mpange.github.io/udsm-research-tracker/**

## Step 2: Open Developer Console

Press **F12** (or right-click > Inspect > Console tab)

## Step 3: Run These Tests

Copy and paste each test into the console:

### Test 1: Check if React Loaded
```javascript
console.log('React Root:', document.getElementById('root'));
console.log('Has Content:', document.getElementById('root').children.length > 0);
```

**Expected**: Should show the root element with children

### Test 2: Check Supabase Connection
```javascript
console.log('Supabase URL:', import.meta.env?.VITE_SUPABASE_URL || 'Not found');
```

**Expected**: Should show your Supabase URL (not "Not found")

### Test 3: Check Current Route
```javascript
console.log('Current Path:', window.location.pathname);
console.log('Current Hash:', window.location.hash);
console.log('Full URL:', window.location.href);
```

**Expected**: Should show `/udsm-research-tracker/` or `/udsm-research-tracker/dashboard`

### Test 4: Check for Errors
```javascript
console.log('Any errors?', 'Check above for red error messages');
```

**Expected**: No red error messages in console

## Step 4: Visual Check

Look at the page and verify:

- [ ] UDSM header is visible
- [ ] Navigation bar appears
- [ ] Live metrics cards show (Downloads, Citations, etc.)
- [ ] World map is rendered
- [ ] Journal search box is visible
- [ ] No error messages on screen
- [ ] No infinite loading spinner

## Step 5: Test Journal Search

1. Scroll to "UDSM Journals" section
2. Click "Show All Journals" button
3. Verify journals appear with cover images
4. Type "science" in search box
5. Verify it filters to show science journals

## Step 6: Test Navigation

1. Check if URL changes when navigating
2. Click browser back button
3. Verify it goes back correctly
4. Refresh the page (F5)
5. Verify page loads correctly after refresh

## Common Issues & Solutions

### Issue: Blank Page
- **Solution**: Hard refresh (Ctrl + Shift + R)
- **Or**: Clear browser cache and reload

### Issue: "supabaseUrl is required"
- **Solution**: Deployment still in progress, wait 2 more minutes

### Issue: 404 Error
- **Solution**: Check GitHub Actions for deployment status

### Issue: Styles Not Loading
- **Solution**: Check Network tab for failed CSS requests

## Report Results

After testing, report:

1. ✅ or ❌ for each visual check item
2. Any error messages from console
3. Screenshot if something looks wrong

## Quick Status Check

Run this all-in-one test:

```javascript
console.log('=== SITE STATUS ===');
console.log('React Loaded:', !!document.getElementById('root')?.children.length);
console.log('Current URL:', window.location.href);
console.log('Errors:', document.querySelectorAll('.error, [role="alert"]').length);
console.log('Dashboard Elements:', document.querySelectorAll('[class*="dashboard"], [class*="metric"], [class*="chart"]').length);
console.log('===================');
```

This will give you a quick overview of the site status.

---

## Expected Final Result

✅ Dashboard loads with live data
✅ No errors in console
✅ All features working
✅ Responsive and fast
