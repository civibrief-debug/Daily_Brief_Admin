"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  INITIAL_HOMEPAGE_ARTICLE_SECTIONS, 
  HOMEPAGE_ARTICLE_PRESETS,
  INITIAL_HOMEPAGE_ADS
} from '../data/mockInitialData';
import {
  LayoutGrid,
  Sparkles,
  Check,
  Save,
  RotateCcw,
  Eye,
  ArrowUp,
  ArrowDown,
  Pin,
  Search,
  Filter,
  Layers,
  Globe,
  Cpu,
  TrendingUp,
  Flame,
  BookOpen,
  Sliders,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Compass,
  FileText,
  Clock,
  User,
  Hash,
  Monitor,
  Tablet,
  Smartphone,
  Edit3,
  DollarSign,
  Lock,
  ArrowRight,
  Tag,
  Columns,
  SlidersHorizontal,
  Bookmark,
  CheckSquare,
  Square,
  ListFilter,
  ChevronDown,
  GripVertical,
  Maximize2,
  Minimize2,
  Volume2,
  ExternalLink,
  ArrowUpRight,
  Copy,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  CornerDownRight,
  Move,
  Layers2,
  Megaphone,
  Shuffle,
  Grid,
  Box,
  Scale,
  PanelRight,
  Sliders as SlidersIcon,
  Play
} from 'lucide-react';
import {
  formatCoverMediaEmbedUrl,
  formatCoverImageUrl,
  parseGoogleDriveUrl,
  isArticleCoverVideo,
  getArticleCoverVideoUrl,
  getDefaultArticleImage
} from '../lib/videoUtils';
import ContinuousCoverVideo from './ContinuousCoverVideo';
import ArticleMediaCover from './ArticleMediaCover';

// ============================================================================
// ALL NEWSROOM CATEGORIES
// ============================================================================

export const ALL_CATEGORIES = [
  "Top Stories",
  "Tech & AI",
  "Global Affairs",
  "Markets & Economy",
  "Credit News",
  "Science & Climate",
  "Opinion & Essays",
  "Editorial",
  "Sports",
  "India & Policy",
  "Movies & Culture",
  "Lifestyle & Design",
  "Deep Dives 💎"
];

// ============================================================================
// SUBSECTION ROUTING SLUG RESOLVER
// ============================================================================

export const getCategorySlug = (category) => {
  if (!category) return 'top-stories';
  const c = String(category).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (c.includes('tech') || c.includes('ai')) return 'tech';
  if (c.includes('global') || c.includes('world') || c.includes('nation')) return 'global';
  if (c.includes('market') || c.includes('econom') || c.includes('credit') || c.includes('business')) return 'markets';
  if (c.includes('science') || c.includes('climate')) return 'science';
  if (c.includes('movie') || c.includes('entertainment')) return 'movies';
  if (c.includes('life') || c.includes('style') || c.includes('design')) return 'lifestyle';
  if (c.includes('sport')) return 'sports';
  if (c.includes('opinion') || c.includes('editorial') || c.includes('essay')) return 'opinion';
  if (c.includes('culture')) return 'culture';
  if (c.includes('deep') || c.includes('dive') || c.includes('investig')) return 'deep-dives';
  return 'top-stories';
};

// ============================================================================
// GLOBAL HOMEPAGE REGION DEFINITIONS
// ============================================================================

export const HOMEPAGE_REGIONS = [
  { id: 'hero_col1', name: 'Hero Column 1 (Left 42% Dominant Stage)', defaultCol: 'left' },
  { id: 'hero_col2', name: 'Hero Column 2 (Center 32% Features)', defaultCol: 'center' },
  { id: 'hero_col3', name: 'Hero Column 3 (Right 26% Editorial Rail)', defaultCol: 'right' },
  { id: 'national_global', name: 'National & Global Affairs Section', defaultCol: 'left' },
  { id: 'world_geopolitics', name: 'World & Geopolitics Section', defaultCol: 'center' },
  { id: 'tech_ai', name: 'Tech & AI Innovation Hub', defaultCol: 'left' },
  { id: 'markets_economy', name: 'Markets, Economy & Wealth', defaultCol: 'center' },
  { id: 'deep_dives', name: 'Deep Dives 💎 Investigative Series', defaultCol: 'full' },
  { id: 'lifestyle_culture', name: 'Lifestyle, Culture & Movies', defaultCol: 'left' },
  { id: 'sports_desk', name: 'Sports Desk & Scorecards', defaultCol: 'center' },
  { id: 'sidebar_rail', name: 'Sidebar News Stream & Intelligence', defaultCol: 'right' }
];

export const CATEGORY_TO_REGIONS_MAP = {
  "Top Stories": ["hero_col1", "hero_col2"],
  "Editorial": ["hero_col3"],
  "Opinion & Essays": ["hero_col3"],
  "Sports": ["sports_desk"],
  "Tech & AI": ["tech_ai"],
  "Science & Climate": ["tech_ai"],
  "Markets & Economy": ["markets_economy"],
  "Credit News": ["markets_economy"],
  "Global Affairs": ["world_geopolitics", "national_global"],
  "India & Policy": ["national_global"],
  "Movies & Culture": ["lifestyle_culture"],
  "Lifestyle & Design": ["lifestyle_culture"],
  "Deep Dives 💎": ["deep_dives"]
};

export const matchesInstanceToRegion = (inst, regionId) => {
  if (!inst || inst.enabled === false) return false;

  // 1. Explicit primary region match
  if (inst.sectionRegion === regionId) return true;

  // 2. Legacy / default column matching
  if (!inst.sectionRegion) {
    if (regionId === 'hero_col1' && (inst.column === 'left' || inst.templateType === 'hero_lead')) return true;
    if (regionId === 'hero_col2' && (inst.column === 'center' || inst.templateType === 'hero_second_lead' || inst.templateType === 'hero_stacked')) return true;
    if (regionId === 'hero_col3' && (inst.column === 'right' || inst.templateType === 'opinion')) return true;
  }

  // 3. Multi-Assigned Categories matching:
  // If ANY assigned category in inst.categories maps to this regionId!
  const assignedCats = Array.isArray(inst.categories) && inst.categories.length > 0 
    ? inst.categories 
    : (inst.category ? [inst.category] : []);

  for (const cat of assignedCats) {
    const mappedRegions = CATEGORY_TO_REGIONS_MAP[cat];
    if (mappedRegions && mappedRegions.includes(regionId)) {
      return true;
    }
  }

  return false;
};

// ============================================================================
// 4 BASE TEMPLATE DEFINITIONS (INDEPENDENT FACTORY BLUEPRINTS)
// ============================================================================

export const BASE_TEMPLATE_DEFINITIONS = [
  {
    type: "hero_lead",
    templateNumber: 1,
    label: "Template 1 – Large Featured Story Card (Sliding Carousel)",
    shortBadge: "TEMPLATE 1",
    zoneBadge: "HERO LEAD",
    badgeColor: "#2563eb",
    defaultColumn: "left",
    defaultRegion: "hero_col1",
    icon: Sparkles,
    description: "Dominant hero visual card with auto-sliding top stories carousel, pagination dots, category kicker, headline, byline, and 2 supporting sub-stories below.",
    createInstance: (customTitle, categories = ["Top Stories", "Science & Climate"], column = "left", region = "hero_col1") => ({
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      templateType: "hero_lead",
      sectionRegion: region || "hero_col1",
      slotPosition: "main",
      column: column || "left",
      sizeMode: "normal",
      enabled: true,
      badge: "HERO LEAD",
      badgeColor: "#2563eb",
      sectionTitle: customTitle || "Dominant Hero Lead Stage",
      categories: Array.isArray(categories) ? categories : [categories || "Top Stories"],
      itemCount: 1,
      selectionMode: "auto",
      pinnedArticleId: null,
      slides: [
        {
          id: `story-${Date.now()}-slide1`,
          title: "Make money in one Day!",
          subtitle: "How to make money in one day. Class by Mr Aditya. Practical liquidity strategies & arbitrage masterclass.",
          category: "Credit News",
          author: "Super Admin",
          readTime: "3 min read",
          imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
          coverMediaType: "video",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          content: "Automated repo market execution algorithms and real-time collateral optimization protocols enable institutional treasuries to capture basis differentials across overnight money markets.\n\nLearn modern fixed-income arbitrage and debt syndicate management.",
          hasAudio: false
        },
        {
          id: `story-${Date.now()}-slide2`,
          title: "Tokamak Milestone: High-Temperature Superconducting Magnets Achieve Sustained Plasma",
          subtitle: "Private fusion startups record 120-second plasma stability, bringing commercial net-energy gain within reach.",
          category: "Science & Climate",
          author: "Dr. Arvind Menon",
          readTime: "7 min read",
          imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
          content: "Experimental magnetohydrodynamic containment facilities achieved an unprecedented 120-second steady-state plasma confinement at ion temperatures exceeding 100 million Celsius.",
          hasAudio: true
        },
        {
          id: `story-${Date.now()}-slide3`,
          title: "GLOBAL MARKETS: Tech stocks rally following record quarterly cloud earnings & AI hardware demand.",
          subtitle: "Enterprise compute demands trigger broad-based rallies across international semiconductor exchanges.",
          category: "Markets & Economy",
          author: "Senior Market Analyst",
          readTime: "4 min read",
          imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
          content: "Equities rallied strongly as semiconductor fabricators and hyperscale datacenter providers reported accelerating forward guidance.",
          hasAudio: false
        },
        {
          id: `story-${Date.now()}-slide4`,
          title: "ENERGY TRANSITION: European Union approves €42 billion green hydrogen infrastructure mandate.",
          subtitle: "Continental pipeline networks slated to connect Iberian solar farms with industrial heartlands.",
          category: "Science & Climate",
          author: "Staff Reporter",
          readTime: "5 min read",
          imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
          content: "The European Commission formally ratified binding cross-border energy corridors for green hydrogen distribution.",
          hasAudio: false
        }
      ],
      subStories: [
        {
          id: `story-${Date.now()}-sub1`,
          title: "Make money in one Day!",
          subtitle: "High-yield intraday liquidity facilities and arbitrage strategies.",
          category: "Credit News",
          author: "Super Admin",
          readTime: "3 min read",
          imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
          coverMediaType: "video",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          content: "Automated repo market execution algorithms and real-time collateral optimization protocols enable institutional treasuries to capture basis differentials across overnight money markets."
        },
        {
          id: `story-${Date.now()}-sub2`,
          title: "CARS: Next-Gen Solid State Battery Chemistry",
          subtitle: "Endurance trials demonstrate 1,100 km single-charge ranges.",
          category: "Sports",
          author: "Ravi",
          readTime: "4 min read",
          imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
          content: "Automotive engineering divisions have concluded endurance trials on ceramic solid-state lithium-metal cells."
        }
      ]
    })
  },
  {
    type: "hero_second_lead",
    templateNumber: 2,
    label: "Template 2 – Medium Featured Story Block",
    shortBadge: "TEMPLATE 2",
    zoneBadge: "SECOND LEAD",
    badgeColor: "#0891b2",
    defaultColumn: "center",
    defaultRegion: "hero_col2",
    icon: TrendingUp,
    description: "Mid-sized featured visual block with medium image, bold category, punchy headline, descriptive excerpt, and byline.",
    createInstance: (customTitle, categories = ["Global Affairs", "Markets & Economy"], column = "center", region = "hero_col2") => ({
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      templateType: "hero_second_lead",
      sectionRegion: region || "hero_col2",
      slotPosition: "main",
      column: column || "center",
      sizeMode: "normal",
      enabled: true,
      badge: "SECOND LEAD",
      badgeColor: "#0891b2",
      sectionTitle: customTitle || "Second Major Story Block",
      categories: Array.isArray(categories) ? categories : [categories || "Global Affairs"],
      itemCount: 1,
      selectionMode: "auto",
      pinnedArticleId: null,
      mainStory: {
        id: `story-${Date.now()}-sec`,
        title: "Make money in one Day!",
        subtitle: "How to make money in one day. Class by Mr Aditya. Practical liquidity strategies & arbitrage class.",
        category: "Credit News",
        author: "Super Admin",
        readTime: "3 min read",
        imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
        coverMediaType: "video",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        content: "Automated repo market execution algorithms and real-time collateral optimization protocols enable institutional treasuries to capture basis differentials across overnight money markets."
      }
    })
  },
  {
    type: "hero_stacked",
    templateNumber: 3,
    label: "Template 3 – Compact Story List Block",
    shortBadge: "TEMPLATE 3",
    zoneBadge: "COMPACT LIST",
    badgeColor: "#059669",
    defaultColumn: "center",
    defaultRegion: "hero_col2",
    icon: LayoutGrid,
    description: "Multiple smaller stories in stacked list style (thumbnail, category, title, author). Ideal for Top Stories, Credit News, or Drafts.",
    createInstance: (customTitle, categories = ["Credit News", "Top Stories"], column = "center", region = "hero_col2") => ({
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      templateType: "hero_stacked",
      sectionRegion: region || "hero_col2",
      slotPosition: "main",
      column: column || "center",
      sizeMode: "normal",
      enabled: true,
      badge: "COMPACT LIST",
      badgeColor: "#059669",
      sectionTitle: customTitle || "Top News Stack Feed",
      categories: Array.isArray(categories) ? categories : [categories || "Credit News"],
      itemCount: 3,
      selectionMode: "auto",
      pinnedArticleId: null,
      stories: [
        {
          id: `story-${Date.now()}-st1`,
          title: "Make money in one Day!",
          subtitle: "High-yield intraday liquidity facilities and arbitrage strategies.",
          category: "Credit News",
          author: "Super Admin",
          imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
          coverMediaType: "video",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        },
        {
          id: `story-${Date.now()}-st2`,
          title: "CARS: Next-Gen Solid State Battery Chemistry",
          subtitle: "Endurance trials demonstrate 1,100 km single-charge ranges.",
          category: "Sports",
          author: "Ravi",
          imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: `story-${Date.now()}-st3`,
          title: "Orbital Manufacturing Hubs: Lunar Gateway Expands Commercial Slots",
          subtitle: "Zero-gravity fiber optic production and organoid crystallization attract $15B.",
          category: "Global Affairs",
          author: "Vikram Malhotra",
          imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
        }
      ]
    })
  },
  {
    type: "opinion",
    templateNumber: 4,
    label: "Template 4 – Sidebar Editorial / Intelligence Block",
    shortBadge: "TEMPLATE 4",
    zoneBadge: "EDITORIAL OPINION",
    badgeColor: "#d97706",
    defaultColumn: "right",
    defaultRegion: "hero_col3",
    icon: Flame,
    description: "Multi-module right sidebar with Editorial Opinion (crest insignia & deck), Latest Intelligence live stream, and Sponsor showcase.",
    createInstance: (customTitle, categories = ["Opinion & Essays", "Editorial"], column = "right", region = "hero_col3") => ({
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      templateType: "opinion",
      sectionRegion: region || "hero_col3",
      slotPosition: "main",
      column: column || "right",
      sizeMode: "normal",
      enabled: true,
      badge: "EDITORIAL OPINION",
      badgeColor: "#d97706",
      sectionTitle: customTitle || "Editorial Opinion & Intelligence Rail",
      categories: Array.isArray(categories) ? categories : [categories || "Opinion & Essays"],
      itemCount: 1,
      selectionMode: "auto",
      pinnedArticleId: null,
      editorialOpinion: {
        id: `story-${Date.now()}-opinion`,
        title: "The Architecture of Sovereign Autonomy in an Era of Multipolar Fractures",
        deck: "Why independent institutional capacity and domestic silicon manufacturing constitute the genuine pillars of national security.",
        category: "Opinion & Essays",
        author: "Editorial Board",
        ctaText: "READ OUR EDITORIALS →",
        content: "Why independent institutional capacity and domestic silicon manufacturing constitute the genuine pillars of national security."
      },
      intelligenceStream: {
        badge: "LATEST INTELLIGENCE ⚡",
        updatedLabel: "UPDATED 2M AGO",
        items: [
          { id: `intel-1`, time: "14 MINS AGO", text: "Reserve Bank maintains repo rate policy stance amid food inflation monitoring." },
          { id: `intel-2`, time: "28 MINS AGO", text: "Cabinet Committee approves ₹76,000 Cr incentive outlay for semiconductor fab assembly." },
          { id: `intel-3`, time: "42 MINS AGO", text: "ISRO launches third ocean surveillance payload aboard upgraded GSLV rocket." }
        ]
      },
      sponsoredShowcase: {
        badge: "SPONSORED SHOWCASE",
        headline: "Apex Sovereign Asset Management: Q3 Global Macro Outlook Report",
        subtext: "Explore institutional research on infrastructure yields ↗",
        targetUrl: "https://example.com"
      }
    })
  }
];

