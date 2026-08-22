export const INITIAL_ROLE_DEFINITIONS = [
  {
    id: "super_admin",
    name: "Super Admin",
    badgeClass: "badge-super",
    description: "Manage admins, users, subscriptions, platform settings.",
    permissions: [
      "all_access",
      "manage_admins",
      "manage_users",
      "manage_subscriptions",
      "platform_settings",
      "manage_content",
      "manage_articles",
      "support_access",
      "reset_passwords",
      "verify_users",
      "review_content",
      "edit_assigned_articles",
      "request_changes",
      "approve_articles"
    ]
  },
  {
    id: "editor",
    name: "Editor",
    badgeClass: "badge-editor",
    description: "Review, edit, polish content quality & SEO. Return with notes or approve articles.",
    permissions: ["manage_content", "review_content", "edit_assigned_articles", "request_changes", "approve_articles"]
  },
  {
    id: "content_admin",
    name: "Content Admin",
    badgeClass: "badge-content",
    description: "Add, edit, publish, archive and remove articles.",
    permissions: ["manage_content", "manage_articles", "view_analytics"]
  },
  {
    id: "subscription_manager",
    name: "Subscription Manager",
    badgeClass: "badge-subscription",
    description: "Manage subscription plans, premium users and renewals.",
    permissions: ["manage_subscriptions", "manage_plans", "view_financial_analytics"]
  },
  {
    id: "support_admin",
    name: "Support Admin",
    badgeClass: "badge-support",
    description: "Reset passwords, verify users, handle account issues.",
    permissions: ["reset_passwords", "verify_users", "manage_support_tickets", "support_access"]
  }
];


export const INITIAL_ARTICLES = [];

export const INITIAL_SUBSCRIPTION_PLANS = [];

export const INITIAL_SUBSCRIBERS = [];

export const INITIAL_SUPPORT_TICKETS = [];

export const INITIAL_ADMIN_USERS = [
  {
    id: "user-editor-1",
    username: "john_editor",
    name: "John Editor",
    email: "john.editor@dailybrief.com",
    roleId: "editor",
    status: "Active",
    createdAt: "2026-08-01"
  },
  {
    id: "user-editor-2",
    username: "sarah_editor",
    name: "Sarah Senior Editor",
    email: "sarah.editor@dailybrief.com",
    roleId: "editor",
    status: "Active",
    createdAt: "2026-08-02"
  }
];

export const INITIAL_PLATFORM_SETTINGS = {
  siteTitle: "Daily Brief News Portal",
  maintenanceMode: false,
  breakingNewsBanner: "",
  enablePublicSignups: true,
  requireEmailVerification: true,
  maxDailyPasswordResetsPerUser: 3,
  supportDeskEmail: ""
};

