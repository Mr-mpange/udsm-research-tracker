// Mock academic data for UDSM Research Impact Dashboard

export interface Article {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  doi: string;
  downloads: number;
  citations: number;
  publishedDate: string;
}

export interface ReaderEvent {
  country: string;
  countryCode: string;
  articleId: string;
  timestamp: number;
  lat: number;
  lng: number;
}

export interface CountryData {
  name: string;
  code: string;
  reads: number;
  downloads: number;
  topJournal: string;
  topArticle: string;
  lat: number;
  lng: number;
}

export const journals = [
  "Tanzania Journal of Science",
  "Tanzania Journal of Engineering and Technology",
  "Eastern Africa Social Science Research Review",
  "Journal of Linguistics and Language in Education",
  "Tanzania Journal of Health Research",
  "African Journal of Marine Science",
  "Tanzania Journal of Development Studies",
  "UDSM Journal of Arts and Social Sciences",
];

export const articles: Article[] = [
  {
    id: "a1",
    title: "Machine Learning Applications for Malaria Prediction in Sub-Saharan Africa",
    authors: ["Mwanga, J.R.", "Kimaro, H.C.", "Msanjila, S.S."],
    journal: "Tanzania Journal of Science",
    doi: "10.4314/tjs.v49i1.12",
    downloads: 3421,
    citations: 87,
    publishedDate: "2025-03-15",
  },
  {
    id: "a2",
    title: "Sustainable Urban Water Management in Dar es Salaam: Challenges and Innovations",
    authors: ["Kassenga, G.R.", "Mbuligwe, S.E."],
    journal: "Tanzania Journal of Engineering and Technology",
    doi: "10.4314/tjet.v42i2.8",
    downloads: 2876,
    citations: 64,
    publishedDate: "2025-01-22",
  },
  {
    id: "a3",
    title: "Impact of Mobile Banking on Financial Inclusion Among Rural Communities",
    authors: ["Lwoga, E.T.", "Questier, F."],
    journal: "Eastern Africa Social Science Research Review",
    doi: "10.4314/eassrr.v38i1.5",
    downloads: 2654,
    citations: 52,
    publishedDate: "2025-06-10",
  },
  {
    id: "a4",
    title: "Coral Reef Biodiversity Along the Tanzanian Coastline: A Comprehensive Survey",
    authors: ["Muhando, C.A.", "Rumisha, C.K."],
    journal: "African Journal of Marine Science",
    doi: "10.4314/ajms.v46i3.14",
    downloads: 2198,
    citations: 41,
    publishedDate: "2024-11-05",
  },
  {
    id: "a5",
    title: "Swahili as a Language of Science: Terminology Development and Standardization",
    authors: ["Massamba, D.P.B.", "Kihore, Y.M."],
    journal: "Journal of Linguistics and Language in Education",
    doi: "10.4314/jlle.v17i2.3",
    downloads: 1987,
    citations: 38,
    publishedDate: "2025-04-18",
  },
  {
    id: "a6",
    title: "Antimicrobial Resistance Patterns in Hospital-Acquired Infections: A Multi-Center Study",
    authors: ["Mshana, S.E.", "Matee, M.I.", "Rweyemamu, M.M."],
    journal: "Tanzania Journal of Health Research",
    doi: "10.4314/thrb.v27i1.9",
    downloads: 3102,
    citations: 93,
    publishedDate: "2025-02-28",
  },
  {
    id: "a7",
    title: "Agricultural Productivity and Climate Change Adaptation in the Southern Highlands",
    authors: ["Tumbo, S.D.", "Mzirai, O.B."],
    journal: "Tanzania Journal of Development Studies",
    doi: "10.4314/tjds.v21i1.7",
    downloads: 1756,
    citations: 29,
    publishedDate: "2025-05-12",
  },
  {
    id: "a8",
    title: "Digital Humanities and Cultural Heritage Preservation in East Africa",
    authors: ["Kiondo, E.", "Mcharazo, A."],
    journal: "UDSM Journal of Arts and Social Sciences",
    doi: "10.4314/ujass.v8i2.4",
    downloads: 1432,
    citations: 22,
    publishedDate: "2025-07-01",
  },
];

