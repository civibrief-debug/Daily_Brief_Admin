-- ==============================================================================
-- CLOUDFLARE D1 SQL SCHEMA FOR CIVIBRIEF (Daily Brief Admin Portal)
-- ==============================================================================
-- Paste this script into Cloudflare D1 Dashboard > Console tab and click Execute.
-- ==============================================================================

-- 1. Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  kicker TEXT,
  supertitle TEXT,
  category TEXT DEFAULT 'Technology',
  subSection TEXT,
  author TEXT DEFAULT 'Staff Reporter',
  authorId TEXT,
  assignedEditorId TEXT,
  assignedEditorName TEXT,
  status TEXT DEFAULT 'Draft',
  summary TEXT,
  content TEXT,
  imageUrl TEXT,
  coverMediaType TEXT DEFAULT 'image',
  videoUrl TEXT,
  photoCaption TEXT,
  photoCredit TEXT,
  coverImageCrop TEXT,
  coverVideoCrop TEXT,
  coverMediaAspect TEXT DEFAULT '16:9',
  readTime TEXT DEFAULT '3 min read',
  isHero INTEGER DEFAULT 0,
  isEditorsPick INTEGER DEFAULT 0,
  isTrending INTEGER DEFAULT 0,
  isLive INTEGER DEFAULT 0,
  adPlacements TEXT,
  placeholderAdEnabled INTEGER DEFAULT 0,
  placeholderAdTargetUrl TEXT,
  placeholderAdHeadline TEXT,
  placeholderAdDescription TEXT,
  placeholderAdCtaText TEXT,
  createdAt TEXT,
  publishedAt TEXT,
  updatedAt TEXT
);

-- 2. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  roleId TEXT DEFAULT 'content_admin',
  categoryScope TEXT,
  sectionScope TEXT,
  actionPermissions TEXT,
  status TEXT DEFAULT 'Active',
  createdAt TEXT
);

-- 3. Subscribers Table
CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'Free',
  status TEXT DEFAULT 'Active',
  subscribedAt TEXT
);

-- 4. Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'Open',
  createdAt TEXT
);

-- 5. Homepage Ads Table (Sponsors, Dimensions, Custom Layouts & Visibility)
CREATE TABLE IF NOT EXISTS homepage_ads (
  id TEXT PRIMARY KEY,
  data TEXT,
  updated_at TEXT
);

-- 6. Homepage Articles Table (Zone Category Placements & Pinned Stories)
CREATE TABLE IF NOT EXISTS homepage_articles (
  id TEXT PRIMARY KEY,
  data TEXT,
  updated_at TEXT
);

-- Indices for Fast Queries
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(publishedAt);
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