export const INITIAL_HOMEPAGE_ADS = [
  {
    id: "ad-masthead-top",
    slotId: "masthead-top",
    slotName: "Masthead Top Banner",
    slotLocation: "Top Header Zone (Below Navigation Bar)",
    dimension: "970x90 Leaderboard / 728x90",
    enabled: true,
    sponsorName: "Binance VIP Institutional",
    badgeText: "SPONSORED",
    headline: "Institutional Crypto Liquidity & 0% Trading Fees",
    subtitle: "Enterprise-grade custody, low-latency API execution and global OTC desks.",
    ctaText: "Explore Platform",
    targetUrl: "https://binance.com",
    contentType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
    mediaLayout: "side_media",
    mediaFit: "contain",
    mediaHeight: "130px",
    mediaWidth: "220px",
    mediaBg: "rgba(0, 0, 0, 0.95)",
    customHtml: "",
    format: "leaderboard"
  },
  {
    id: "ad-hero-bottom",
    slotId: "hero-bottom",
    slotName: "Hero Billboard Banner",
    slotLocation: "Directly Below Top 4 News Stories",
    dimension: "970x250 Premium Billboard",
    enabled: true,
    sponsorName: "Rolex Precision Chronometers",
    badgeText: "OFFICIAL PARTNER",
    headline: "The Oyster Perpetual Deepsea Challenge",
    subtitle: "Guaranteed waterproof to 11,000 meters. The supreme instrument of deep oceanic exploration.",
    ctaText: "Discover Model",
    targetUrl: "https://rolex.com",
    contentType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    mediaLayout: "full_banner",
    mediaFit: "contain",
    mediaHeight: "220px",
    mediaWidth: "100%",
    mediaBg: "rgba(0, 0, 0, 0.95)",
    customHtml: "",
    format: "billboard"
  },
  {
    id: "ad-in-feed-mid",
    slotId: "in-feed-mid",
    slotName: "Latest Intelligence In-Feed Sponsor",
    slotLocation: "Inside News Feed (Between Article Rows)",
    dimension: "Native Sponsored Stream Card",
    enabled: true,
    sponsorName: "Google Cloud Platform",
    badgeText: "CLOUD PARTNER",
    headline: "Deploy Scalable AI Models Globally with Vertex AI",
    subtitle: "Build with Gemini 1.5 Pro and enterprise security compliance at planet scale.",
    ctaText: "Start Free Trial",
    targetUrl: "https://cloud.google.com",
    contentType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    mediaLayout: "side_media",
    mediaFit: "contain",
    mediaHeight: "130px",
    mediaWidth: "220px",
    mediaBg: "rgba(0, 0, 0, 0.95)",
    customHtml: "",
    format: "in_feed"
  },
  {
    id: "ad-sidebar-sticky",
    slotId: "sidebar-sticky",
    slotName: "Trending Sidebar Medium Rectangle",
    slotLocation: "Right Sidebar (Below Most Read Today)",
    dimension: "300x250 Medium Rectangle",
    enabled: true,
    sponsorName: "Porsche Taycan Turbo GT",
    badgeText: "AUTOMOTIVE",
    headline: "Soul, Electrified: The All-New Porsche Taycan",
    subtitle: "0-100 km/h in 2.2 seconds. Peak performance meets timeless design.",
    ctaText: "Configure Yours",
    targetUrl: "https://porsche.com",
    contentType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80",
    mediaLayout: "stacked",
    mediaFit: "contain",
    mediaHeight: "150px",
    mediaWidth: "100%",
    mediaBg: "rgba(0, 0, 0, 0.95)",
    customHtml: "",
    format: "rectangle"
  },
  {
    id: "ad-deep-dives-top",
    slotId: "deep-dives-top",
    slotName: "Deep Dives Premium Sponsor",
    slotLocation: "Header of Deep Dives 💎 Investigations",
    dimension: "Full Width Premium Sponsor Banner",
    enabled: true,
    sponsorName: "Financial Times Intelligence",
    badgeText: "EDITORIAL PARTNER",
    headline: "Global Geopolitical Risk Index 2026: Executive Briefing",
    subtitle: "Exclusive macro analysis covering global supply chains, central banking, and semiconductors.",
    ctaText: "Download Report",
    targetUrl: "https://ft.com",
    contentType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    mediaLayout: "full_banner",
    mediaFit: "contain",
    mediaHeight: "200px",
    mediaWidth: "100%",
    mediaBg: "rgba(0, 0, 0, 0.95)",
    customHtml: "",
    format: "deep_dives"
  }
];