export const countriesData: CountryData[] = [
  { name: "Tanzania", code: "TZ", reads: 12450, downloads: 8920, topJournal: "Tanzania Journal of Science", topArticle: "Machine Learning Applications for Malaria Prediction", lat: -6.37, lng: 34.89 },
  { name: "Kenya", code: "KE", reads: 5680, downloads: 3240, topJournal: "Tanzania Journal of Health Research", topArticle: "Antimicrobial Resistance Patterns", lat: -0.02, lng: 37.91 },
  { name: "United States", code: "US", reads: 4320, downloads: 2870, topJournal: "African Journal of Marine Science", topArticle: "Coral Reef Biodiversity Along the Tanzanian Coastline", lat: 37.09, lng: -95.71 },
  { name: "United Kingdom", code: "GB", reads: 3890, downloads: 2510, topJournal: "Tanzania Journal of Science", topArticle: "Machine Learning Applications for Malaria Prediction", lat: 55.38, lng: -3.44 },
  { name: "South Africa", code: "ZA", reads: 3210, downloads: 1980, topJournal: "African Journal of Marine Science", topArticle: "Coral Reef Biodiversity Along the Tanzanian Coastline", lat: -30.56, lng: 22.94 },
  { name: "Uganda", code: "UG", reads: 2870, downloads: 1650, topJournal: "Eastern Africa Social Science Research Review", topArticle: "Impact of Mobile Banking on Financial Inclusion", lat: 1.37, lng: 32.29 },
  { name: "Nigeria", code: "NG", reads: 2540, downloads: 1420, topJournal: "Tanzania Journal of Health Research", topArticle: "Antimicrobial Resistance Patterns", lat: 9.08, lng: 8.68 },
  { name: "India", code: "IN", reads: 2180, downloads: 1290, topJournal: "Tanzania Journal of Science", topArticle: "Machine Learning Applications for Malaria Prediction", lat: 20.59, lng: 78.96 },
  { name: "Germany", code: "DE", reads: 1950, downloads: 1180, topJournal: "Tanzania Journal of Engineering and Technology", topArticle: "Sustainable Urban Water Management", lat: 51.17, lng: 10.45 },
  { name: "China", code: "CN", reads: 1780, downloads: 1050, topJournal: "Tanzania Journal of Science", topArticle: "Machine Learning Applications for Malaria Prediction", lat: 35.86, lng: 104.2 },
  { name: "Ethiopia", code: "ET", reads: 1650, downloads: 920, topJournal: "Tanzania Journal of Development Studies", topArticle: "Agricultural Productivity and Climate Change Adaptation", lat: 9.15, lng: 40.49 },
  { name: "Rwanda", code: "RW", reads: 1420, downloads: 810, topJournal: "Eastern Africa Social Science Research Review", topArticle: "Impact of Mobile Banking on Financial Inclusion", lat: -1.94, lng: 29.87 },
  { name: "Canada", code: "CA", reads: 1280, downloads: 760, topJournal: "Tanzania Journal of Health Research", topArticle: "Antimicrobial Resistance Patterns", lat: 56.13, lng: -106.35 },
  { name: "Sweden", code: "SE", reads: 1120, downloads: 680, topJournal: "Tanzania Journal of Engineering and Technology", topArticle: "Sustainable Urban Water Management", lat: 60.13, lng: 18.64 },
  { name: "Australia", code: "AU", reads: 980, downloads: 590, topJournal: "African Journal of Marine Science", topArticle: "Coral Reef Biodiversity Along the Tanzanian Coastline", lat: -25.27, lng: 133.78 },
  { name: "Brazil", code: "BR", reads: 870, downloads: 520, topJournal: "Tanzania Journal of Development Studies", topArticle: "Agricultural Productivity and Climate Change Adaptation", lat: -14.24, lng: -51.93 },
  { name: "Japan", code: "JP", reads: 750, downloads: 430, topJournal: "Tanzania Journal of Science", topArticle: "Machine Learning Applications for Malaria Prediction", lat: 36.2, lng: 138.25 },
  { name: "Mozambique", code: "MZ", reads: 680, downloads: 390, topJournal: "African Journal of Marine Science", topArticle: "Coral Reef Biodiversity Along the Tanzanian Coastline", lat: -18.67, lng: 35.53 },
];

export const downloadTrendData = [
  { month: "Aug 2025", downloads: 1820, "Tanzania Journal of Science": 520, "Tanzania Journal of Health Research": 380, "Other": 920 },
  { month: "Sep 2025", downloads: 2150, "Tanzania Journal of Science": 610, "Tanzania Journal of Health Research": 420, "Other": 1120 },
  { month: "Oct 2025", downloads: 2480, "Tanzania Journal of Science": 690, "Tanzania Journal of Health Research": 510, "Other": 1280 },
  { month: "Nov 2025", downloads: 2210, "Tanzania Journal of Science": 580, "Tanzania Journal of Health Research": 460, "Other": 1170 },
  { month: "Dec 2025", downloads: 1950, "Tanzania Journal of Science": 490, "Tanzania Journal of Health Research": 390, "Other": 1070 },
  { month: "Jan 2026", downloads: 2780, "Tanzania Journal of Science": 780, "Tanzania Journal of Health Research": 560, "Other": 1440 },
  { month: "Feb 2026", downloads: 3120, "Tanzania Journal of Science": 870, "Tanzania Journal of Health Research": 620, "Other": 1630 },
];

// Simulation helpers
const readerCountries = countriesData.map(c => ({ name: c.name, code: c.code, lat: c.lat, lng: c.lng }));

export function generateReaderEvent(): ReaderEvent {
  const country = readerCountries[Math.floor(Math.random() * readerCountries.length)];
  const article = articles[Math.floor(Math.random() * articles.length)];
  return {
    country: country.name,
    countryCode: country.code,
    articleId: article.id,
    timestamp: Date.now(),
    lat: country.lat + (Math.random() - 0.5) * 5,
    lng: country.lng + (Math.random() - 0.5) * 5,
  };
}