const createInitialInstances = () => [
  BASE_TEMPLATE_DEFINITIONS[0].createInstance("Dominant Hero Lead Stage", ["Top Stories", "Science & Climate"], "left", "hero_col1"),
  BASE_TEMPLATE_DEFINITIONS[1].createInstance("Second Major Story Block", ["Global Affairs", "Markets & Economy"], "center", "hero_col2"),
  BASE_TEMPLATE_DEFINITIONS[2].createInstance("Top News Stack Feed", ["Credit News", "Top Stories"], "center", "hero_col2"),
  BASE_TEMPLATE_DEFINITIONS[3].createInstance("Editorial Opinion & Intelligence Rail", ["Opinion & Essays", "Editorial"], "right", "hero_col3")
];

export default function HomepagePlacementBuilder() {
  const { 
    articles: dbArticles, 
    homepageArticleSections, 
    homepageAds = INITIAL_HOMEPAGE_ADS,
    updateHomepageArticlePlacements, 
    showToast 
  } = useAdmin();

  const [instances, setInstances] = useState(() => createInitialInstances());
  const [slideIndices, setSlideIndices] = useState({});
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' (Broadsheet Canvas) or 'editor' (Section Builder)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedNode, setSelectedNode] = useState(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const [draggedInstanceId, setDraggedInstanceId] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null);

  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [selectedCoreTemplate, setSelectedCoreTemplate] = useState(BASE_TEMPLATE_DEFINITIONS[0]);
  const [templateQuantityMode, setTemplateQuantityMode] = useState(1);
  const [templateCustomQuantity, setTemplateCustomQuantity] = useState('5');
  const [templateTargetCategories, setTemplateTargetCategories] = useState(['Top Stories', 'Tech & AI']);
  const [templateTargetColumn, setTemplateTargetColumn] = useState('left');
  const [templateTargetRegion, setTemplateTargetRegion] = useState('hero_col1');

  const [articlePickerTarget, setArticlePickerTarget] = useState(null);
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [articleCategoryFilter, setArticleCategoryFilter] = useState('all');

  const [viewingArticle, setViewingArticle] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBlockType, setNewBlockType] = useState('hero_lead');
  const [newBlockTitle, setNewBlockTitle] = useState('New Editorial Section');
  const [newBlockBadge, setNewBlockBadge] = useState('FEATURED');
  const [newBlockCategories, setNewBlockCategories] = useState(['Top Stories']);
  const [newBlockCount, setNewBlockCount] = useState(4);
  const [newBlockColumn, setNewBlockColumn] = useState('left');
  const [newBlockRegion, setNewBlockRegion] = useState('national_global');

  const [previewViewport, setPreviewViewport] = useState('desktop');

  // Auto-slide carousel timer for all Template 1 (Hero Lead) instances (independent rotation every 2.5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndices(prev => {
        const next = { ...prev };
        instances.forEach(inst => {
          if (inst.templateType === 'hero_lead') {
            const slideCount = Array.isArray(inst.slides) && inst.slides.length > 0 
              ? inst.slides.length 
              : (Array.isArray(inst.slideStories) && inst.slideStories.length > 0 ? inst.slideStories.length : 1);
            if (slideCount > 1) {
              const current = next[inst.instanceId] || 0;
              next[inst.instanceId] = (current + 1) % slideCount;
            }
          }
        });
        return next;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [instances]);

  // Load from backend on mount if exists
  useEffect(() => {
    const fetchRemoteLayout = async () => {
      try {
        const res = await fetch('/api/db/homepage-articles');
        if (res.ok) {
          const json = await res.json();
          if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
            if (json.data[0]?.templateType || json.data[0]?.mainStory || json.data[0]?.slides) {
              setInstances(json.data);
            }
          }
        }
      } catch (e) {}
    };
    fetchRemoteLayout();
  }, []);

  const publishedArticles = useMemo(() => {
    const pool = [];
    if (Array.isArray(dbArticles)) {
      dbArticles.forEach(a => {
        if (a && a.status === 'Published') pool.push(a);
      });
    }
    return pool;
  }, [dbArticles]);

  const filteredArticlesForPicker = useMemo(() => {
    return publishedArticles.filter(a => {
      const matchQuery = !articleSearchQuery || 
        (a.title || '').toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
        (a.summary || '').toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
        (a.author || '').toLowerCase().includes(articleSearchQuery.toLowerCase());
      const matchCat = articleCategoryFilter === 'all' || 
        (a.category || '').toLowerCase() === articleCategoryFilter.toLowerCase();
      return matchQuery && matchCat;
    });
  }, [publishedArticles, articleSearchQuery, articleCategoryFilter]);

  const updateInstance = (instanceId, updater) => {
    setInstances(prev => {
      const next = prev.map(inst => {
        if (inst.instanceId === instanceId) {
          const updated = typeof updater === 'function' ? updater(inst) : { ...inst, ...updater };
          return updated;
        }
        return inst;
      });
      setHasUnsavedChanges(true);
      return next;
    });
  };

  const handleToggleSizeMode = (instanceId, newMode) => {
    updateInstance(instanceId, inst => ({
      ...inst,
      sizeMode: newMode || (inst.sizeMode === 'compact' ? 'normal' : inst.sizeMode === 'normal' ? 'expanded' : 'compact')
    }));
    showToast(`Size mode set to "${newMode || 'toggled'}"!`, "info");
  };

  const handleSwitchTemplateType = (instanceId, newTemplateType) => {
    const blueprint = BASE_TEMPLATE_DEFINITIONS.find(t => t.type === newTemplateType);
    if (!blueprint) return;

    updateInstance(instanceId, oldInst => {
      const freshModel = blueprint.createInstance(
        oldInst.sectionTitle,
        oldInst.categories || [oldInst.category || "Top Stories"],
        oldInst.column,
        oldInst.sectionRegion || oldInst.column
      );

      return {
        ...freshModel,
        instanceId: oldInst.instanceId,
        sectionRegion: oldInst.sectionRegion || oldInst.column || "hero_col1",
        slotPosition: oldInst.slotPosition || "main",
        column: oldInst.column || blueprint.defaultColumn,
        sizeMode: oldInst.sizeMode || "normal",
        sectionTitle: oldInst.sectionTitle,
        categories: oldInst.categories || [oldInst.category || "Top Stories"],
        badge: oldInst.badge || blueprint.zoneBadge,
        badgeColor: blueprint.badgeColor,
        enabled: oldInst.enabled !== false,
        selectionMode: oldInst.selectionMode || "auto",
        pinnedArticleId: oldInst.pinnedArticleId || null
      };
    });

    showToast(`Switched template to "${blueprint.label}" in same slot!`, "success");
  };

  const handleDuplicateInstance = (instanceId) => {
    const target = instances.find(inst => inst.instanceId === instanceId);
    if (!target) return;
    const cloned = JSON.parse(JSON.stringify(target));
    cloned.instanceId = `inst-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    cloned.sectionTitle = `${cloned.sectionTitle} (Copy)`;

    if (Array.isArray(cloned.slides)) {
      cloned.slides = cloned.slides.map((s, idx) => ({
        ...s,
        id: `story-${Date.now()}-slide${idx + 1}`
      }));
    }
    if (Array.isArray(cloned.subStories)) {
      cloned.subStories = cloned.subStories.map((s, idx) => ({
        ...s,
        id: `story-${Date.now()}-sub${idx + 1}`
      }));
    }
    if (Array.isArray(cloned.stories)) {
      cloned.stories = cloned.stories.map((s, idx) => ({
        ...s,
        id: `story-${Date.now()}-st${idx + 1}`
      }));
    }
    
    const targetIdx = instances.findIndex(inst => inst.instanceId === instanceId);
    const updated = [...instances];
    updated.splice(targetIdx + 1, 0, cloned);
    setInstances(updated);
    setHasUnsavedChanges(true);
    setSelectedNode({ instanceId: cloned.instanceId, nodeType: cloned.slides ? 'slide' : 'mainStory', childIndex: 0 });
    setIsInspectorOpen(true);
    showToast(`Duplicated "${cloned.sectionTitle}" with preserved sliding carousel!`, "success");
  };

  const handleDeleteInstance = (instanceId, title) => {
    if (!window.confirm(`Delete section "${title}"?`)) return;
    setInstances(prev => prev.filter(inst => inst.instanceId !== instanceId));
    if (selectedNode?.instanceId === instanceId) setSelectedNode(null);
    setHasUnsavedChanges(true);
    showToast(`Deleted section "${title}"`, "warning");
  };

  const handleMoveInstance = (instanceId, direction, renderedRegion = null) => {
    const inst = instances.find(i => i.instanceId === instanceId);
    if (!inst) return;

    const currentPos = inst.slotPosition === 'below_ad' ? 'below_ad' : 'above_ad';
    const targetRegion = renderedRegion || inst.sectionRegion || inst.column || 'hero_col1';
    const regionInstances = getInstancesForRegion(targetRegion, currentPos);
    const localIdx = regionInstances.findIndex(i => i.instanceId === instanceId);

    if (direction === 'up') {
      if (localIdx <= 0) {
        // If at top of below_ad, move to above_ad (at bottom of above_ad)
        if (currentPos === 'below_ad') {
          updateInstance(instanceId, { slotPosition: 'above_ad' });
          showToast(`Moved "${inst.sectionTitle}" to Top position (Above Ad)!`, "success");
          return;
        }
        showToast(`"${inst.sectionTitle}" is already at the top of this section!`, "info");
        return;
      }
      const prevInst = regionInstances[localIdx - 1];
      if (prevInst) {
        const globalIdx = instances.findIndex(i => i.instanceId === instanceId);
        const updated = [...instances];
        const [moved] = updated.splice(globalIdx, 1);
        const newTargetIdx = updated.findIndex(i => i.instanceId === prevInst.instanceId);
        updated.splice(newTargetIdx, 0, moved);
        setInstances(updated);
        setHasUnsavedChanges(true);
        showToast(`Moved "${inst.sectionTitle}" up!`, "info");
      }
    } else if (direction === 'down') {
      if (localIdx === -1 || localIdx >= regionInstances.length - 1) {
        // If at bottom of above_ad, move to below_ad (at top of below_ad)
        if (currentPos === 'above_ad') {
          updateInstance(instanceId, { slotPosition: 'below_ad' });
          showToast(`Moved "${inst.sectionTitle}" to Bottom position (Below Ad)!`, "success");
          return;
        }
        showToast(`"${inst.sectionTitle}" is already at the bottom of this section!`, "info");
        return;
      }
      const nextInst = regionInstances[localIdx + 1];
      if (nextInst) {
        const globalIdx = instances.findIndex(i => i.instanceId === instanceId);
        const updated = [...instances];
        const [moved] = updated.splice(globalIdx, 1);
        const newTargetIdx = updated.findIndex(i => i.instanceId === nextInst.instanceId);
        updated.splice(newTargetIdx + 1, 0, moved);
        setInstances(updated);
        setHasUnsavedChanges(true);
        showToast(`Moved "${inst.sectionTitle}" down!`, "info");
      }
    }
  };

  const handleMoveToRegion = (instanceId, targetRegion, targetSlotPos = 'above_ad') => {
    const regionDef = HOMEPAGE_REGIONS.find(r => r.id === targetRegion);
    updateInstance(instanceId, inst => ({
      ...inst,
      sectionRegion: targetRegion,
      slotPosition: targetSlotPos,
      column: regionDef?.defaultCol || inst.column
    }));
    showToast(`Moved to ${regionDef?.name || targetRegion} (${targetSlotPos === 'below_ad' ? 'Bottom' : 'Top'})!`, "success");
  };

  const handleToggleCategoryForInstance = (instanceId, cat) => {
    updateInstance(instanceId, inst => {
      const currentCats = Array.isArray(inst.categories) ? [...inst.categories] : [inst.category || "Top Stories"];
      const index = currentCats.indexOf(cat);
      if (index > -1) {
        if (currentCats.length > 1) {
          currentCats.splice(index, 1);
          showToast(`Removed from "${cat}" section`, "info");
        } else {
          showToast("Section must have at least one category assigned.", "warning");
          return inst;
        }
      } else {
        currentCats.push(cat);
        showToast(`Added to "${cat}" section! Now active across all selected sections.`, "success");
      }
      return {
        ...inst,
        categories: currentCats,
        category: currentCats[0]
      };
    });
  };

  const handleAddCoreTemplateCopies = () => {
    if (!selectedCoreTemplate) return;

    let count = 1;
    if (templateQuantityMode === 'custom') {
      const parsed = parseInt(templateCustomQuantity, 10);
      count = isNaN(parsed) || parsed < 1 ? 1 : Math.min(parsed, 50);
    } else {
      count = Number(templateQuantityMode);
    }

    const newCopies = Array.from({ length: count }, (_, idx) => {
      const existingCount = instances.filter(i => i.templateType === selectedCoreTemplate.type).length;
      return selectedCoreTemplate.createInstance(
        `${selectedCoreTemplate.label} #${existingCount + idx + 1}`,
        templateTargetCategories,
        templateTargetColumn,
        templateTargetRegion
      );
    });

    setInstances(prev => [...prev, ...newCopies]);
    setHasUnsavedChanges(true);
    setIsTemplatesModalOpen(false);
    showToast(`Added ${count} independent copies of ${selectedCoreTemplate.shortBadge}!`, "success");
  };

  const handleAddSectionBlock = () => {
    const tpl = BASE_TEMPLATE_DEFINITIONS.find(t => t.type === newBlockType) || BASE_TEMPLATE_DEFINITIONS[0];
    const newInst = tpl.createInstance(newBlockTitle, newBlockCategories, newBlockColumn, newBlockRegion);
    newInst.badge = newBlockBadge.toUpperCase();
    newInst.itemCount = parseInt(newBlockCount, 10) || 4;

    setInstances(prev => [...prev, newInst]);
    setHasUnsavedChanges(true);
    setIsAddModalOpen(false);
    setSelectedNode({ instanceId: newInst.instanceId, nodeType: newInst.slides ? 'slide' : 'mainStory', childIndex: 0 });
    setIsInspectorOpen(true);
    showToast(`Added new section: "${newBlockTitle}"`, "success");
  };

  const handleDragStart = (e, instanceId) => {
    setDraggedInstanceId(instanceId);
    e.dataTransfer.setData('text/plain', instanceId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverSlot = (e, regionId, slotPosition, targetInstanceId = null) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget({ regionId, slotPosition, instanceId: targetInstanceId });
  };

  const handleDropIntoSlot = (e, regionId, slotPosition, targetInstanceId = null) => {
    e.preventDefault();
    if (!draggedInstanceId) return;

    const sourceIdx = instances.findIndex(i => i.instanceId === draggedInstanceId);
    if (sourceIdx === -1) return;

    const updated = [...instances];
    const [draggedItem] = updated.splice(sourceIdx, 1);

    if (regionId) draggedItem.sectionRegion = regionId;
    if (slotPosition) draggedItem.slotPosition = slotPosition;

    const regionDef = HOMEPAGE_REGIONS.find(r => r.id === regionId);
    if (regionDef) {
      draggedItem.column = regionDef.defaultCol;
    }

    if (targetInstanceId && targetInstanceId !== draggedInstanceId) {
      const targetIdx = updated.findIndex(i => i.instanceId === targetInstanceId);
      if (targetIdx !== -1) {
        const targetInst = updated[targetIdx];
        if (targetInst) {
          draggedItem.sectionRegion = targetInst.sectionRegion || regionId;
          draggedItem.slotPosition = targetInst.slotPosition || slotPosition;
        }
        updated.splice(targetIdx, 0, draggedItem);
      } else {
        updated.push(draggedItem);
      }
    } else if (slotPosition === 'above_ad') {
      const firstInRegionIdx = updated.findIndex(i => (i.sectionRegion || i.column) === regionId);
      if (firstInRegionIdx !== -1) {
        updated.splice(firstInRegionIdx, 0, draggedItem);
      } else {
        updated.push(draggedItem);
      }
    } else {
      let lastInRegionIdx = -1;
      for (let i = updated.length - 1; i >= 0; i--) {
        if ((updated[i].sectionRegion || updated[i].column) === regionId) {
          lastInRegionIdx = i;
          break;
        }
      }
      if (lastInRegionIdx !== -1) {
        updated.splice(lastInRegionIdx + 1, 0, draggedItem);
      } else {
        updated.push(draggedItem);
      }
    }

    setInstances(updated);
    setHasUnsavedChanges(true);
    setDraggedInstanceId(null);
    setDragOverTarget(null);
    showToast(`Moved "${draggedItem.sectionTitle}" into ${regionDef?.name || regionId} (${slotPosition === 'below_ad' ? 'Bottom' : 'Top'})!`, "success");
  };

  const handleDragEnd = () => {
    setDraggedInstanceId(null);
    setDragOverTarget(null);
  };

  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    try {
      if (typeof updateHomepageArticlePlacements === 'function') {
        await updateHomepageArticlePlacements(instances);
      }
      await fetch('/api/db/homepage-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: instances })
      });
      setHasUnsavedChanges(false);
      showToast("Homepage layout successfully saved & published live to all readers!", "success");
    } catch (e) {
      showToast("Saved layout to active session.", "info");
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetLayout = () => {
    if (!window.confirm("Reset homepage layout back to initial default?")) return;
    setInstances(createInitialInstances());
    setSelectedNode(null);
    setHasUnsavedChanges(true);
    showToast("Reset homepage layout to default.", "info");
  };

  const handleSelectArticleFromPicker = (article) => {
    if (!articlePickerTarget) return;
    const { instanceId, targetPath, childIndex } = articlePickerTarget;

    const isVid = isArticleCoverVideo(article);
    const effectiveVidUrl = getArticleCoverVideoUrl(article) || article.videoUrl || article.coverVideoUrl || article.originalCoverVideoUrl || '';
    const effectiveMediaType = isVid ? 'video' : (article.coverMediaType || 'image');

    updateInstance(instanceId, inst => {
      const cloned = JSON.parse(JSON.stringify(inst));
      if (targetPath === 'slide' && typeof childIndex === 'number') {
        if (cloned.slides?.[childIndex]) {
          cloned.slides[childIndex].id = article.id;
          cloned.slides[childIndex].title = article.title;
          cloned.slides[childIndex].subtitle = article.summary || article.subtitle;
          cloned.slides[childIndex].category = article.category;
          cloned.slides[childIndex].author = article.author;
          cloned.slides[childIndex].imageUrl = article.imageUrl || article.coverImageUrl;
          cloned.slides[childIndex].videoUrl = effectiveVidUrl;
          cloned.slides[childIndex].coverMediaType = effectiveMediaType;
          cloned.slides[childIndex].content = article.content || article.summary;
        }
      } else if (targetPath === 'mainStory') {
        if (cloned.mainStory) {
          cloned.mainStory.id = article.id;
          cloned.mainStory.title = article.title;
          cloned.mainStory.subtitle = article.summary || article.subtitle;
          cloned.mainStory.category = article.category;
          cloned.mainStory.author = article.author;
          cloned.mainStory.imageUrl = article.imageUrl || article.coverImageUrl;
          cloned.mainStory.videoUrl = effectiveVidUrl;
          cloned.mainStory.coverMediaType = effectiveMediaType;
          cloned.mainStory.content = article.content || article.summary;
        }
        cloned.selectionMode = 'manual';
        cloned.pinnedArticleId = article.id;
      } else if (targetPath === 'subStory' && typeof childIndex === 'number') {
        if (cloned.subStories?.[childIndex]) {
          cloned.subStories[childIndex].id = article.id;
          cloned.subStories[childIndex].title = article.title;
          cloned.subStories[childIndex].subtitle = article.summary || article.subtitle;
          cloned.subStories[childIndex].category = article.category;
          cloned.subStories[childIndex].author = article.author;
          cloned.subStories[childIndex].imageUrl = article.imageUrl || article.coverImageUrl;
          cloned.subStories[childIndex].videoUrl = effectiveVidUrl;
          cloned.subStories[childIndex].coverMediaType = effectiveMediaType;
        }
      } else if (targetPath === 'storyItem' && typeof childIndex === 'number') {
        if (cloned.stories?.[childIndex]) {
          cloned.stories[childIndex].id = article.id;
          cloned.stories[childIndex].title = article.title;
          cloned.stories[childIndex].subtitle = article.summary || article.subtitle;
          cloned.stories[childIndex].category = article.category;
          cloned.stories[childIndex].author = article.author;
          cloned.stories[childIndex].imageUrl = article.imageUrl || article.coverImageUrl;
          cloned.stories[childIndex].videoUrl = effectiveVidUrl;
          cloned.stories[childIndex].coverMediaType = effectiveMediaType;
        }
      }
      return cloned;
    });

    setArticlePickerTarget(null);
    showToast(`Applied article "${article.title.slice(0, 30)}..."!`, "success");
  };

  const handleUnpinInstance = (instanceId) => {
    updateInstance(instanceId, inst => ({
      ...inst,
      selectionMode: 'auto',
      pinnedArticleId: null
    }));
    showToast("Unpinned article. Slot is now in Auto-Feed mode from assigned categories.", "info");
  };

  const getInstancesForRegion = (regionId, slotPosition = null) => {
    return instances.filter(i => {
      if (i.enabled === false) return false;
      const matchesRegion = matchesInstanceToRegion(i, regionId);

      if (!matchesRegion) return false;

      if (slotPosition === 'below_ad') {
        return i.slotPosition === 'below_ad';
      } else if (slotPosition === 'above_ad') {
        return i.slotPosition !== 'below_ad';
      }

      return true;
    });
  };

  const renderBroadsheetAd = (zoneId, defaultLabel, defaultFormat = 'leaderboard') => {
    const matchingAd = (homepageAds || []).find(ad => 
      ad && (ad.dropZoneId === zoneId || ad.slotId === zoneId.replace(/^dropzone-/, '')) && ad.enabled !== false
    );

    if (!matchingAd) {
      return (
        <div style={{
          margin: '8px 0',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px dashed #26374d',
          background: 'rgba(15, 23, 42, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '10.5px',
          color: '#64748b',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Megaphone size={12} color="#38bdf8" />
            <span>📍 <strong>Ad Zone:</strong> {defaultLabel} ({defaultFormat})</span>
          </div>
          <span style={{ fontSize: '9.5px', color: '#94a3b8' }}>Configured in Homepage Ads</span>
        </div>
      );
    }

    return (
      <div style={{
        background: '#0c1522',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '10px 0',
        boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
        gap: '10px',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
          {matchingAd.mediaUrl && (
            <img 
              src={matchingAd.mediaUrl} 
              alt={matchingAd.sponsorName || 'Sponsor'} 
              style={{ width: '68px', height: '44px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} 
            />
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1px' }}>
              <span style={{ background: '#b90014', color: '#ffffff', fontSize: '8px', fontWeight: 900, padding: '1px 4px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {matchingAd.badgeText || 'SPONSORED'}
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800 }}>
                {matchingAd.sponsorName}
              </span>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {matchingAd.headline}
            </div>
          </div>
        </div>
        <button 
          type="button" 
          style={{ background: '#b90014', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
        >
          <span>{matchingAd.ctaText || 'EXPLORE'}</span>
          <ExternalLink size={10} />
        </button>
      </div>
    );
  };

  const renderSlotDropZone = (regionId, slotPosition, label = "Drop template here") => {
    const isTarget = dragOverTarget?.regionId === regionId && dragOverTarget?.slotPosition === slotPosition;
    const isAnyDragging = Boolean(draggedInstanceId);

    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDragOverSlot(e, regionId, slotPosition);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOverTarget({ regionId, slotPosition, instanceId: null });
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDropIntoSlot(e, regionId, slotPosition);
        }}
        style={{
          margin: '6px 0',
          padding: isTarget ? '10px 14px' : '6px 10px',
          minHeight: isTarget ? '48px' : isAnyDragging ? '38px' : '28px',
          boxSizing: 'border-box',
          borderRadius: '6px',
          border: `2px dashed ${isTarget ? '#38bdf8' : isAnyDragging ? '#2563eb' : '#1e293b'}`,
          background: isTarget ? 'rgba(56, 189, 248, 0.25)' : isAnyDragging ? 'rgba(37, 99, 235, 0.12)' : 'rgba(15, 23, 42, 0.25)',
          color: isTarget ? '#38bdf8' : isAnyDragging ? '#93c5fd' : '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: 800,
          transition: 'all 0.15s ease',
          boxShadow: isTarget ? '0 0 18px rgba(56, 189, 248, 0.5)' : isAnyDragging ? '0 0 8px rgba(37, 99, 235, 0.2)' : 'none',
          cursor: 'pointer',
          width: '100%',
          transform: isTarget ? 'scale(1.01)' : 'none'
        }}
      >
        <Plus size={12} color={isTarget ? "#38bdf8" : isAnyDragging ? "#93c5fd" : "#64748b"} />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {isTarget ? `⬇ Release to place in ${slotPosition === 'below_ad' ? 'BOTTOM (Below Ad)' : 'TOP (Above Ad)'}` : label}
        </span>
      </div>
    );
  };

  const renderTemplateCard = (inst, renderedRegion = null) => {
    const isDragging = draggedInstanceId === inst.instanceId;
    const isMainSelected = selectedNode?.instanceId === inst.instanceId;
    const sizeMode = inst.sizeMode || 'normal';
    const currentPos = inst.slotPosition === 'below_ad' ? 'below_ad' : 'above_ad';
    const currentRegion = renderedRegion || inst.sectionRegion || inst.column || 'hero_col1';
    const assignedCats = Array.isArray(inst.categories) ? inst.categories : [inst.category || "Top Stories"];

    const slidesList = Array.isArray(inst.slides) && inst.slides.length > 0 
      ? inst.slides 
      : (Array.isArray(inst.slideStories) && inst.slideStories.length > 0 ? inst.slideStories : [inst.mainStory || { title: "Featured Lead Story", category: "TOP STORY" }]);

    const activeSlideIdx = slideIndices[inst.instanceId] || 0;
    const currentSlide = slidesList[activeSlideIdx % slidesList.length] || slidesList[0];

    return (
      <div
        key={`${renderedRegion || inst.sectionRegion || 'card'}-${inst.instanceId}`}
        draggable
        onDragStart={(e) => handleDragStart(e, inst.instanceId)}
        onDragEnd={handleDragEnd}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          opacity: isDragging ? 0.35 : 1,
          borderRadius: '6px',
          transition: 'all 0.15s ease',
          position: 'relative',
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box'
        }}
      >
        {/* Crisp Single-Line Card Top Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#090e17',
          padding: '3px 6px',
          borderRadius: '5px',
          border: '1px solid #1e293b',
          height: '28px',
          boxSizing: 'border-box',
          gap: '4px',
          width: '100%',
          minWidth: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, flex: 1 }}>
            <div style={{ cursor: 'grab', color: '#38bdf8', display: 'flex', alignItems: 'center', flexShrink: 0 }} title="Drag to reorder or move template">
              <GripVertical size={12} />
            </div>
            <span style={{ fontSize: '7.5px', fontWeight: 900, background: inst.badgeColor || '#2563eb', color: '#ffffff', padding: '1px 4px', borderRadius: '2px', flexShrink: 0 }}>
              {inst.badge || 'TEMPLATE'}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {inst.sectionTitle}
            </span>
            {assignedCats.length > 1 && (
              <span 
                style={{ fontSize: '7.5px', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '1px 4px', borderRadius: '3px', whiteSpace: 'nowrap', flexShrink: 0 }}
                title={`Active in ${assignedCats.length} sections: ${assignedCats.join(', ')}`}
              >
                🔗 {assignedCats.length} Sections
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
            {/* Quick Move Up / Down Buttons */}
            <button
              type="button"
              onClick={() => handleMoveInstance(inst.instanceId, 'up', currentRegion)}
              title="Move up in section (or to Top)"
              style={{
                background: '#131d2c',
                color: '#38bdf8',
                border: '1px solid #26374d',
                padding: '0 4px',
                height: '20px',
                borderRadius: '3px',
                fontSize: '9px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => handleMoveInstance(inst.instanceId, 'down', currentRegion)}
              title="Move down in section (or to Bottom / below ad)"
              style={{
                background: '#131d2c',
                color: '#38bdf8',
                border: '1px solid #26374d',
                padding: '0 4px',
                height: '20px',
                borderRadius: '3px',
                fontSize: '9px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              ▼
            </button>

            {/* Direct Section & Position Destination Selector */}
            <select
              value={`${currentRegion}:${currentPos}`}
              onChange={(e) => {
                const [reg, slot] = e.target.value.split(':');
                handleMoveToRegion(inst.instanceId, reg, slot);
              }}
              title="Instantly move card to another section or position"
              style={{
                background: '#131d2c',
                border: '1px solid #334155',
                color: '#93c5fd',
                fontSize: '8.5px',
                fontWeight: 800,
                borderRadius: '3px',
                padding: '1px 2px',
                height: '20px',
                cursor: 'pointer',
                maxWidth: '85px'
              }}
            >
              <option value="hero_col1:above_ad">Hero Col 1</option>
              <option value="hero_col2:above_ad">Hero Col 2</option>
              <option value="hero_col3:above_ad">Editorial (Top)</option>
              <option value="hero_col3:below_ad">Editorial (Bottom)</option>
              <option value="national_global:above_ad">National (Top)</option>
              <option value="national_global:below_ad">National (Bottom)</option>
              <option value="world_geopolitics:above_ad">World (Top)</option>
              <option value="world_geopolitics:below_ad">World (Bottom)</option>
              <option value="tech_ai:above_ad">Tech & AI (Top)</option>
              <option value="tech_ai:below_ad">Tech & AI (Bottom)</option>
              <option value="markets_economy:above_ad">Markets (Top)</option>
              <option value="markets_economy:below_ad">Markets (Bottom)</option>
              <option value="sports_desk:above_ad">Sports Desk (Top)</option>
              <option value="sports_desk:below_ad">Sports Desk (Bottom)</option>
              <option value="lifestyle_culture:above_ad">Lifestyle (Top)</option>
              <option value="lifestyle_culture:below_ad">Lifestyle (Bottom)</option>
              <option value="deep_dives:above_ad">Deep Dives (Top)</option>
              <option value="deep_dives:below_ad">Deep Dives (Bottom)</option>
            </select>

            <select
              value={inst.templateType}
              onChange={(e) => handleSwitchTemplateType(inst.instanceId, e.target.value)}
              title="Switch template style"
              style={{
                background: '#131d2c',
                border: '1px solid #0284c7',
                color: '#38bdf8',
                fontSize: '9px',
                fontWeight: 800,
                borderRadius: '3px',
                padding: '1px 3px',
                height: '20px',
                cursor: 'pointer'
              }}
            >
              <option value="hero_lead">T1: Lead</option>
              <option value="hero_second_lead">T2: 2nd Lead</option>
              <option value="hero_stacked">T3: Stack</option>
              <option value="opinion">T4: Rail</option>
            </select>

            <button
              type="button"
              onClick={() => handleToggleSizeMode(inst.instanceId)}
              title={`Toggle size (Current: ${sizeMode})`}
              style={{
                background: sizeMode === 'compact' ? '#0891b2' : sizeMode === 'expanded' ? '#2563eb' : '#131d2c',
                color: '#ffffff',
                border: '1px solid #334155',
                padding: '1px 4px',
                height: '20px',
                borderRadius: '3px',
                fontSize: '8.5px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {sizeMode === 'compact' ? '⇲' : sizeMode === 'expanded' ? '⇱' : '⊡'}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedNode({ instanceId: inst.instanceId, nodeType: inst.slides ? 'slide' : 'mainStory', childIndex: activeSlideIdx });
                setIsInspectorOpen(true);
              }}
              style={{ background: '#131d2c', color: '#38bdf8', border: '1px solid #0284c7', padding: '1px 5px', height: '20px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
              title="Inspect"
            >
              <Edit3 size={8} /> Inspect
            </button>

            <button
              type="button"
              onClick={() => handleDuplicateInstance(inst.instanceId)}
              title="Duplicate"
              style={{ background: '#131d2c', color: '#cbd5e1', border: '1px solid #26374d', padding: '1px 4px', height: '20px', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Copy size={8} />
            </button>

            <button
              type="button"
              onClick={() => handleDeleteInstance(inst.instanceId, inst.sectionTitle)}
              title="Delete"
              style={{ background: 'transparent', color: '#ef4444', border: 'none', padding: '1px 3px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Trash2 size={10} />
            </button>
          </div>
        </div>

        {/* TEMPLATE 1: HERO LEAD CARD WITH AUTO-SLIDING CAROUSEL */}
        {inst.templateType === 'hero_lead' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', minWidth: 0 }}>
            <article
              onClick={() => {
                setSelectedNode({ instanceId: inst.instanceId, nodeType: 'slide', childIndex: activeSlideIdx });
                setIsInspectorOpen(true);
              }}
              style={{
                background: '#0d1420',
                borderRadius: '6px',
                border: `1.5px solid ${isMainSelected ? '#38bdf8' : '#1e293b'}`,
                boxShadow: isMainSelected ? '0 0 16px rgba(56, 189, 248, 0.35)' : 'none',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ height: sizeMode === 'compact' ? '130px' : sizeMode === 'expanded' ? '250px' : '185px', position: 'relative', overflow: 'hidden', width: '100%' }}>
                {isArticleCoverVideo(currentSlide) ? (
                  <ContinuousCoverVideo
                    key={`admin-lead-vid-${currentSlide.id || activeSlideIdx}`}
                    src={getArticleCoverVideoUrl(currentSlide)}
                    poster={formatCoverImageUrl(currentSlide?.imageUrl, currentSlide)}
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    controls={false}
                    playsInline={true}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img 
                    src={formatCoverImageUrl(currentSlide?.imageUrl, currentSlide)} 
                    alt={currentSlide?.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s ease' }} 
                  />
                )}
                
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13, 20, 32, 0.95) 0%, rgba(13, 20, 32, 0.3) 60%, transparent 100%)', pointerEvents: 'none' }} />
                
                {currentSlide?.hasAudio && (
                  <div style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(185, 0, 20, 0.9)', color: '#ffffff', fontSize: '8px', fontWeight: 800, padding: '1px 4px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '2px', zIndex: 10 }}>
                    <Volume2 size={9} />
                    <span>AUDIO</span>
                  </div>
                )}

                {slidesList.length > 1 && (
                  <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 4px', pointerEvents: 'none', zIndex: 10 }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlideIndices(prev => ({
                          ...prev,
                          [inst.instanceId]: (activeSlideIdx - 1 + slidesList.length) % slidesList.length
                        }));
                      }}
                      style={{ pointerEvents: 'auto', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#ffffff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <ChevronLeft size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlideIndices(prev => ({
                          ...prev,
                          [inst.instanceId]: (activeSlideIdx + 1) % slidesList.length
                        }));
                      }}
                      style={{ pointerEvents: 'auto', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#ffffff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <ChevronRight size={11} />
                    </button>
                  </div>
                )}

                <div style={{ position: 'absolute', bottom: '6px', left: '8px', right: '8px', zIndex: 5 }}>
                  <span style={{ fontSize: '7.5px', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1px', display: 'block' }}>
                    {currentSlide?.category || 'TOP STORY'}
                  </span>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: sizeMode === 'compact' ? '12.5px' : sizeMode === 'expanded' ? '16px' : '14px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, margin: '0 0 2px 0' }}>
                    {currentSlide?.title}
                  </h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '8.5px', color: '#94a3b8' }}>
                      By <strong style={{ color: '#e2e8f0' }}>{currentSlide?.author || 'Editorial Board'}</strong> • {currentSlide?.readTime || '4 min read'}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingArticle(currentSlide);
                      }}
                      style={{ background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #0284c7', color: '#38bdf8', fontSize: '8px', fontWeight: 800, padding: '1px 4px', borderRadius: '2px', cursor: 'pointer' }}
                    >
                      Read Full ↗
                    </button>
                  </div>
                </div>
              </div>

              {slidesList.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', padding: '4px 0', background: '#090e17', borderTop: '1px solid #16202e' }}>
                  {slidesList.map((_, dotIdx) => (
                    <button
                      key={`dot-${dotIdx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlideIndices(prev => ({ ...prev, [inst.instanceId]: dotIdx }));
                      }}
                      style={{
                        width: activeSlideIdx % slidesList.length === dotIdx ? '12px' : '4px',
                        height: '4px',
                        borderRadius: '2px',
                        background: activeSlideIdx % slidesList.length === dotIdx ? '#ef4444' : '#334155',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              )}
            </article>

            {/* Sub-Stories Equal-Height Grid (2 Column Sub Grid below Stage) */}
            {sizeMode !== 'compact' && Array.isArray(inst.subStories) && inst.subStories.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', width: '100%', minWidth: 0 }}>
                {inst.subStories.map((sub, sIdx) => {
                  const isSubSelected = selectedNode?.instanceId === inst.instanceId && selectedNode?.nodeType === 'subStory' && selectedNode?.childIndex === sIdx;

                  return (
                    <div
                      key={sub.id || sIdx}
                      onClick={() => {
                        setSelectedNode({ instanceId: inst.instanceId, nodeType: 'subStory', childIndex: sIdx });
                        setIsInspectorOpen(true);
                      }}
                      style={{
                        background: '#0d1420',
                        border: `1.5px solid ${isSubSelected ? '#38bdf8' : '#1e293b'}`,
                        borderRadius: '5px',
                        padding: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '135px',
                        boxSizing: 'border-box',
                        minWidth: 0
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        {isArticleCoverVideo(sub) ? (
                          <div style={{ width: '100%', height: '56px', overflow: 'hidden', borderRadius: '3px', marginBottom: '3px' }}>
                            <ContinuousCoverVideo
                              src={getArticleCoverVideoUrl(sub)}
                              poster={formatCoverImageUrl(sub.imageUrl, sub)}
                              autoPlay={true}
                              muted={true}
                              loop={true}
                              controls={false}
                              playsInline={true}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        ) : (
                          <img src={formatCoverImageUrl(sub.imageUrl, sub)} alt={sub.title} style={{ width: '100%', height: '56px', objectFit: 'cover', borderRadius: '3px', marginBottom: '3px' }} />
                        )}
                        <span style={{ fontSize: '7px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>{sub.category}</span>
                        <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2, marginTop: '1px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {sub.title}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px', borderTop: '1px solid #16202e', paddingTop: '2px' }}>
                        <span style={{ fontSize: '8px', color: '#64748b' }}>By {sub.author}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingArticle(sub);
                          }}
                          style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '7.5px', fontWeight: 800, padding: 0, cursor: 'pointer' }}
                        >
                          Read ↗
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TEMPLATE 2: SECOND LEAD CARD */}
        {inst.templateType === 'hero_second_lead' && (
          <article
            onClick={() => {
              setSelectedNode({ instanceId: inst.instanceId, nodeType: 'mainStory' });
              setIsInspectorOpen(true);
            }}
            style={{
              background: '#0d1420',
              border: `1.5px solid ${isMainSelected ? '#38bdf8' : '#1e293b'}`,
              borderRadius: '6px',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              width: '100%',
              minWidth: 0,
              boxSizing: 'border-box'
            }}
          >
            {isArticleCoverVideo(inst.mainStory) ? (
              <div style={{ width: '100%', height: sizeMode === 'compact' ? '80px' : sizeMode === 'expanded' ? '150px' : '105px', overflow: 'hidden' }}>
                <ContinuousCoverVideo
                  src={getArticleCoverVideoUrl(inst.mainStory)}
                  poster={formatCoverImageUrl(inst.mainStory?.imageUrl, inst.mainStory)}
                  autoPlay={true}
                  muted={true}
                  loop={true}
                  controls={false}
                  playsInline={true}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <img src={formatCoverImageUrl(inst.mainStory?.imageUrl, inst.mainStory)} alt={inst.mainStory?.title} style={{ width: '100%', height: sizeMode === 'compact' ? '80px' : sizeMode === 'expanded' ? '150px' : '105px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '6px 8px' }}>
              <span style={{ fontSize: '7.5px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>{inst.mainStory?.category}</span>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: sizeMode === 'compact' ? '11.5px' : '13px', fontWeight: 800, color: '#ffffff', margin: '2px 0', lineHeight: 1.2 }}>
                {inst.mainStory?.title}
              </h3>
              {sizeMode !== 'compact' && (
                <p style={{ fontSize: '9px', color: '#94a3b8', margin: '0 0 4px 0', lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {inst.mainStory?.subtitle}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '8.5px', color: '#64748b' }}>By {inst.mainStory?.author}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewingArticle(inst.mainStory);
                  }}
                  style={{ background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #0284c7', color: '#38bdf8', fontSize: '8px', fontWeight: 800, padding: '1px 4px', borderRadius: '2px', cursor: 'pointer' }}
                >
                  Read Article ↗
                </button>
              </div>
            </div>
          </article>
        )}

        {/* TEMPLATE 3: COMPACT STACKED STORIES FEED */}
        {inst.templateType === 'hero_stacked' && (
          <div style={{ background: '#070b10', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '5px', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #16202e', paddingBottom: '2px' }}>
              <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#059669' }}>{inst.sectionTitle}</span>
              <span style={{ fontSize: '8px', color: '#64748b' }}>{inst.stories?.length || 0} stories</span>
            </div>

            {(inst.stories || []).map((st, sIdx) => {
              const isItemSel = selectedNode?.instanceId === inst.instanceId && selectedNode?.nodeType === 'storyItem' && selectedNode?.childIndex === sIdx;

              return (
                <div
                  key={st.id || sIdx}
                  onClick={() => {
                    setSelectedNode({ instanceId: inst.instanceId, nodeType: 'storyItem', childIndex: sIdx });
                    setIsInspectorOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    padding: '3px 4px',
                    borderRadius: '3px',
                    background: isItemSel ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    border: `1px solid ${isItemSel ? '#38bdf8' : 'transparent'}`,
                    cursor: 'pointer',
                    minWidth: 0
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '7px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>{st.category}</span>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.title}</div>
                    <span style={{ fontSize: '8px', color: '#64748b' }}>{st.author}</span>
                  </div>
                  {isArticleCoverVideo(st) ? (
                    <div style={{ width: '42px', height: '30px', borderRadius: '3px', overflow: 'hidden', flexShrink: 0 }}>
                      <ContinuousCoverVideo
                        src={getArticleCoverVideoUrl(st)}
                        poster={formatCoverImageUrl(st.imageUrl, st)}
                        autoPlay={true}
                        muted={true}
                        loop={true}
                        controls={false}
                        playsInline={true}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <img src={formatCoverImageUrl(st.imageUrl, st)} alt={st.title} style={{ width: '42px', height: '30px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }} />
                  )}
                </div>
              );
            })}

            <div 
              onClick={() => showToast(`Links dynamically to /section/${getCategorySlug(inst.categories?.[0] || inst.category)}`, "info")}
              style={{ fontSize: '8.5px', fontWeight: 800, color: '#ef4444', cursor: 'pointer', paddingTop: '1px' }}
            >
              READ MORE TOP STORIES →
            </div>
          </div>
        )}

        {/* TEMPLATE 4: EDITORIAL OPINION & INTELLIGENCE RAIL */}
        {inst.templateType === 'opinion' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', minWidth: 0 }}>
            <div
              onClick={() => {
                setSelectedNode({ instanceId: inst.instanceId, nodeType: 'editorialOpinion' });
                setIsInspectorOpen(true);
              }}
              style={{
                background: '#0d1420',
                border: `1.5px solid ${selectedNode?.instanceId === inst.instanceId && selectedNode?.nodeType === 'editorialOpinion' ? '#38bdf8' : '#ca8a04'}`,
                borderRadius: '6px',
                padding: '8px',
                cursor: 'pointer',
                minWidth: 0,
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '2px' }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#d4af37' }} />
                <span style={{ fontSize: '7.5px', fontWeight: 800, color: '#d4af37', letterSpacing: '0.8px' }}>EDITORIAL OPINION</span>
              </div>
              <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '11.5px', fontWeight: 800, color: '#ffffff', margin: '0 0 2px 0', lineHeight: 1.2 }}>
                {inst.editorialOpinion?.title}
              </h4>
              <p style={{ fontSize: '8.5px', color: '#94a3b8', margin: '0 0 4px 0', lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {inst.editorialOpinion?.deck}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '8px', fontWeight: 800, color: '#ef4444' }}>{inst.editorialOpinion?.ctaText || 'READ OUR EDITORIALS →'}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewingArticle(inst.editorialOpinion);
                  }}
                  style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '7.5px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Inspect ↗
                </button>
              </div>
            </div>

            {sizeMode !== 'compact' && (
              <div
                onClick={() => {
                  setSelectedNode({ instanceId: inst.instanceId, nodeType: 'intelligenceStream' });
                  setIsInspectorOpen(true);
                }}
                style={{
                  background: '#070b10',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  minWidth: 0,
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '7.5px', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Flame size={8} /> {inst.intelligenceStream?.badge || 'LATEST INTELLIGENCE ⚡'}
                  </span>
                  <span style={{ fontSize: '7px', color: '#64748b' }}>{inst.intelligenceStream?.updatedLabel || 'UPDATED 2M AGO'}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {(inst.intelligenceStream?.items || []).slice(0, 3).map((it, iIdx) => (
                    <div key={it.id || iIdx} style={{ borderLeft: '2px solid #334155', paddingLeft: '4px', minWidth: 0 }}>
                      <span style={{ fontSize: '7px', fontWeight: 800, color: '#ef4444' }}>{it.time}</span>
                      <div style={{ fontSize: '8.5px', color: '#cbd5e1', lineHeight: 1.2, marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const selectedInstance = useMemo(() => {
    if (!selectedNode) return instances[0] || null;
    return instances.find(i => i.instanceId === selectedNode.instanceId) || instances[0] || null;
  }, [selectedNode, instances]);

  const selectedSlides = useMemo(() => {
    if (!selectedInstance) return [];
    if (Array.isArray(selectedInstance.slides)) return selectedInstance.slides;
    if (Array.isArray(selectedInstance.slideStories)) return selectedInstance.slideStories;
    if (selectedInstance.mainStory) return [selectedInstance.mainStory];
    return [];
  }, [selectedInstance]);

  const activeInspectorSlideIdx = selectedNode?.nodeType === 'slide' && typeof selectedNode?.childIndex === 'number' 
    ? selectedNode.childIndex 
    : 0;
  const currentInspectorSlide = selectedSlides[activeInspectorSlideIdx] || selectedSlides[0] || selectedInstance?.mainStory;

  return (
    <div suppressHydrationWarning style={{ minHeight: '100vh', background: '#080d14', color: '#f8fafc', padding: '20px 24px', boxSizing: 'border-box' }}>

      {/* TOP TITLE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
        }}>
          <LayoutGrid size={20} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
            Universal Homepage Template & Slot Placement Studio
          </h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
            Full broadsheet newspaper canvas with real live headlines, articles, interactive ads, and multi-slide carousels.
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS STRIP */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0d1420',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        padding: '10px 14px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('preview')}
            style={{
              background: activeTab === 'preview' ? '#2563eb' : '#131d2c',
              color: '#ffffff',
              border: `1px solid ${activeTab === 'preview' ? '#38bdf8' : '#26374d'}`,
              padding: '7px 14px',
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Eye size={13} /> Full Broadsheet Canvas
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            style={{
              background: activeTab === 'editor' ? '#2563eb' : '#131d2c',
              color: '#ffffff',
              border: `1px solid ${activeTab === 'editor' ? '#38bdf8' : '#26374d'}`,
              padding: '7px 14px',
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Columns size={13} /> Section Builder ({instances.length} Slots)
          </button>

          <button
            onClick={() => setIsTemplatesModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: '#38bdf8',
              border: '1px solid #0284c7',
              padding: '7px 14px',
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.2)'
            }}
          >
            <Layers size={13} color="#38bdf8" /> ✦ 4 Core Templates Picker
          </button>

          <button
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
            style={{
              background: isInspectorOpen ? 'rgba(56, 189, 248, 0.15)' : '#131d2c',
              color: isInspectorOpen ? '#38bdf8' : '#94a3b8',
              border: `1px solid ${isInspectorOpen ? '#0284c7' : '#26374d'}`,
              padding: '7px 12px',
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <PanelRight size={13} /> {isInspectorOpen ? 'Hide Inspector' : 'Show Inspector'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              background: '#b90014',
              color: '#ffffff',
              border: 'none',
              padding: '7px 14px',
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 2px 10px rgba(185, 0, 20, 0.35)'
            }}
          >
            <Plus size={14} /> Add Template Block
          </button>

          <button
            onClick={handleResetLayout}
            style={{
              background: '#131d2c',
              color: '#94a3b8',
              border: '1px solid #26374d',
              padding: '7px 12px',
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <RotateCcw size={12} /> Reset
          </button>

          <button
            onClick={handleSaveAndPublish}
            disabled={isSaving}
            style={{
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '7px 18px',
              borderRadius: '5px',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: isSaving ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)'
            }}
          >
            <Save size={14} />
            {isSaving ? 'Publishing Live...' : hasUnsavedChanges ? 'Save & Publish Live (Unsaved)' : 'Save & Publish Live'}
          </button>
        </div>
      </div>

      {/* TAB 1: SECTION BUILDER LIST VIEW (MATCHING USER SCREENSHOT 4 EXACTLY) */}
      {activeTab === 'editor' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
              Modular Homepage Slot Builder ({instances.length} Configured Section Slots)
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Configure category mapping (multi-select), pinning, and sizing per section.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {instances.map((inst, index) => {
              const assignedCategories = Array.isArray(inst.categories) ? inst.categories : [inst.category || "Top Stories"];
              const isPinned = inst.selectionMode === 'manual' || Boolean(inst.pinnedArticleId);

              return (
                <div
                  key={inst.instanceId || index}
                  style={{
                    background: '#0d1420',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 900, color: '#64748b' }}>#{index + 1}</span>
                      <span style={{ fontSize: '10px', fontWeight: 900, background: inst.badgeColor || '#2563eb', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {inst.badge || 'TEMPLATE'}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                        {inst.sectionTitle}
                      </span>
                      {isPinned && (
                        <span style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#f59e0b', fontSize: '9.5px', fontWeight: 800, padding: '1px 6px', borderRadius: '3px' }}>
                          📌 Story Pinned
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveInstance(inst.instanceId, 'up')}
                        title="Move Section Up"
                        style={{ background: '#131d2c', color: index === 0 ? '#475569' : '#cbd5e1', border: '1px solid #26374d', padding: '4px 8px', borderRadius: '4px', cursor: index === 0 ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={index === instances.length - 1}
                        onClick={() => handleMoveInstance(inst.instanceId, 'down')}
                        title="Move Section Down"
                        style={{ background: '#131d2c', color: index === instances.length - 1 ? '#475569' : '#cbd5e1', border: '1px solid #26374d', padding: '4px 8px', borderRadius: '4px', cursor: index === instances.length - 1 ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowDown size={12} />
                      </button>

                      {/* Size Mode Selector */}
                      <div style={{ display: 'flex', background: '#131d2c', border: '1px solid #26374d', borderRadius: '4px', padding: '2px' }}>
                        {['compact', 'normal', 'expanded'].map(mode => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => handleToggleSizeMode(inst.instanceId, mode)}
                            style={{
                              background: (inst.sizeMode || 'normal') === mode ? '#2563eb' : 'transparent',
                              color: '#ffffff',
                              border: 'none',
                              padding: '3px 8px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              textTransform: 'capitalize'
                            }}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>

                      {/* Duplicate Button */}
                      <button
                        type="button"
                        onClick={() => handleDuplicateInstance(inst.instanceId)}
                        title="Duplicate Section"
                        style={{ background: '#131d2c', color: '#38bdf8', border: '1px solid #0284c7', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Copy size={11} /> Copy
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteInstance(inst.instanceId, inst.sectionTitle)}
                        title="Delete Section"
                        style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    {/* Section Display Title */}
                    <div>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                        SECTION DISPLAY TITLE
                      </label>
                      <input
                        type="text"
                        value={inst.sectionTitle || ''}
                        onChange={(e) => updateInstance(inst.instanceId, { sectionTitle: e.target.value })}
                        style={{ width: '100%', background: '#070b10', border: '1px solid #1e293b', color: '#ffffff', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Target Region Slot */}
                    <div>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                        TARGET REGION & SLOT
                      </label>
                      <select
                        value={inst.sectionRegion || 'hero_col1'}
                        onChange={(e) => updateInstance(inst.instanceId, { sectionRegion: e.target.value })}
                        style={{ width: '100%', background: '#070b10', border: '1px solid #1e293b', color: '#ffffff', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        {HOMEPAGE_REGIONS.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Number of Articles */}
                    <div>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                        NUMBER OF ARTICLES TO SHOW
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={inst.itemCount || 4}
                        onChange={(e) => updateInstance(inst.instanceId, { itemCount: parseInt(e.target.value, 10) || 4 })}
                        style={{ width: '100%', background: '#070b10', border: '1px solid #1e293b', color: '#ffffff', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* Multi-Category Mapping Pills */}
                  <div>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                      ASSIGNED CATEGORIES (MULTI-SELECT SUPPORTED):
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {ALL_CATEGORIES.map(cat => {
                        const isAssigned = assignedCategories.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleToggleCategoryForInstance(inst.instanceId, cat)}
                            style={{
                              background: isAssigned ? 'rgba(37, 99, 235, 0.25)' : '#070b10',
                              border: isAssigned ? '1.5px solid #38bdf8' : '1px solid #1e293b',
                              color: isAssigned ? '#ffffff' : '#94a3b8',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isAssigned ? '#10b981' : '#475569' }} />
                            <span>{cat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Story Selection & Pinning Block */}
                  <div style={{ background: '#070b10', border: '1px solid #1e293b', borderRadius: '6px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <Pin size={14} color={isPinned ? "#f59e0b" : "#64748b"} />
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                          STORY SELECTION & PINNING
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: isPinned ? '#f59e0b' : '#cbd5e1' }}>
                          {isPinned 
                            ? `📌 Pinned: "${inst.mainStory?.title || inst.slides?.[0]?.title || 'Custom Story'}"`
                            : `⚡ Auto-Feed (Latest published articles from ${assignedCategories.join(', ')})`}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setArticlePickerTarget({ instanceId: inst.instanceId, targetPath: inst.slides ? 'slide' : 'mainStory', childIndex: 0 })}
                        style={{ background: '#131d2c', color: '#38bdf8', border: '1px solid #0284c7', padding: '5px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Pin size={11} /> Pick Story from Database
                      </button>

                      {isPinned && (
                        <button
                          type="button"
                          onClick={() => handleUnpinInstance(inst.instanceId)}
                          style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                        >
                          ✕ Unpin (Auto-Feed)
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE EDITABLE FULL BROADSHEET CANVAS (FULL UNCLIPPED RESPONSIVE LAYOUT) */}
      {activeTab === 'preview' && (
        <div style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
          
          <div style={{
            background: '#05080e',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            overflowX: 'auto',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#0d1420', borderBottom: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#ffffff' }}>
                  Full Homepage Broadsheet Layout (Live Interactive Slots, Active Ads & Resizable Templates)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '5px', background: '#080d14', padding: '2px', borderRadius: '5px', border: '1px solid #26374d' }}>
                <button
                  onClick={() => setPreviewViewport('desktop')}
                  style={{ background: previewViewport === 'desktop' ? '#2563eb' : 'transparent', color: '#ffffff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '10.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <Monitor size={11} /> Desktop
                </button>
                <button
                  onClick={() => setPreviewViewport('tablet')}
                  style={{ background: previewViewport === 'tablet' ? '#2563eb' : 'transparent', color: '#ffffff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '10.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <Tablet size={11} /> Tablet
                </button>
                <button
                  onClick={() => setPreviewViewport('mobile')}
                  style={{ background: previewViewport === 'mobile' ? '#2563eb' : 'transparent', color: '#ffffff', border: 'none', padding: '3px 8px', borderRadius: '3px', fontSize: '10.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <Smartphone size={11} /> Mobile
                </button>
              </div>
            </div>

            <div style={{
              width: '100%',
              maxWidth: previewViewport === 'desktop' ? '100%' : previewViewport === 'tablet' ? '768px' : '420px',
              margin: '0 auto',
              padding: '16px 20px',
              background: '#090e17',
              boxSizing: 'border-box',
              minWidth: 0
            }}>
              
              {/* ZONE 1: MASTHEAD TOP BANNER AD */}
              {renderBroadsheetAd('dropzone-masthead-top', 'Masthead Top Banner (Below Header)', 'leaderboard')}

              {/* ETPrime-Style Promotional Offer Strip */}
              <div style={{ background: '#c2410c', borderRadius: '6px', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0', flexWrap: 'wrap', gap: '8px', boxShadow: '0 4px 12px rgba(194, 65, 12, 0.3)', boxSizing: 'border-box', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0 }}>
                  <span style={{ background: '#000000', color: '#f97316', fontSize: '8.5px', fontWeight: 900, padding: '2px 5px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    PRO EDITION
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
                    Gift Yourself Financial & Geopolitical Clarity with Daily Brief Prime
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#fed7aa', fontWeight: 700 }}>
                    ⏱ Free Trial Offer Extended For 04 : 12 : 38
                  </span>
                </div>
                <button 
                  type="button"
                  style={{ background: '#ea580c', border: '1px solid #ffedd5', color: '#ffffff', fontSize: '10.5px', fontWeight: 900, padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <span>Start Free Trial @ ₹0</span>
                  <ArrowUpRight size={12} />
                </button>
              </div>

              {/* Live Breaking News Alert Wire Ticker */}
              <div style={{ background: '#070b10', border: '1px solid #1e293b', padding: '6px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '11px', boxSizing: 'border-box', width: '100%' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 8px #ef4444' }} />
                <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '8.5px', fontWeight: 900, padding: '2px 5px', borderRadius: '2px', textTransform: 'uppercase' }}>
                  BREAKING WIRE
                </span>
                <span style={{ color: '#cbd5e1', flex: 1, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  GLOBAL MARKETS: Tech stocks rally following record quarterly cloud earnings & AI hardware demand.
                </span>
                <span style={{ color: '#ef4444', fontWeight: 900, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  TODAY'S E-PAPER 📰
                </span>
              </div>

              {/* Masthead Newspaper Header */}
              <div style={{ borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '12px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Search size={11} /> Search Newsroom
                  </span>
                  <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 900, letterSpacing: '2px', color: '#ffffff', margin: 0 }}>
                    DAILY BRIEF
                  </h1>
                  <span style={{ background: '#b90014', color: '#ffffff', fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '3px' }}>
                    SUBSCRIBE
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '10.5px', fontWeight: 700, color: '#94a3b8' }}>
                  <span style={{ color: '#ef4444' }}>Top Stories</span>
                  <span>Tech & AI</span>
                  <span>Global Affairs</span>
                  <span>Markets & Economy</span>
                  <span>Science & Climate</span>
                  <span>Movies</span>
                  <span>Lifestyle</span>
                  <span>Sports</span>
                  <span>Opinion & Essays</span>
                  <span>Culture & Design</span>
                  <span style={{ color: '#38bdf8' }}>Deep Dives 💎</span>
                </div>
              </div>

              {/* ZONE 2: ABOVE HERO SPOTLIGHT AD */}
              {renderBroadsheetAd('dropzone-hero-above', 'Above Hero Spotlight (Top Stories)', 'leaderboard')}

              {/* 3-COLUMN NEWSPAPER BROADSHEET HERO CLUSTER (100% Equal Baseline & Unclipped Columns) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: previewViewport === 'desktop' ? '4.2fr 3.2fr 2.6fr' : previewViewport === 'tablet' ? '1fr 1fr' : '1fr',
                background: '#070b10',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                
                {/* COLUMN 1: LEFT STAGE (Hero Column 1 / 42%) */}
                <div style={{
                  padding: '12px',
                  borderRight: previewViewport === 'desktop' ? '1px solid #1e293b' : 'none',
                  borderBottom: previewViewport !== 'desktop' ? '1px solid #1e293b' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: 0,
                  boxSizing: 'border-box'
                }}>
                  {renderSlotDropZone('hero_col1', 'above_ad', '✚ Drop at Top of Col 1')}
                  {getInstancesForRegion('hero_col1', 'above_ad').map(inst => renderTemplateCard(inst, 'hero_col1'))}
                  {getInstancesForRegion('hero_col1', 'below_ad').map(inst => renderTemplateCard(inst, 'hero_col1'))}
                  {renderSlotDropZone('hero_col1', 'below_ad', '✚ Drop at Bottom of Col 1')}
                </div>

                {/* COLUMN 2: CENTER FEATURES (Hero Column 2 / 32%) */}
                <div style={{
                  padding: '12px',
                  borderRight: previewViewport === 'desktop' ? '1px solid #1e293b' : 'none',
                  borderBottom: previewViewport !== 'desktop' ? '1px solid #1e293b' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: 0,
                  boxSizing: 'border-box'
                }}>
                  {renderSlotDropZone('hero_col2', 'above_ad', '✚ Drop at Top of Col 2')}
                  {getInstancesForRegion('hero_col2', 'above_ad').map(inst => renderTemplateCard(inst, 'hero_col2'))}
                  {getInstancesForRegion('hero_col2', 'below_ad').map(inst => renderTemplateCard(inst, 'hero_col2'))}
                  {renderSlotDropZone('hero_col2', 'below_ad', '✚ Drop at Bottom of Col 2')}
                </div>

                {/* COLUMN 3: RIGHT RAIL (Hero Column 3 / 26% Editorial Rail) */}
                <div style={{
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: 0,
                  boxSizing: 'border-box'
                }}>
                  {renderSlotDropZone('hero_col3', 'above_ad', '✚ Drop at Top of Rail')}
                  {getInstancesForRegion('hero_col3', 'above_ad').map(inst => renderTemplateCard(inst, 'hero_col3'))}
                  
                  {/* Sidebar Top Ad (Zone 6) */}
                  {renderBroadsheetAd('dropzone-sidebar-top', 'Sidebar Top (Above Intelligence)', 'rectangle')}
                  
                  {/* Sidebar Sticky Ad (Zone 7) */}
                  {renderBroadsheetAd('dropzone-sidebar-bottom', 'Sidebar Sticky (Below Intelligence)', 'rectangle')}
                  
                  {getInstancesForRegion('hero_col3', 'below_ad').map(inst => renderTemplateCard(inst, 'hero_col3'))}
                  {renderSlotDropZone('hero_col3', 'below_ad', '✚ Drop at Bottom of Rail')}
                </div>
              </div>

              {/* ZONE 3: HERO BOTTOM BILLBOARD AD */}
              {renderBroadsheetAd('dropzone-hero-bottom', 'Below Hero Section (Mid-Page Billboard)', 'billboard')}

              {/* SECTION 1: NATIONAL & GLOBAL AFFAIRS */}
              <div style={{ background: '#0d1420', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px', margin: '16px 0', boxSizing: 'border-box', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>
                    | National & Global Affairs
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>Slot Region: <strong style={{ color: '#38bdf8' }}>national_global</strong></span>
                </div>

                {renderSlotDropZone('national_global', 'above_ad', '✚ Drop in National Affairs (Top)')}
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                  {getInstancesForRegion('national_global', 'above_ad').map(inst => renderTemplateCard(inst, 'national_global'))}
                </div>
                {renderBroadsheetAd('dropzone-feed-row-1', 'In-Feed Native Stream (Inside National Affairs)', 'in_feed')}
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box', marginTop: getInstancesForRegion('national_global', 'below_ad').length > 0 ? '10px' : '0' }}>
                  {getInstancesForRegion('national_global', 'below_ad').map(inst => renderTemplateCard(inst, 'national_global'))}
                </div>
                {renderSlotDropZone('national_global', 'below_ad', '✚ Drop in National Affairs (Bottom)')}
              </div>

              {/* SECTION 2: WORLD & GEOPOLITICS */}
              <div style={{ background: '#0d1420', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px', margin: '16px 0', boxSizing: 'border-box', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                    | World & Geopolitics
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>Slot Region: <strong style={{ color: '#38bdf8' }}>world_geopolitics</strong></span>
                </div>

                {renderSlotDropZone('world_geopolitics', 'above_ad', '✚ Drop in World & Geopolitics (Top)')}
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                  {getInstancesForRegion('world_geopolitics', 'above_ad').map(inst => renderTemplateCard(inst, 'world_geopolitics'))}
                </div>
                {renderBroadsheetAd('dropzone-feed-row-2', 'In-Feed Native Stream (Inside World & Geopolitics)', 'in_feed')}
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box', marginTop: getInstancesForRegion('world_geopolitics', 'below_ad').length > 0 ? '10px' : '0' }}>
                  {getInstancesForRegion('world_geopolitics', 'below_ad').map(inst => renderTemplateCard(inst, 'world_geopolitics'))}
                </div>
                {renderSlotDropZone('world_geopolitics', 'below_ad', '✚ Drop in World & Geopolitics (Bottom)')}
              </div>

              {/* SECTION 3: TECH & AI INNOVATION HUB */}
              <div style={{ background: '#0d1420', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px', margin: '16px 0', boxSizing: 'border-box', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                    | Tech & AI Innovation Hub
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>Slot Region: <strong style={{ color: '#38bdf8' }}>tech_ai</strong></span>
                </div>

                {renderSlotDropZone('tech_ai', 'above_ad', '✚ Drop in Tech & AI (Top)')}
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                  {getInstancesForRegion('tech_ai', 'above_ad').map(inst => renderTemplateCard(inst, 'tech_ai'))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box', marginTop: getInstancesForRegion('tech_ai', 'below_ad').length > 0 ? '10px' : '0' }}>
                  {getInstancesForRegion('tech_ai', 'below_ad').map(inst => renderTemplateCard(inst, 'tech_ai'))}
                </div>
                {renderSlotDropZone('tech_ai', 'below_ad', '✚ Drop in Tech & AI (Bottom)')}
              </div>

              {/* SECTION 4: MARKETS, ECONOMY & WEALTH */}
              <div style={{ background: '#0d1420', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px', margin: '16px 0', boxSizing: 'border-box', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                    | Markets, Economy & Wealth
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>Slot Region: <strong style={{ color: '#38bdf8' }}>markets_economy</strong></span>
                </div>

                {renderSlotDropZone('markets_economy', 'above_ad', '✚ Drop in Markets & Economy (Top)')}
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                  {getInstancesForRegion('markets_economy', 'above_ad').map(inst => renderTemplateCard(inst, 'markets_economy'))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box', marginTop: getInstancesForRegion('markets_economy', 'below_ad').length > 0 ? '10px' : '0' }}>
                  {getInstancesForRegion('markets_economy', 'below_ad').map(inst => renderTemplateCard(inst, 'markets_economy'))}
                </div>
                {renderSlotDropZone('markets_economy', 'below_ad', '✚ Drop in Markets (Bottom)')}
              </div>

              {/* ZONE 8: DEEP DIVES HEADER AD */}
              {renderBroadsheetAd('dropzone-deep-dives-top', 'Deep Dives 💎 Investigations Header Banner', 'deep_dives')}

              {/* SECTION 5: DEEP DIVES */}
              <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.25)', margin: '16px 0', boxSizing: 'border-box', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 800, fontSize: '14px' }}>
                    <span>💎 DEEP DIVES (Subscribers Exclusive Investigative Series)</span>
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>Slot Region: <strong style={{ color: '#38bdf8' }}>deep_dives</strong></span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#94a3b8', marginBottom: '10px' }}>
                  In-depth investigative briefings, market forensic audits, and comprehensive long-form reports reserved exclusively for active subscribers.
                </div>

                {renderSlotDropZone('deep_dives', 'above_ad', '✚ Drop in Deep Dives (Top)')}
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                  {getInstancesForRegion('deep_dives', 'above_ad').map(inst => renderTemplateCard(inst, 'deep_dives'))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box', marginTop: getInstancesForRegion('deep_dives', 'below_ad').length > 0 ? '10px' : '0' }}>
                  {getInstancesForRegion('deep_dives', 'below_ad').map(inst => renderTemplateCard(inst, 'deep_dives'))}
                </div>
                {renderSlotDropZone('deep_dives', 'below_ad', '✚ Drop in Deep Dives (Bottom)')}
              </div>

              {/* SECTION 6: SPORTS DESK & SCORECARDS */}
              <div style={{ background: '#0d1420', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px', margin: '16px 0', boxSizing: 'border-box', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                    | Sports Desk & Scorecards
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>Slot Region: <strong style={{ color: '#38bdf8' }}>sports_desk</strong></span>
                </div>

                {renderSlotDropZone('sports_desk', 'above_ad', '✚ Drop in Sports Desk (Top)')}
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                  {getInstancesForRegion('sports_desk', 'above_ad').map(inst => renderTemplateCard(inst, 'sports_desk'))}
                </div>
                {renderBroadsheetAd('dropzone-feed-row-sports', 'In-Feed Native Stream (Inside Sports)', 'in_feed')}
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box', marginTop: getInstancesForRegion('sports_desk', 'below_ad').length > 0 ? '10px' : '0' }}>
                  {getInstancesForRegion('sports_desk', 'below_ad').map(inst => renderTemplateCard(inst, 'sports_desk'))}
                </div>
                {renderSlotDropZone('sports_desk', 'below_ad', '✚ Drop in Sports Desk (Bottom)')}
              </div>

              {/* SECTION 7: LIFESTYLE, CULTURE & MOVIES */}
              <div style={{ background: '#0d1420', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px', margin: '16px 0', boxSizing: 'border-box', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase' }}>
                    | Lifestyle, Culture & Entertainment
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>Slot Region: <strong style={{ color: '#38bdf8' }}>lifestyle_culture</strong></span>
                </div>

                {renderSlotDropZone('lifestyle_culture', 'above_ad', '✚ Drop in Lifestyle & Culture (Top)')}
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                  {getInstancesForRegion('lifestyle_culture', 'above_ad').map(inst => renderTemplateCard(inst, 'lifestyle_culture'))}
                </div>
                {renderBroadsheetAd('dropzone-feed-row-lifestyle', 'In-Feed Native Stream (Inside Lifestyle)', 'in_feed')}
                <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'desktop' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '10px', width: '100%', boxSizing: 'border-box', marginTop: getInstancesForRegion('lifestyle_culture', 'below_ad').length > 0 ? '10px' : '0' }}>
                  {getInstancesForRegion('lifestyle_culture', 'below_ad').map(inst => renderTemplateCard(inst, 'lifestyle_culture'))}
                </div>
                {renderSlotDropZone('lifestyle_culture', 'below_ad', '✚ Drop in Lifestyle (Bottom)')}
              </div>

              {/* ZONE 9: FOOTER FLOATING AD */}
              {renderBroadsheetAd('dropzone-footer-floating', 'Bottom Floating Footer Anchor Bar', 'leaderboard')}

            </div>
          </div>

          {/* DEDICATED SLIDE-OVER LIVE CARD INSPECTOR DRAWER (MODAL OVERLAY STYLE) */}
          {isInspectorOpen && selectedInstance && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setIsInspectorOpen(false)}>
              <aside
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '420px',
                  maxWidth: '92vw',
                  height: '100vh',
                  background: '#0d1420',
                  borderLeft: '1.5px solid #2563eb',
                  padding: '20px',
                  boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.8)',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SlidersIcon size={17} color="#38bdf8" />
                    <span style={{ fontSize: '14.5px', fontWeight: 900, color: '#ffffff' }}>Live Card Inspector</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleDuplicateInstance(selectedInstance.instanceId)}
                      title="Duplicate this instance with all sliding news"
                      style={{ background: '#131d2c', color: '#cbd5e1', border: '1px solid #26374d', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700 }}
                    >
                      <Copy size={11} /> Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInspectorOpen(false)}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                      title="Close Inspector"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ background: '#070b10', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '9px', fontWeight: 900, background: selectedInstance.badgeColor || '#2563eb', color: '#ffffff', padding: '2px 5px', borderRadius: '3px' }}>
                    {selectedInstance.badge || 'TEMPLATE'}
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                    {selectedInstance.sectionTitle}
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                    1. HOMEPAGE REGION & PLACEMENT SLOT
                  </label>
                  <select
                    value={selectedInstance.sectionRegion || 'hero_col1'}
                    onChange={(e) => updateInstance(selectedInstance.instanceId, { sectionRegion: e.target.value })}
                    style={{ width: '100%', background: '#090e17', border: '1px solid #1e293b', color: '#ffffff', padding: '7px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', marginBottom: '8px' }}
                  >
                    {HOMEPAGE_REGIONS.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        updateInstance(selectedInstance.instanceId, { slotPosition: 'above_ad' });
                        showToast("Position set to Top (Above Ad)", "info");
                      }}
                      style={{
                        background: (selectedInstance.slotPosition || 'above_ad') !== 'below_ad' ? '#2563eb' : '#131d2c',
                        border: `1.5px solid ${(selectedInstance.slotPosition || 'above_ad') !== 'below_ad' ? '#38bdf8' : '#26374d'}`,
                        color: '#ffffff',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      ✚ Top (Above Ad)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateInstance(selectedInstance.instanceId, { slotPosition: 'below_ad' });
                        showToast("Position set to Bottom (Below Ad)", "info");
                      }}
                      style={{
                        background: selectedInstance.slotPosition === 'below_ad' ? '#2563eb' : '#131d2c',
                        border: `1.5px solid ${selectedInstance.slotPosition === 'below_ad' ? '#38bdf8' : '#26374d'}`,
                        color: '#ffffff',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      ✚ Bottom (Below Ad)
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleMoveInstance(selectedInstance.instanceId, 'up')}
                      style={{ flex: 1, background: '#131d2c', border: '1px solid #334155', color: '#38bdf8', padding: '5px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      ▲ Move Up
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveInstance(selectedInstance.instanceId, 'down')}
                      style={{ flex: 1, background: '#131d2c', border: '1px solid #334155', color: '#38bdf8', padding: '5px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      ▼ Move Down
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                    2. TEMPLATE SIZE MODE
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', width: '100%' }}>
                    {[
                      { id: 'compact', label: '⇲ Compact', desc: 'Narrow slots' },
                      { id: 'normal', label: '⊡ Normal', desc: 'Standard' },
                      { id: 'expanded', label: '⇱ Expanded', desc: 'Hero wide' }
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleToggleSizeMode(selectedInstance.instanceId, m.id)}
                        style={{
                          background: (selectedInstance.sizeMode || 'normal') === m.id ? '#2563eb' : '#131d2c',
                          color: '#ffffff',
                          border: `1.5px solid ${(selectedInstance.sizeMode || 'normal') === m.id ? '#38bdf8' : '#26374d'}`,
                          padding: '6px 4px',
                          borderRadius: '6px',
                          fontSize: '10.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: (selectedInstance.sizeMode || 'normal') === m.id ? '0 0 10px rgba(56, 189, 248, 0.3)' : 'none'
                        }}
                      >
                        <div>{m.label}</div>
                        <div style={{ fontSize: '8px', color: (selectedInstance.sizeMode || 'normal') === m.id ? '#93c5fd' : '#64748b', marginTop: '1px' }}>{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                    3. SWITCH TEMPLATE BLUEPRINT
                  </label>
                  <select
                    value={selectedInstance.templateType}
                    onChange={(e) => handleSwitchTemplateType(selectedInstance.instanceId, e.target.value)}
                    style={{ width: '100%', background: '#090e17', border: '1px solid #0284c7', color: '#38bdf8', padding: '7px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    {BASE_TEMPLATE_DEFINITIONS.map(t => (
                      <option key={t.type} value={t.type}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                    4. DISPLAY TITLE
                  </label>
                  <input
                    type="text"
                    value={selectedInstance.sectionTitle || ''}
                    onChange={(e) => updateInstance(selectedInstance.instanceId, { sectionTitle: e.target.value })}
                    style={{ width: '100%', background: '#090e17', border: '1px solid #1e293b', color: '#ffffff', padding: '7px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                </div>

                {/* Active Across Selected Sections Banner */}
                {(() => {
                  const assignedList = selectedInstance.categories || [selectedInstance.category || "Top Stories"];
                  return (
                    <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '6px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '9.5px', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>
                          ⚡ Multi-Section Distribution:
                        </span>
                        <span style={{ fontSize: '9px', fontWeight: 800, background: '#2563eb', color: '#ffffff', padding: '1px 5px', borderRadius: '3px' }}>
                          {assignedList.length} Active {assignedList.length === 1 ? 'Section' : 'Sections'}
                        </span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: 1.35 }}>
                        This template will automatically render across all selected sections below:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                        {assignedList.map(c => (
                          <span key={c} style={{ fontSize: '9.5px', fontWeight: 800, background: '#131d2c', color: '#38bdf8', border: '1px solid #26374d', padding: '2px 6px', borderRadius: '3px' }}>
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Multi-Category Mapping in Inspector */}
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                    5. ASSIGNED CATEGORIES (MULTI-SELECT):
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {ALL_CATEGORIES.map(cat => {
                      const isAssigned = (selectedInstance.categories || [selectedInstance.category || "Top Stories"]).includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleToggleCategoryForInstance(selectedInstance.instanceId, cat)}
                          style={{
                            background: isAssigned ? 'rgba(37, 99, 235, 0.25)' : '#070b10',
                            border: isAssigned ? '1.5px solid #38bdf8' : '1px solid #1e293b',
                            color: isAssigned ? '#ffffff' : '#94a3b8',
                            padding: '3px 8px',
                            borderRadius: '16px',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isAssigned ? '#10b981' : '#475569' }} />
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedInstance.templateType === 'hero_lead' && selectedSlides.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>
                        Sliding Carousel Stories ({selectedSlides.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setArticlePickerTarget({ instanceId: selectedInstance.instanceId, targetPath: 'slide', childIndex: activeInspectorSlideIdx })}
                        style={{ background: '#131d2c', color: '#38bdf8', border: '1px solid #0284c7', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Pick from DB ↗
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
                      {selectedSlides.map((s, sIdx) => (
                        <button
                          key={s.id || sIdx}
                          type="button"
                          onClick={() => setSelectedNode({ instanceId: selectedInstance.instanceId, nodeType: 'slide', childIndex: sIdx })}
                          style={{
                            background: activeInspectorSlideIdx === sIdx ? '#2563eb' : '#131d2c',
                            color: '#ffffff',
                            border: `1px solid ${activeInspectorSlideIdx === sIdx ? '#38bdf8' : '#26374d'}`,
                            padding: '3px 6px',
                            borderRadius: '4px',
                            fontSize: '9.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Slide #{sIdx + 1}
                        </button>
                      ))}
                    </div>

                    {currentInspectorSlide && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#090e17', padding: '8px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '9.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>SLIDE HEADLINE</label>
                          <input
                            type="text"
                            value={currentInspectorSlide.title || ''}
                            onChange={(e) => updateInstance(selectedInstance.instanceId, inst => {
                              const cloned = JSON.parse(JSON.stringify(inst));
                              if (cloned.slides?.[activeInspectorSlideIdx]) {
                                cloned.slides[activeInspectorSlideIdx].title = e.target.value;
                              }
                              return cloned;
                            })}
                            style={{ width: '100%', background: '#0d1420', border: '1px solid #1e293b', color: '#ffffff', padding: '5px 7px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                            <label style={{ fontSize: '9.5px', fontWeight: 700, color: '#94a3b8' }}>MEDIA IMAGE / VIDEO URL</label>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                type="button"
                                onClick={() => updateInstance(selectedInstance.instanceId, inst => {
                                  const cloned = JSON.parse(JSON.stringify(inst));
                                  if (cloned.slides?.[activeInspectorSlideIdx]) {
                                    cloned.slides[activeInspectorSlideIdx].coverMediaType = 'image';
                                  }
                                  return cloned;
                                })}
                                style={{
                                  background: currentInspectorSlide.coverMediaType !== 'video' ? '#2563eb' : '#1e293b',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '1px 5px',
                                  borderRadius: '3px',
                                  fontSize: '8.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                Image
                              </button>
                              <button
                                type="button"
                                onClick={() => updateInstance(selectedInstance.instanceId, inst => {
                                  const cloned = JSON.parse(JSON.stringify(inst));
                                  if (cloned.slides?.[activeInspectorSlideIdx]) {
                                    cloned.slides[activeInspectorSlideIdx].coverMediaType = 'video';
                                    if (!cloned.slides[activeInspectorSlideIdx].videoUrl) {
                                      cloned.slides[activeInspectorSlideIdx].videoUrl = cloned.slides[activeInspectorSlideIdx].imageUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
                                    }
                                  }
                                  return cloned;
                                })}
                                style={{
                                  background: currentInspectorSlide.coverMediaType === 'video' ? '#7c3aed' : '#1e293b',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '1px 5px',
                                  borderRadius: '3px',
                                  fontSize: '8.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                Video 🎬
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            value={currentInspectorSlide.coverMediaType === 'video' ? (currentInspectorSlide.videoUrl || currentInspectorSlide.imageUrl || '') : (currentInspectorSlide.imageUrl || currentInspectorSlide.videoUrl || '')}
                            onChange={(e) => updateInstance(selectedInstance.instanceId, inst => {
                              const cloned = JSON.parse(JSON.stringify(inst));
                              const val = e.target.value;
                              const isVid = isArticleCoverVideo({ imageUrl: val, videoUrl: val, category: currentInspectorSlide.category, title: currentInspectorSlide.title });
                              if (cloned.slides?.[activeInspectorSlideIdx]) {
                                cloned.slides[activeInspectorSlideIdx].imageUrl = val;
                                if (isVid || cloned.slides[activeInspectorSlideIdx].coverMediaType === 'video') {
                                  cloned.slides[activeInspectorSlideIdx].videoUrl = val;
                                  cloned.slides[activeInspectorSlideIdx].coverMediaType = 'video';
                                }
                              }
                              return cloned;
                            })}
                            placeholder="https://... image or video (.mp4, gdrive, stream)"
                            style={{ width: '100%', background: '#0d1420', border: '1px solid #1e293b', color: '#ffffff', padding: '5px 7px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '9.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>CATEGORY KICKER</label>
                          <input
                            type="text"
                            value={currentInspectorSlide.category || ''}
                            onChange={(e) => updateInstance(selectedInstance.instanceId, inst => {
                              const cloned = JSON.parse(JSON.stringify(inst));
                              if (cloned.slides?.[activeInspectorSlideIdx]) {
                                cloned.slides[activeInspectorSlideIdx].category = e.target.value;
                              }
                              return cloned;
                            })}
                            style={{ width: '100%', background: '#0d1420', border: '1px solid #1e293b', color: '#ffffff', padding: '5px 7px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '9.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>DECK / SUBTITLE</label>
                          <textarea
                            rows={2}
                            value={currentInspectorSlide.subtitle || ''}
                            onChange={(e) => updateInstance(selectedInstance.instanceId, inst => {
                              const cloned = JSON.parse(JSON.stringify(inst));
                              if (cloned.slides?.[activeInspectorSlideIdx]) {
                                cloned.slides[activeInspectorSlideIdx].subtitle = e.target.value;
                              }
                              return cloned;
                            })}
                            style={{ width: '100%', background: '#0d1420', border: '1px solid #1e293b', color: '#ffffff', padding: '5px 7px', borderRadius: '4px', fontSize: '10.5px', resize: 'vertical', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedInstance.templateType === 'hero_second_lead' && selectedInstance.mainStory && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>Second Lead Content</span>
                      <button
                        type="button"
                        onClick={() => setArticlePickerTarget({ instanceId: selectedInstance.instanceId, targetPath: 'mainStory' })}
                        style={{ background: '#131d2c', color: '#38bdf8', border: '1px solid #0284c7', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Pick from DB ↗
                      </button>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '9.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '2px' }}>HEADLINE</label>
                      <input
                        type="text"
                        value={selectedInstance.mainStory?.title || ''}
                        onChange={(e) => updateInstance(selectedInstance.instanceId, inst => ({
                          ...inst,
                          mainStory: { ...inst.mainStory, title: e.target.value }
                        }))}
                        style={{ width: '100%', background: '#090e17', border: '1px solid #1e293b', color: '#ffffff', padding: '5px 7px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <label style={{ fontSize: '9.5px', fontWeight: 700, color: '#94a3b8' }}>IMAGE / VIDEO URL</label>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => updateInstance(selectedInstance.instanceId, inst => ({
                              ...inst,
                              mainStory: { ...inst.mainStory, coverMediaType: 'image' }
                            }))}
                            style={{
                              background: selectedInstance.mainStory?.coverMediaType !== 'video' ? '#2563eb' : '#1e293b',
                              color: '#ffffff',
                              border: 'none',
                              padding: '1px 5px',
                              borderRadius: '3px',
                              fontSize: '8.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Image
                          </button>
                          <button
                            type="button"
                            onClick={() => updateInstance(selectedInstance.instanceId, inst => ({
                              ...inst,
                              mainStory: {
                                ...inst.mainStory,
                                coverMediaType: 'video',
                                videoUrl: inst.mainStory?.videoUrl || inst.mainStory?.imageUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                              }
                            }))}
                            style={{
                              background: selectedInstance.mainStory?.coverMediaType === 'video' ? '#7c3aed' : '#1e293b',
                              color: '#ffffff',
                              border: 'none',
                              padding: '1px 5px',
                              borderRadius: '3px',
                              fontSize: '8.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Video 🎬
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={selectedInstance.mainStory?.coverMediaType === 'video' ? (selectedInstance.mainStory?.videoUrl || selectedInstance.mainStory?.imageUrl || '') : (selectedInstance.mainStory?.imageUrl || selectedInstance.mainStory?.videoUrl || '')}
                        onChange={(e) => updateInstance(selectedInstance.instanceId, inst => {
                          const val = e.target.value;
                          const isVid = isArticleCoverVideo({ imageUrl: val, videoUrl: val, category: inst.mainStory?.category, title: inst.mainStory?.title });
                          return {
                            ...inst,
                            mainStory: {
                              ...inst.mainStory,
                              imageUrl: val,
                              ...(isVid || inst.mainStory?.coverMediaType === 'video' ? { videoUrl: val, coverMediaType: 'video' } : {})
                            }
                          };
                        })}
                        placeholder="https://... image or video (.mp4, gdrive, stream)"
                        style={{ width: '100%', background: '#090e17', border: '1px solid #1e293b', color: '#ffffff', padding: '5px 7px', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsInspectorOpen(false)}
                    style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Done Inspecting
                  </button>
                </div>
              </aside>
            </div>
          )}

        </div>
      )}

      {/* MODAL 1: 4 CORE TEMPLATES & QUANTITY CHOOSER */}
      {isTemplatesModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0d1420', border: '1px solid #1e293b', borderRadius: '12px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  ✦ 4 Core Editorial Templates Factory
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Generate completely independent copies of any core template to place in any newsroom section.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplatesModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              {BASE_TEMPLATE_DEFINITIONS.map(tpl => {
                const isSelected = selectedCoreTemplate.type === tpl.type;

                return (
                  <div
                    key={tpl.type}
                    onClick={() => setSelectedCoreTemplate(tpl)}
                    style={{
                      background: isSelected ? 'rgba(37, 99, 235, 0.15)' : '#070b10',
                      border: `2px solid ${isSelected ? '#38bdf8' : '#1e293b'}`,
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ background: tpl.badgeColor, color: '#ffffff', fontSize: '9px', fontWeight: 900, padding: '2px 6px', borderRadius: '3px' }}>
                        {tpl.shortBadge}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>{tpl.label}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                      {tpl.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#070b10', padding: '16px', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  COPIES TO GENERATE
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4].map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setTemplateQuantityMode(q)}
                      style={{
                        background: templateQuantityMode === q ? '#2563eb' : '#131d2c',
                        color: '#ffffff',
                        border: `1px solid ${templateQuantityMode === q ? '#38bdf8' : '#26374d'}`,
                        padding: '6px 14px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  TARGET REGION SLOT
                </label>
                <select
                  value={templateTargetRegion}
                  onChange={(e) => setTemplateTargetRegion(e.target.value)}
                  style={{ width: '100%', background: '#0d1420', border: '1px solid #1e293b', color: '#ffffff', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}
                >
                  {HOMEPAGE_REGIONS.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsTemplatesModalOpen(false)}
                style={{ background: '#131d2c', color: '#cbd5e1', border: '1px solid #26374d', padding: '8px 18px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCoreTemplateCopies}
                style={{ background: '#10b981', color: '#ffffff', border: 'none', padding: '8px 22px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} /> Add {templateQuantityMode} Independent Copies
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: DATABASE ARTICLE PICKER */}
      {articlePickerTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0d1420', border: '1px solid #1e293b', borderRadius: '12px', width: '100%', maxWidth: '750px', maxHeight: '85vh', overflowY: 'auto', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '14px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Select Article from Published Database
              </h3>
              <button
                type="button"
                onClick={() => setArticlePickerTarget(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Search by title, author, or keywords..."
                value={articleSearchQuery}
                onChange={(e) => setArticleSearchQuery(e.target.value)}
                style={{ width: '100%', background: '#090e17', border: '1px solid #1e293b', color: '#ffffff', padding: '10px 14px', borderRadius: '6px', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
              {filteredArticlesForPicker.map(art => (
                <div
                  key={art.id}
                  onClick={() => handleSelectArticleFromPicker(art)}
                  style={{
                    background: '#070b10',
                    border: '1px solid #1e293b',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#ef4444' }}>{art.category}</span>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>{art.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>By {art.author} • {art.status}</div>
                  </div>
                  {art.imageUrl && (
                    <img src={formatCoverImageUrl(art.imageUrl, art)} alt={art.title} style={{ width: '60px', height: '42px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: WHOLE ARTICLE READER MODAL (SYNCHRONIZED MEDIA PIPELINE WITH VIDEO) */}
      {viewingArticle && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#0d1420', border: '1px solid #1e293b', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '9px', fontWeight: 900, padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                  {viewingArticle.category || 'NEWS'}
                </span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '8px 0 6px 0', lineHeight: 1.25 }}>
                  {viewingArticle.title}
                </h2>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  By <strong style={{ color: '#ffffff' }}>{viewingArticle.author || 'Super Admin'}</strong> • {viewingArticle.readTime || '5 min read'} • <span style={{ color: '#10b981' }}>Live Editorial Sync</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingArticle(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Video or Image Media Render (Synchronized with Homepage Reader) */}
            <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', minHeight: '200px' }}>
              <ArticleMediaCover
                article={viewingArticle}
                style={{ width: '100%', height: '360px', borderRadius: '8px' }}
                imageStyle={{ maxHeight: '360px', borderRadius: '8px' }}
                autoPlay={true}
                muted={false}
                loop={true}
                controls={true}
                playsInline={true}
                showCaption={true}
              />
            </div>

            {viewingArticle.subtitle && (
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#38bdf8', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.4 }}>
                {viewingArticle.subtitle}
              </div>
            )}

            <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {viewingArticle.content || viewingArticle.deck || "Article content rendered seamlessly from editorial placement configuration."}
            </div>

            <div style={{ marginTop: '24px', borderTop: '1px solid #1e293b', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setViewingArticle(null)}
                style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
              >
                Close Reader
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