export const INITIAL_HOMEPAGE_ARTICLE_SECTIONS = [
  {
    id: "zone-hero-lead",
    zoneName: "Zone 1: Dominant Hero Lead Story (Top-Left Large Stage)",
    zoneBadge: "HERO LEAD",
    zoneType: "hero_lead",
    sectionTitle: "Main Top Story",
    category: "All",
    selectionMode: "auto", // "auto" (latest by category) or "manual" (pinned article)
    pinnedArticleId: null,
    pinnedArticleTitle: null,
    itemCount: 1,
    sortOrder: "latest",
    enabled: true,
    description: "The primary 42% dominant lead column story with large image/video banner, kicker, title, summary deck & byline."
  },
  {
    id: "zone-hero-sub-1",
    zoneName: "Zone 2: Hero Sub Lead 1 (Left Box under Main Lead)",
    zoneBadge: "HERO SUB 1",
    zoneType: "hero_sub_1",
    sectionTitle: "Featured Sub Lead 1",
    category: "All",
    selectionMode: "auto",
    pinnedArticleId: null,
    pinnedArticleTitle: null,
    itemCount: 1,
    sortOrder: "latest",
    enabled: true,
    description: "First compact column sub-story card positioned directly beneath the main lead banner."
  },
  {
    id: "zone-hero-sub-2",
    zoneName: "Zone 3: Hero Sub Lead 2 (Right Box under Main Lead)",
    zoneBadge: "HERO SUB 2",
    zoneType: "hero_sub_2",
    sectionTitle: "Featured Sub Lead 2",
    category: "All",
    selectionMode: "auto",
    pinnedArticleId: null,
    pinnedArticleTitle: null,
    itemCount: 1,
    sortOrder: "latest",
    enabled: true,
    description: "Second compact column sub-story card positioned alongside Sub Lead 1."
  },
  {
    id: "zone-hero-second-lead",
    zoneName: "Zone 4: Second Major Lead (Center Column Top)",
    zoneBadge: "SECOND LEAD",
    zoneType: "hero_second_lead",
    sectionTitle: "Second Major Story",
    category: "All",
    selectionMode: "auto",
    pinnedArticleId: null,
    pinnedArticleTitle: null,
    itemCount: 1,
    sortOrder: "latest",
    enabled: true,
    description: "The central column top featured editorial story with horizontal image & detailed summary deck."
  },
  {
    id: "zone-hero-stacked",
    zoneName: "Zone 5: Center Column Stacked News Rows",
    zoneBadge: "STACKED ROWS",
    zoneType: "hero_stacked",
    sectionTitle: "Top News Stack",
    category: "All",
    selectionMode: "auto",
    pinnedArticleId: null,
    pinnedArticleTitle: null,
    itemCount: 3,
    sortOrder: "latest",
    enabled: true,
    description: "3 stacked compact horizontal news rows beneath the Second Major Lead in the center column."
  },
  {
    id: "zone-editorial-opinion",
    zoneName: "Zone 6: Column 3 Editorial Opinion Crest Box",
    zoneBadge: "EDITORIAL OPINION",
    zoneType: "opinion",
    sectionTitle: "EDITORIAL OPINION",
    category: "Opinion & Essays",
    selectionMode: "auto",
    pinnedArticleId: null,
    pinnedArticleTitle: null,
    itemCount: 1,
    sortOrder: "latest",
    enabled: true,
    description: "The Hindu-inspired opinion crest box at the top of the 3rd column for institutional perspectives."
  },
  {
    id: "zone-band-1",
    zoneName: "Zone 7: Section Band 1 (Lead Feature + Horizontal Cards)",
    zoneBadge: "SECTION BAND 1",
    zoneType: "section_band",
    sectionTitle: "National Affairs",
    category: "Global Affairs",
    selectionMode: "auto",
    pinnedArticleId: null,
    pinnedArticleTitle: null,
    itemCount: 4,
    sortOrder: "latest",
    enabled: true,
    description: "Major middle-page editorial band containing a 40% lead feature card and 2 stacked horizontal cards."
  },
  {
    id: "zone-band-2",
    zoneName: "Zone 8: Section Band 2 (World & Geopolitics Column)",
    zoneBadge: "SECTION BAND 2",
    zoneType: "section_band",
    sectionTitle: "World & Geopolitics",
    category: "Global Affairs",
    selectionMode: "auto",
    pinnedArticleId: null,
    pinnedArticleTitle: null,
    itemCount: 4,
    sortOrder: "latest",
    enabled: true,
    description: "Major middle-page 32% column stack featuring 3 concise stories and a visual culture feature."
  },
  {
    id: "zone-dept-1",
    zoneName: "Zone 9: Department Grid 1 (Business & Markets)",
    zoneBadge: "DEPARTMENT 1",
    zoneType: "department_grid",
    sectionTitle: "Business, Markets & Economy",
    category: "Markets & Economy",
    selectionMode: "auto",
    pinnedArticleId: null,
    pinnedArticleTitle: null,
    itemCount: 4,
    sortOrder: "latest",
    enabled: true,
    description: "4-column full-width responsive newsroom department grid for financial and business journalism."
  },
  {
    id: "zone-dept-2",
    zoneName: "Zone 10: Department Grid 2 (Technology & AI)",
    zoneBadge: "DEPARTMENT 2",
    zoneType: "department_grid",
    sectionTitle: "Technology, AI & Space",
    category: "Tech & AI",
    selectionMode: "auto",
    pinnedArticleId: null,
    pinnedArticleTitle: null,
    itemCount: 4,
    sortOrder: "latest",
    enabled: true,
    description: "4-column full-width responsive newsroom department grid for frontier tech, AI, and science."
  },
  {
    id: "zone-deep-dives",
    zoneName: "Zone 11: Special Investigations (Deep Dives 💎)",
    zoneBadge: "DEEP DIVES",
    zoneType: "deep_dives",
    sectionTitle: "Deep Dives 💎",
    category: "Deep Dives 💎",
    selectionMode: "auto",
    pinnedArticleId: null,
    pinnedArticleTitle: null,
    itemCount: 3,
    sortOrder: "latest",
    enabled: true,
    description: "Dark showcase banner displaying premium long-form investigative journalism and member-exclusive deep dives."
  }
];

