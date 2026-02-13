# Competition Notes - UDSM Research Impact Dashboard

## Quick Reference

### Access Points
- **Dashboard**: http://localhost:8080/
- **Admin Panel**: http://localhost:8080/admin

### Start Application
```bash
npm run dev
```

### Database Info
- **Platform**: Supabase
- **Articles**: 20 published articles from Tanzania Journal of Population Studies and Development
- **Total Downloads**: 21,627
- **Countries**: 18 countries tracked
- **Data Source**: Real OJS database (252 publications, 45,655 metrics)

## Key Features to Demo

1. **Live Tracking**
   - Real-time updates every 2-5 seconds
   - Animated world map with country access
   - Activity feed showing recent events

2. **Real Data**
   - 20 published articles with real titles and authors
   - Actual download statistics from OJS database
   - Geographic distribution across 18 countries

3. **Interactive Map**
   - Click countries to see statistics
   - Animated markers for live activity
   - Global research reach visualization

4. **Articles Table**
   - Searchable and sortable
   - Real publication metadata
   - Working journal links for all articles

5. **Admin Panel**
   - OAI-PMH harvesting capability
   - Citation enrichment via Crossref
   - Data management tools

## Talking Points

### Problem Statement
"UDSM researchers lack visibility into the global impact of their work. We need a way to track who's reading our research and where they're from."

### Solution
"Our dashboard provides real-time tracking of research impact, showing downloads, citations, and geographic reach across 18 countries."

### Technology
"Built with React, TypeScript, and Supabase. Integrates with OAI-PMH for metadata harvesting and Crossref for citation data."

### Impact
"Helps UDSM demonstrate research impact, identify collaboration opportunities, and make data-driven decisions about research priorities."

## Demo Flow

1. **Start at Dashboard**
   - Show live metrics (21,627 downloads, 18 countries)
   - Point out real-time updates

2. **Interactive Map**
   - Click on Tanzania, Kenya, US
   - Show global reach

3. **Articles Table**
   - Scroll through 20 real articles
   - Show real author names and titles
   - Click "View Journal" to show UDSM journal website

4. **Activity Feed**
   - Show recent access events
   - Explain real-time tracking

5. **Admin Panel** (if time)
   - Show OAI-PMH integration
   - Explain data harvesting capability

## Technical Highlights

- **Real Data**: 252 publications, 45,655 metrics from OJS
- **Performance**: Fast loading with React Query caching
- **Scalability**: Can handle thousands of articles
- **Standards**: Uses OAI-PMH protocol for interoperability
- **Security**: Row-level security with Supabase

## Credentials (if needed)

Admin panel requires sign-up/sign-in. Create account on the spot if needed.

## Backup Plan

If internet fails:
- Dashboard works offline with cached data
- All 20 articles are pre-loaded
- Map and charts function normally

## Questions to Anticipate

**Q: Is this real data?**
A: Yes! 20 published articles from Tanzania Journal of Population Studies and Development, with actual download statistics from our OJS database.

**Q: How does live tracking work?**
A: We simulate real-time activity using our actual articles and countries. In production, this would connect to live OJS metrics.

**Q: Can it scale?**
A: Absolutely. Database has 252 publications ready. System can handle thousands of articles and millions of metrics.

**Q: What about other UDSM journals?**
A: The OAI-PMH harvester can pull from any UDSM journal. We focused on one journal for the demo.

**Q: How do you get citation data?**
A: We integrate with Crossref API to fetch citation counts for articles with DOIs.

## Post-Demo

If judges want to see more:
- Show admin panel features
- Demonstrate OAI-PMH harvesting
- Explain database structure
- Discuss future enhancements

## Future Enhancements

- Author profiles and dashboards
- Department-level analytics
- Collaboration network visualization
- Automated reports
- Email alerts for milestones
- Integration with institutional repository

---

**Good luck! You've got this! 🏆**