export const HOMEPAGE_ARTICLE_PRESETS = [
  {
    id: "preset-newspaper-default",
    name: "📰 Standard Balanced Daily Brief Newspaper Edition",
    description: "Classic broadsheet balance with Global Affairs in Lead, National in Band 1, World in Band 2, Markets & Tech in Depts.",
    sections: [
      { id: "zone-hero-lead", category: "All", sectionTitle: "Top Story", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-sub-1", category: "All", sectionTitle: "Featured Sub Lead 1", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-sub-2", category: "All", sectionTitle: "Featured Sub Lead 2", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-second-lead", category: "All", sectionTitle: "Second Major Story", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-stacked", category: "All", sectionTitle: "Top News Stack", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-editorial-opinion", category: "Opinion & Essays", sectionTitle: "EDITORIAL OPINION", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-band-1", category: "Global Affairs", sectionTitle: "National Affairs", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-band-2", category: "Global Affairs", sectionTitle: "World & Geopolitics", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-dept-1", category: "Markets & Economy", sectionTitle: "Business, Markets & Economy", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-dept-2", category: "Tech & AI", sectionTitle: "Technology, AI & Space", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-deep-dives", category: "Deep Dives 💎", sectionTitle: "Deep Dives 💎", selectionMode: "auto", pinnedArticleId: null, enabled: true }
    ]
  },
  {
    id: "preset-tech-breakthrough",
    name: "🚀 Technology, AI & Frontier Science Special Edition",
    description: "Spotlights Tech & AI in the Dominant Hero Stage, Quantum/Science in Band 1, Cyber & Robotics in Depts.",
    sections: [
      { id: "zone-hero-lead", category: "Tech & AI", sectionTitle: "Tech Frontier Lead", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-sub-1", category: "Tech & AI", sectionTitle: "Silicon & AI Models", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-sub-2", category: "Science & Climate", sectionTitle: "Frontier Science", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-second-lead", category: "Tech & AI", sectionTitle: "Silicon Geopolitics", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-stacked", category: "Tech & AI", sectionTitle: "AI Disruption Wire", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-editorial-opinion", category: "Opinion & Essays", sectionTitle: "TECH ETHICS & OPINION", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-band-1", category: "Tech & AI", sectionTitle: "Frontier Computing & Hardware", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-band-2", category: "Science & Climate", sectionTitle: "Biotech & Deep Tech", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-dept-1", category: "Markets & Economy", sectionTitle: "Tech Venture & Public Markets", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-dept-2", category: "Tech & AI", sectionTitle: "Autonomous Systems & Robotics", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-deep-dives", category: "Deep Dives 💎", sectionTitle: "Deep Dives 💎", selectionMode: "auto", pinnedArticleId: null, enabled: true }
    ]
  },
  {
    id: "preset-markets-economy",
    name: "📈 Financial Times & Global Markets Focus Edition",
    description: "Centers on Markets & Macroeconomics in the Hero Stage, Central Bank Policy in Band 1, Global Trade in Depts.",
    sections: [
      { id: "zone-hero-lead", category: "Markets & Economy", sectionTitle: "Global Macroeconomic Lead", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-sub-1", category: "Markets & Economy", sectionTitle: "Bond Yields & FX", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-sub-2", category: "Markets & Economy", sectionTitle: "Commodities & Energy", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-second-lead", category: "Markets & Economy", sectionTitle: "Central Banking & Policy", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-stacked", category: "Markets & Economy", sectionTitle: "Equities & OTC Liquidity", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-editorial-opinion", category: "Opinion & Essays", sectionTitle: "ECONOMIC PERSPECTIVES", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-band-1", category: "Markets & Economy", sectionTitle: "Banking, Capital & Debt Markets", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-band-2", category: "Global Affairs", sectionTitle: "Supply Chains & Trade Corridors", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-dept-1", category: "Markets & Economy", sectionTitle: "Institutional Asset Management", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-dept-2", category: "Tech & AI", sectionTitle: "Fintech & Algorithmic Trading", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-deep-dives", category: "Deep Dives 💎", sectionTitle: "Deep Dives 💎", selectionMode: "auto", pinnedArticleId: null, enabled: true }
    ]
  },
  {
    id: "preset-global-geopolitics",
    name: "🌍 Geopolitical Crisis & Multipolar Diplomacy Edition",
    description: "Prioritizes Global Affairs, International Diplomacy, Foreign Policy, and Strategic Alliances.",
    sections: [
      { id: "zone-hero-lead", category: "Global Affairs", sectionTitle: "Global Geopolitical Lead", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-sub-1", category: "Global Affairs", sectionTitle: "Strategic Alliances", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-sub-2", category: "Global Affairs", sectionTitle: "Defense & Security", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-second-lead", category: "Global Affairs", sectionTitle: "Multipolar Diplomacy", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-hero-stacked", category: "Global Affairs", sectionTitle: "Diplomatic Cables", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-editorial-opinion", category: "Opinion & Essays", sectionTitle: "STRATEGIC DOCTRINE", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-band-1", category: "Global Affairs", sectionTitle: "Indo-Pacific & Asian Security", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-band-2", category: "Global Affairs", sectionTitle: "Transatlantic & Middle East Desk", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-dept-1", category: "Markets & Economy", sectionTitle: "Sanctions, Energy & Sovereign Wealth", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-dept-2", category: "Tech & AI", sectionTitle: "Defense Silicon & Cyber Intel", selectionMode: "auto", pinnedArticleId: null, enabled: true },
      { id: "zone-deep-dives", category: "Deep Dives 💎", sectionTitle: "Deep Dives 💎", selectionMode: "auto", pinnedArticleId: null, enabled: true }
    ]
  }
];


