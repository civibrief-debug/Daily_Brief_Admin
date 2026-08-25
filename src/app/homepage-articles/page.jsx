"use client";

import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  INITIAL_HOMEPAGE_ARTICLE_SECTIONS, 
  HOMEPAGE_ARTICLE_PRESETS 
} from '../../data/mockInitialData';
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
  ExternalLink,
  Sliders,
  ChevronRight,
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
  Volume2,
  Lock,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  TrendingDown
} from 'lucide-react';

const ALL_CATEGORIES = [
  "All",
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

const AVAILABLE_BLOCK_TYPES = [
  { type: "hero_lead", label: "Dominant Hero Lead Story (Large Stage)", defaultCount: 1, badge: "HERO LEAD", icon: Sparkles },
  { type: "hero_sub_1", label: "Hero Sub Lead 1 (Compact Featured Box)", defaultCount: 1, badge: "HERO SUB 1", icon: Layers },
  { type: "hero_sub_2", label: "Hero Sub Lead 2 (Compact Featured Box)", defaultCount: 1, badge: "HERO SUB 2", icon: Layers },
  { type: "hero_second_lead", label: "Second Major Lead (Center Top)", defaultCount: 1, badge: "SECOND LEAD", icon: TrendingUp },
  { type: "hero_stacked", label: "Stacked Compact News Rows", defaultCount: 3, badge: "STACKED ROWS", icon: LayoutGrid },
  { type: "opinion", label: "Editorial Opinion Crest Box", defaultCount: 1, badge: "EDITORIAL OPINION", icon: BookOpen },
  { type: "section_band", label: "Section Band (Lead Feature + Horizontal Cards)", defaultCount: 4, badge: "SECTION BAND", icon: Globe },
  { type: "department_grid", label: "4-Column Newsroom Department Grid", defaultCount: 4, badge: "DEPARTMENT GRID", icon: Cpu },
  { type: "latest_intelligence", label: "Latest Intelligence / Real-Time Stream", defaultCount: 5, badge: "LATEST INTEL", icon: Flame },
  { type: "most_read", label: "Most Read Today (Numbered Ranking 1..5)", defaultCount: 5, badge: "MOST READ", icon: Hash },
  { type: "multicolumn_grid", label: "Multi-Column Article Grid (3 Columns)", defaultCount: 6, badge: "MULTI GRID", icon: LayoutGrid },
  { type: "curated_shelf", label: "Curated Horizontal Story Shelf", defaultCount: 5, badge: "CURATED SHELF", icon: Compass },
  { type: "deep_dives", label: "Special Investigations (Deep Dives 💎)", defaultCount: 3, badge: "DEEP DIVES", icon: Sparkles }
];

// Rich fallback articles for realistic broadsheet preview simulation
const PREVIEW_FALLBACK_ARTICLES = [
  {
    id: "fb-1",
    title: "Global Supply Chains Pivot to South Asia as High-Tech Manufacturing Inflows Surge",
    summary: "Multinational semiconductor and electronics manufacturers accelerate capital expenditure in Indian tech hubs amid strategic bilateral supply chain pacts.",
    category: "Global Affairs",
    author: "Aditya Sharma",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "fb-2",
    title: "Autonomous AI Compute Clusters Achieve Benchmark Energy Efficiency Milestones",
    summary: "Next-generation sub-2nm processor architectures drastically reduce datacenter thermal dissipation and carbon intensity.",
    category: "Tech & AI",
    author: "Elena Rostova",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fb-3",
    title: "Reserve Bank Maintains Neutral Monetary Stance Amid Stable Inflation Trajectory",
    summary: "Monetary Policy Committee votes 5-1 to hold key repo rates steady while prioritizing core capital formation.",
    category: "Markets & Economy",
    author: "Vikramaditya Roy",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fb-4",
    title: "Deep-Sea Minerals Treaty Draft Concluded Ahead of Multilateral Maritime Summit",
    summary: "Delegates agree on stringent environmental oversight frameworks for polymetallic nodule extraction zones.",
    category: "Global Affairs",
    author: "Sarah Jenkins",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fb-5",
    title: "Sovereign Bond Yields Contract Following Inflow of Global Passive Index Funds",
    summary: "Foreign portfolio investors purchase $4.2B in local sovereign paper over three consecutive trading sessions.",
    category: "Markets & Economy",
    author: "Aditya Sharma",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fb-6",
    title: "Quantum Key Distribution Protocol Established Across 500km Terrestrial Fiber",
    summary: "National scientific consortium demonstrates unhackable encryption for inter-banking financial settlement systems.",
    category: "Tech & AI",
    author: "Dr. Arvind Menon",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fb-7",
    title: "Private Credit Funds Expand Corporate Lending Footprint into Infrastructure",
    summary: "Non-bank institutional lenders deploy record structured debt across tollway and renewable power concessions.",
    category: "Credit News",
    author: "Rohan Varma",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fb-8",
    title: "World Athletics Tactical Blueprint: High-Performance Endurance Science",
    summary: "Biomechanical tracking and metabolic monitoring reshape elite marathon coaching frameworks.",
    category: "Sports",
    author: "Marcus Vance",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80"
  }
];

const DEFAULT_PREVIEW_IMG = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";

const getSafeImage = (story, fallbackIndex = 0) => {
  if (!story) return DEFAULT_PREVIEW_IMG;
  const url = (story.imageUrl || story.coverImageUrl || '').trim();
  if (url && url.length > 5 && !url.startsWith('data:,')) return url;
  const fallbacks = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80"
  ];
  return fallbacks[fallbackIndex % fallbacks.length];
};

export default function HomepageArticlePlacementPage() {
  const { 
    articles, 
    homepageArticleSections, 
    updateHomepageArticlePlacements, 
    showToast 
  } = useAdmin();

  const [sections, setSections] = useState(() => {
    if (Array.isArray(homepageArticleSections) && homepageArticleSections.length > 0) {
      return homepageArticleSections;
    }
    return INITIAL_HOMEPAGE_ARTICLE_SECTIONS;
  });

  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview' | 'presets'
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('all');
  const [pinningZoneId, setPinningZoneId] = useState(null); // Zone ID currently selecting an article for
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [articleCategoryFilter, setArticleCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Preview Specific Controls
  const [previewViewport, setPreviewViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [showEditorOverlay, setShowEditorOverlay] = useState(true); // Toggle zone badges and quick edit buttons in preview

  // New Block Form State
  const [newBlockType, setNewBlockType] = useState('department_grid');
  const [newBlockTitle, setNewBlockTitle] = useState('New Department Section');
  const [newBlockBadge, setNewBlockBadge] = useState('DEPARTMENT');
  const [newBlockCategory, setNewBlockCategory] = useState('Markets & Economy');
  const [newBlockCount, setNewBlockCount] = useState(4);

  // Filter published articles for pinning and preview
  const publishedArticles = useMemo(() => {
    return (articles || []).filter(a => a.status === 'Published');
  }, [articles]);

  const allArticlesPool = useMemo(() => {
    const pool = [...publishedArticles];
    PREVIEW_FALLBACK_ARTICLES.forEach(fb => {
      if (!pool.some(p => p.id === fb.id || (p.title || '').trim().toLowerCase() === (fb.title || '').trim().toLowerCase())) {
        pool.push(fb);
      }
    });
    return pool;
  }, [publishedArticles]);

  const filteredArticlesForPinning = useMemo(() => {
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

  // Handler to update a specific zone field
  const handleUpdateZone = (zoneId, updates) => {
    setSections(prev => prev.map(sec => sec.id === zoneId ? { ...sec, ...updates } : sec));
  };

  // Reorder Zones: Move Up / Down
  const handleMoveZone = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
    showToast(`Moved "${temp.sectionTitle || temp.zoneBadge}" ${direction}!`, "info");
  };

  // Add a new modular section block
  const handleCreateBlock = () => {
    const newId = `zone-custom-${Date.now()}`;
    const selectedTypeObj = AVAILABLE_BLOCK_TYPES.find(b => b.type === newBlockType);

    const newBlock = {
      id: newId,
      zoneName: `${newBlockTitle} (${newBlockBadge})`,
      zoneBadge: newBlockBadge || selectedTypeObj?.badge || 'SECTION',
      zoneType: newBlockType,
      sectionTitle: newBlockTitle,
      category: newBlockCategory,
      selectionMode: 'auto',
      pinnedArticleId: null,
      pinnedArticleTitle: null,
      itemCount: parseInt(newBlockCount) || 4,
      sortOrder: 'latest',
      enabled: true,
      description: `Custom ${selectedTypeObj?.label || 'Modular Section'}`
    };

    setSections(prev => [...prev, newBlock]);
    setIsAddModalOpen(false);
    showToast(`Added new section "${newBlockTitle}"!`, "success");
  };

  // Delete a section block
  const handleDeleteZone = (zoneId) => {
    if (confirm("Are you sure you want to remove this section from the homepage?")) {
      setSections(prev => prev.filter(s => s.id !== zoneId));
      showToast("Section removed from homepage.", "info");
    }
  };

  // Handler to pin an article to a zone
  const handlePinArticleToZone = (zoneId, article) => {
    setSections(prev => prev.map(sec => {
      if (sec.id === zoneId) {
        return {
          ...sec,
          selectionMode: 'manual',
          pinnedArticleId: article.id,
          pinnedArticleTitle: article.title,
          pinnedArticleImage: article.imageUrl || article.coverImageUrl,
          pinnedArticleAuthor: article.author,
          pinnedArticleCategory: article.category
        };
      }
      return sec;
    }));
    setPinningZoneId(null);
    showToast(`Pinned "${article.title.slice(0, 35)}..." to zone!`, "success");
  };

  // Handler to unpin article and revert to category auto mode
  const handleUnpinArticle = (zoneId) => {
    setSections(prev => prev.map(sec => {
      if (sec.id === zoneId) {
        return {
          ...sec,
          selectionMode: 'auto',
          pinnedArticleId: null,
          pinnedArticleTitle: null,
          pinnedArticleImage: null,
          pinnedArticleAuthor: null,
          pinnedArticleCategory: null
        };
      }
      return sec;
    }));
    showToast("Reverted to automatic category filtering.", "info");
  };

  // Apply a preset
  const handleApplyPreset = (preset) => {
    setSections(prev => {
      return prev.map(currentSec => {
        const matchingPresetSec = preset.sections.find(ps => ps.id === currentSec.id);
        if (matchingPresetSec) {
          return {
            ...currentSec,
            ...matchingPresetSec
          };
        }
        return currentSec;
      });
    });
    showToast(`Loaded Preset: ${preset.name}`, "info");
  };

  // Reset to default broadsheet
  const handleResetToDefaults = () => {
    if (confirm("Reset all homepage article placements and category assignments to system defaults?")) {
      setSections(INITIAL_HOMEPAGE_ARTICLE_SECTIONS);
      showToast("Reset homepage placements to initial defaults.", "info");
    }
  };

  // Save changes to database and context
  const handleSaveAndPublish = async () => {
    await updateHomepageArticlePlacements(sections);
  };

  // Helper to jump directly from Live Preview to editing that specific slot
  const handleJumpToEditor = (zoneId) => {
    setActiveTab('editor');
    setTimeout(() => {
      const el = document.getElementById(`zone-editor-card-${zoneId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.outline = '3px solid #3b82f6';
        setTimeout(() => { el.style.outline = 'none'; }, 2000);
      }
    }, 120);
  };

  // Helper to get configuration for a zone
  const getZoneConfig = (zoneId) => {
    return sections.find(s => s.id === zoneId);
  };

  // Helper to resolve articles for any zone
  const resolveZoneArticles = (zoneOrId, defaultCategory = 'all', defaultCount = 4) => {
    const zone = typeof zoneOrId === 'string' ? getZoneConfig(zoneOrId) : zoneOrId;
    const count = zone?.itemCount || defaultCount;

    if (zone?.selectionMode === 'manual' && zone?.pinnedArticleId) {
      const pinned = allArticlesPool.find(a => a.id === zone.pinnedArticleId);
      if (pinned) return [pinned];
    }

    const cat = (zone?.category || defaultCategory || 'all').toLowerCase();
    if (cat === 'all' || cat === 'top stories') {
      return allArticlesPool.slice(0, count);
    }

    const filtered = allArticlesPool.filter(a => {
      const c = (a.category || '').toLowerCase();
      return c.includes(cat) || cat.includes(c);
    });

    if (filtered.length > 0) {
      return filtered.slice(0, count);
    }
    return allArticlesPool.slice(0, count);
  };

  // Resolved story blocks for preview
  const leadStory = resolveZoneArticles('zone-hero-lead', 'All', 1)[0] || allArticlesPool[0];
  const secondLead = resolveZoneArticles('zone-hero-second-lead', 'All', 1)[0] || allArticlesPool[1];
  const subLead1 = resolveZoneArticles('zone-hero-sub-1', 'All', 1)[0] || allArticlesPool[2];
  const subLead2 = resolveZoneArticles('zone-hero-sub-2', 'All', 1)[0] || allArticlesPool[3];
  const heroStacked = resolveZoneArticles('zone-hero-stacked', 'All', 3);
  const band1Stories = resolveZoneArticles('zone-band-1', 'Global Affairs', 4);
  const band2Stories = resolveZoneArticles('zone-band-2', 'Global Affairs', 4);
  const dept1Stories = resolveZoneArticles('zone-dept-1', 'Markets & Economy', 4);
  const dept2Stories = resolveZoneArticles('zone-dept-2', 'Tech & AI', 4);

  const customDynamicSections = useMemo(() => {
    return sections.filter(s => s.id.startsWith('zone-custom-') && s.enabled !== false);
  }, [sections]);

  // Viewport Container Width
  const viewportWidth = previewViewport === 'desktop' ? '100%' : (previewViewport === 'tablet' ? '920px' : '440px');

  return (
    <div style={{ padding: '2rem', maxWidth: '1700px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
            }}>
              <LayoutGrid size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>
                Modular Homepage Slot Builder
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Move sections, assign any category to any position, pin custom stories, and preview full broadsheet layout.
              </p>
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '3px'
          }}>
            <button
              onClick={() => setActiveTab('editor')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'editor' ? 'var(--accent-blue, #3b82f6)' : 'transparent',
                color: activeTab === 'editor' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Sliders size={15} />
              <span>Section Builder</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'preview' ? 'var(--accent-blue, #3b82f6)' : 'transparent',
                color: activeTab === 'preview' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Eye size={15} />
              <span>Live Simulated Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'presets' ? 'var(--accent-blue, #3b82f6)' : 'transparent',
                color: activeTab === 'presets' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={15} />
              <span>Edition Presets</span>
            </button>
          </div>

          {/* Add Section Block Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#b90014',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(185, 0, 20, 0.3)'
            }}
          >
            <Plus size={16} />
            <span>Add Section Block</span>
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleResetToDefaults}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>

          {/* Save & Publish Live */}
          <button
            type="button"
            onClick={handleSaveAndPublish}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#10b981',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Save size={16} />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SECTION BUILDER EDITOR */}
      {activeTab === 'editor' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Filters */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            background: 'var(--bg-card)',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Filter size={16} color="var(--text-muted)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>Filter Slots:</span>
              <select
                value={selectedZoneFilter}
                onChange={(e) => setSelectedZoneFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <option value="all">All Configured Slots ({sections.length})</option>
                <option value="hero">Hero Stage & Top Leads</option>
                <option value="section_band">Section Bands</option>
                <option value="department_grid">Department Grids</option>
                <option value="pinned">Pinned Stories Only</option>
              </select>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total Active Slots: <strong>{sections.filter(s => s.enabled !== false).length}</strong> / {sections.length}
            </div>
          </div>

          {/* Slots List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {sections
              .filter(zone => {
                if (selectedZoneFilter === 'hero') return zone.zoneType.startsWith('hero') || zone.zoneType === 'opinion';
                if (selectedZoneFilter === 'section_band') return zone.zoneType === 'section_band';
                if (selectedZoneFilter === 'department_grid') return zone.zoneType === 'department_grid';
                if (selectedZoneFilter === 'pinned') return zone.selectionMode === 'manual' && zone.pinnedArticleId;
                return true;
              })
              .map((zone, zIdx) => {
                const isPinned = zone.selectionMode === 'manual' && zone.pinnedArticleId;
                const isEnabled = zone.enabled !== false;
                const realIndex = sections.findIndex(s => s.id === zone.id);

                return (
                  <div
                    key={zone.id}
                    id={`zone-editor-card-${zone.id}`}
                    style={{
                      background: 'var(--bg-surface)',
                      border: `1.5px solid ${isPinned ? 'rgba(59, 130, 246, 0.4)' : 'var(--border-color)'}`,
                      borderRadius: '12px',
                      padding: '1.25rem 1.5rem',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      opacity: isEnabled ? 1 : 0.6,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Zone Header Row with Move Up/Down Controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      marginBottom: '1rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid var(--border-color)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* Order Number Badge */}
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: 'var(--text-muted)',
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}>
                          #{realIndex + 1}
                        </span>

                        <span style={{
                          background: isPinned ? 'var(--accent-blue, #3b82f6)' : (zone.zoneBadge === 'HERO LEAD' ? '#b90014' : 'var(--accent-purple, #8b5cf6)'),
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          {zone.zoneBadge || `BLOCK`}
                        </span>

                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                          {zone.sectionTitle || zone.zoneName}
                        </h3>

                        {isPinned && (
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: '#3b82f6',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '6px'
                          }}>
                            <Pin size={12} /> Pinned Story
                          </span>
                        )}
                      </div>

                      {/* Right Header Actions: Up/Down Buttons, Enable Toggle, Delete */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => handleMoveZone(realIndex, 'up')}
                            disabled={realIndex === 0}
                            title="Move Block Up"
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-color)',
                              background: realIndex === 0 ? 'transparent' : 'var(--bg-card)',
                              color: realIndex === 0 ? 'var(--text-muted)' : 'var(--text-main)',
                              cursor: realIndex === 0 ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ArrowUp size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMoveZone(realIndex, 'down')}
                            disabled={realIndex === sections.length - 1}
                            title="Move Block Down"
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-color)',
                              background: realIndex === sections.length - 1 ? 'transparent' : 'var(--bg-card)',
                              color: realIndex === sections.length - 1 ? 'var(--text-muted)' : 'var(--text-main)',
                              cursor: realIndex === sections.length - 1 ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>

                        {/* Enable/Disable Toggle */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={(e) => handleUpdateZone(zone.id, { enabled: e.target.checked })}
                            style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
                          />
                          <span>Visible</span>
                        </label>

                        {/* Delete Block */}
                        <button
                          type="button"
                          onClick={() => handleDeleteZone(zone.id)}
                          title="Remove Section"
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Zone Configuration Controls (3-Column Grid) */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '1.25rem',
                      alignItems: 'start'
                    }}>
                      {/* Left: Section Title & Zone Badge */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Section Display Title
                          </label>
                          <input
                            type="text"
                            value={zone.sectionTitle || ''}
                            onChange={(e) => handleUpdateZone(zone.id, { sectionTitle: e.target.value })}
                            placeholder="e.g. Technology, AI & Space"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-card)',
                              color: 'var(--text-main)',
                              fontSize: '0.9rem',
                              fontWeight: 700
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Zone Badge Label
                          </label>
                          <input
                            type="text"
                            value={zone.zoneBadge || ''}
                            onChange={(e) => handleUpdateZone(zone.id, { zoneBadge: e.target.value })}
                            placeholder="e.g. TECH & AI"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-card)',
                              color: 'var(--text-main)',
                              fontSize: '0.9rem',
                              fontWeight: 700
                            }}
                          />
                        </div>
                      </div>

                      {/* Center: Category Assignment & Item Count */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Assigned Category
                          </label>
                          <select
                            value={zone.category || 'All'}
                            onChange={(e) => handleUpdateZone(zone.id, { category: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-card)',
                              color: 'var(--text-main)',
                              fontSize: '0.9rem',
                              fontWeight: 700
                            }}
                          >
                            {ALL_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Number of Articles to Show
                          </label>
                          <select
                            value={zone.itemCount || 4}
                            onChange={(e) => handleUpdateZone(zone.id, { itemCount: parseInt(e.target.value) || 4 })}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-card)',
                              color: 'var(--text-main)',
                              fontSize: '0.9rem',
                              fontWeight: 700
                            }}
                          >
                            <option value="1">1 Story (Lead / Highlight)</option>
                            <option value="2">2 Stories</option>
                            <option value="3">3 Stories</option>
                            <option value="4">4 Stories (Standard Grid)</option>
                            <option value="5">5 Stories</option>
                            <option value="6">6 Stories</option>
                            <option value="8">8 Stories</option>
                          </select>
                        </div>
                      </div>

                      {/* Right: Selection Mode (Auto vs Manual Pinned Story) */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Story Selection & Pinning
                        </label>

                        {isPinned ? (
                          <div style={{
                            padding: '10px 12px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '8px'
                          }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Pin size={14} color="#3b82f6" />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {zone.pinnedArticleTitle || "Pinned Article"}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                              {zone.pinnedArticleAuthor ? `By ${zone.pinnedArticleAuthor}` : ''} {zone.pinnedArticleCategory ? `• ${zone.pinnedArticleCategory}` : ''}
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => setPinningZoneId(zone.id)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '0.75rem',
                                  borderRadius: '4px',
                                  border: '1px solid var(--border-color)',
                                  background: 'var(--bg-card)',
                                  color: 'var(--text-main)',
                                  cursor: 'pointer'
                                }}
                              >
                                Change Story
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUnpinArticle(zone.id)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '0.75rem',
                                  borderRadius: '4px',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  color: '#ef4444',
                                  cursor: 'pointer'
                                }}
                              >
                                Unpin (Revert to Auto)
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{
                            padding: '10px 12px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                Auto Category Feed
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Auto-populates latest {zone.category || 'All'} articles
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPinningZoneId(zone.id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: 'none',
                                background: 'var(--accent-blue, #3b82f6)',
                                color: '#ffffff',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Pin size={13} />
                              <span>Pin Custom Story</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 2: COMPLETE AUTHENTIC LIVE BROADSHEET EDITORIAL PREVIEW */}
      {activeTab === 'preview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Control Bar of Live Preview */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} color="#3b82f6" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Full Daily Brief Broadsheet Simulation
                </h2>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                  Live Slot Binding
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Full homepage view showing where all articles, categories, and custom dynamic blocks are placed.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Overlay Blueprint Toggle */}
              <button
                type="button"
                onClick={() => setShowEditorOverlay(!showEditorOverlay)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: showEditorOverlay ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-surface)',
                  color: showEditorOverlay ? '#3b82f6' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Zap size={14} />
                <span>{showEditorOverlay ? 'Editor Blueprint Badges: ON' : 'Blueprint Badges: OFF'}</span>
              </button>

              {/* Viewport Width Buttons */}
              <div style={{
                display: 'flex',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '2px'
              }}>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('desktop')}
                  title="Desktop Full-Width"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: previewViewport === 'desktop' ? 'var(--accent-blue, #3b82f6)' : 'transparent',
                    color: previewViewport === 'desktop' ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Monitor size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('tablet')}
                  title="Tablet (920px)"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: previewViewport === 'tablet' ? 'var(--accent-blue, #3b82f6)' : 'transparent',
                    color: previewViewport === 'tablet' ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Tablet size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('mobile')}
                  title="Mobile (440px)"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: previewViewport === 'mobile' ? 'var(--accent-blue, #3b82f6)' : 'transparent',
                    color: previewViewport === 'mobile' ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Smartphone size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Real Full Simulated Broadsheet Container */}
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            overflowX: 'auto',
            padding: '1rem 0'
          }}>
            <div style={{
              width: viewportWidth,
              maxWidth: '100%',
              background: '#0b0f19',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
              color: '#f8fafc',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}>
              {/* 1. Masthead & Top Bar Simulation */}
              <div style={{ background: '#0f172a', borderBottom: '1px solid #24324a', padding: '8px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>Tuesday, August 25, 2026</span>
                  <span>•</span>
                  <span style={{ color: '#b90014', fontWeight: 800 }}>e-Paper 📰</span>
                  <span>•</span>
                  <span>New Delhi 28°C ☀️</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>SENSEX: <strong>84,812.50 (+0.42%)</strong></span>
                  <span>•</span>
                  <span>USD/INR: <strong>83.90</strong></span>
                </div>
              </div>

              {/* Main Masthead Banner */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #24324a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#b90014', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    JOURNAL OF GLOBAL RECORD & INSTITUTIONAL INTELLIGENCE
                  </div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px' }}>
                    CIVIBRIEF / THE DAILY BRIEF
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ padding: '6px 12px', background: '#1e293b', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>Search</span>
                  <span style={{ padding: '6px 14px', background: '#b90014', color: '#fff', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>Subscribe</span>
                </div>
              </div>

              {/* Navigation Desks */}
              <div style={{ background: '#131c2e', borderBottom: '2px solid #b90014', padding: '8px 20px', display: 'flex', gap: '16px', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: '#cbd5e1', overflowX: 'auto' }}>
                <span style={{ color: '#b90014' }}>Top Stories</span>
                <span>India & Policy</span>
                <span>Global Affairs</span>
                <span>Markets & Economy</span>
                <span>Credit News</span>
                <span>Tech & AI</span>
                <span>Editorial & Opinion</span>
                <span style={{ color: '#34d399' }}>Deep Dives 💎</span>
                <span>Sports</span>
              </div>

              {/* Promo Strip */}
              <div style={{ background: 'linear-gradient(90deg, #9a3412 0%, #c2410c 100%)', color: '#fff', padding: '6px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700 }}>
                <span>⚡ PRO EDITION: Unlimited Institutional Intelligence — Free Trial Active</span>
                <span style={{ background: '#fff', color: '#9a3412', padding: '2px 8px', borderRadius: '3px', fontWeight: 900 }}>Start @ ₹0</span>
              </div>

              {/* Breaking Wire Alert */}
              <div style={{ background: '#131c2e', borderBottom: '1px solid #24324a', padding: '6px 18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px' }}>
                <span style={{ color: '#b90014', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b90014', display: 'inline-block' }} />
                  BREAKING WIRE:
                </span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                  Cabinet approves ₹76,000 Cr incentive outlay for advanced semiconductor packaging cluster.
                </span>
              </div>

              {/* Broadsheet Content Body */}
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* 2. ZONE: ABOVE-THE-FOLD HERO MULTI-COLUMN NEWSPAPER CLUSTER (42% | 31% | 27%) */}
                <section style={{
                  display: 'grid',
                  gridTemplateColumns: previewViewport === 'mobile' ? '1fr' : (previewViewport === 'tablet' ? '55% 45%' : '42% 31% 27%'),
                  gap: '18px',
                  alignItems: 'start',
                  borderBottom: '1px solid #24324a',
                  paddingBottom: '20px'
                }}>
                  {/* Column 1 (42%): Hero Lead Story + 2-Column Sub Leads */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderRight: previewViewport === 'desktop' ? '1px solid #24324a' : 'none', paddingRight: previewViewport === 'desktop' ? '16px' : '0' }}>
                    {/* Hero Lead Story */}
                    <div style={{ position: 'relative', background: '#131c2e', borderRadius: '6px', padding: '10px', border: '1px solid #24324a' }}>
                      {showEditorOverlay && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ background: '#b90014', color: '#fff', fontSize: '9px', fontWeight: 900, padding: '2px 6px', borderRadius: '3px' }}>
                            SLOT #1: HERO LEAD ({getZoneConfig('zone-hero-lead')?.category || 'All'})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleJumpToEditor('zone-hero-lead')}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '9px', fontWeight: 800, padding: '2px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <Edit3 size={10} /> Edit Slot
                          </button>
                        </div>
                      )}

                      <div style={{ width: '100%', height: '180px', borderRadius: '4px', overflow: 'hidden', background: '#000', marginBottom: '8px' }}>
                        <img
                          src={getSafeImage(leadStory, 0)}
                          alt={leadStory.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <span style={{ fontSize: '9.5px', color: '#b90014', fontWeight: 900, textTransform: 'uppercase' }}>
                        {leadStory.category || 'TOP STORY'}
                      </span>
                      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 900, color: '#f8fafc', margin: '3px 0 6px', lineHeight: 1.25 }}>
                        {leadStory.title}
                      </h2>
                      <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.4 }}>
                        {leadStory.summary}
                      </p>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
                        By {leadStory.author} • {leadStory.readTime || '4 min read'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '8px' }}>
                        <span style={{ width: '16px', height: '5px', borderRadius: '3px', background: '#b90014' }} />
                        <span style={{ width: '5px', height: '5px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.25)' }} />
                        <span style={{ width: '5px', height: '5px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.25)' }} />
                        <span style={{ width: '5px', height: '5px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.25)' }} />
                      </div>
                    </div>

                    {/* Sub Lead 1 & 2 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {/* Sub Lead 1 */}
                      <div style={{ background: '#131c2e', borderRadius: '6px', padding: '8px', border: '1px solid #24324a' }}>
                        {showEditorOverlay && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ background: '#6366f1', color: '#fff', fontSize: '8px', fontWeight: 900, padding: '1px 4px', borderRadius: '2px' }}>
                              HERO SUB 1
                            </span>
                            <button
                              type="button"
                              onClick={() => handleJumpToEditor('zone-hero-sub-1')}
                              style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '8px', fontWeight: 800, padding: '1px 4px', cursor: 'pointer' }}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                        <div style={{ width: '100%', height: '70px', borderRadius: '3px', overflow: 'hidden', background: '#000', marginBottom: '4px' }}>
                          <img src={getSafeImage(subLead1, 1)} alt={subLead1.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '11.5px', fontWeight: 800, color: '#f8fafc', margin: '2px 0', lineHeight: 1.3 }}>
                          {subLead1.title}
                        </h4>
                      </div>

                      {/* Sub Lead 2 */}
                      <div style={{ background: '#131c2e', borderRadius: '6px', padding: '8px', border: '1px solid #24324a' }}>
                        {showEditorOverlay && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ background: '#6366f1', color: '#fff', fontSize: '8px', fontWeight: 900, padding: '1px 4px', borderRadius: '2px' }}>
                              HERO SUB 2
                            </span>
                            <button
                              type="button"
                              onClick={() => handleJumpToEditor('zone-hero-sub-2')}
                              style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '8px', fontWeight: 800, padding: '1px 4px', cursor: 'pointer' }}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                        <div style={{ width: '100%', height: '70px', borderRadius: '3px', overflow: 'hidden', background: '#000', marginBottom: '4px' }}>
                          <img src={getSafeImage(subLead2, 2)} alt={subLead2.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '11.5px', fontWeight: 800, color: '#f8fafc', margin: '2px 0', lineHeight: 1.3 }}>
                          {subLead2.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Column 2 (31%): Second Major Lead & Stacked Rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderRight: previewViewport === 'desktop' ? '1px solid #24324a' : 'none', paddingRight: previewViewport === 'desktop' ? '16px' : '0' }}>
                    {/* Second Lead */}
                    <div style={{ background: '#131c2e', borderRadius: '6px', padding: '10px', border: '1px solid #24324a' }}>
                      {showEditorOverlay && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ background: '#ec4899', color: '#fff', fontSize: '9px', fontWeight: 900, padding: '2px 6px', borderRadius: '3px' }}>
                            SECOND LEAD ({getZoneConfig('zone-hero-second-lead')?.category || 'All'})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleJumpToEditor('zone-hero-second-lead')}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '9px', fontWeight: 800, padding: '2px 6px', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                      <div style={{ width: '100%', height: '110px', borderRadius: '4px', overflow: 'hidden', background: '#000', marginBottom: '6px' }}>
                        <img src={getSafeImage(secondLead, 3)} alt={secondLead.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ fontSize: '9px', color: '#b90014', fontWeight: 900 }}>{secondLead.category}</span>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 800, color: '#f8fafc', margin: '2px 0 4px', lineHeight: 1.3 }}>
                        {secondLead.title}
                      </h3>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: 1.35 }}>
                        {secondLead.summary}
                      </p>
                    </div>

                    {/* Stacked Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#131c2e', padding: '10px', borderRadius: '6px', border: '1px solid #24324a' }}>
                      {showEditorOverlay && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ background: '#8b5cf6', color: '#fff', fontSize: '8.5px', fontWeight: 900, padding: '1px 5px', borderRadius: '2px' }}>
                            STACKED ROWS (3 Stories)
                          </span>
                          <button
                            type="button"
                            onClick={() => handleJumpToEditor('zone-hero-stacked')}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '8px', fontWeight: 800, padding: '1px 4px', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                        </div>
                      )}

                      {heroStacked.map((story, sIdx) => (
                        <div key={`stack-${sIdx}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: sIdx > 0 ? '1px solid #24324a' : 'none', paddingTop: sIdx > 0 ? '6px' : '0' }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '8.5px', color: '#b90014', fontWeight: 800 }}>{story.category}</span>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc', lineHeight: 1.25 }}>{story.title}</div>
                          </div>
                          <div style={{ width: '48px', height: '36px', borderRadius: '3px', overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                            <img src={getSafeImage(story, sIdx + 4)} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3 (27%): Editorial Opinion & Fast News Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Editorial Opinion */}
                    <div style={{ background: '#131c2e', border: '1.5px solid #b90014', borderRadius: '6px', padding: '12px' }}>
                      {showEditorOverlay && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ background: '#b90014', color: '#fff', fontSize: '8.5px', fontWeight: 900, padding: '1px 5px', borderRadius: '2px' }}>
                            EDITORIAL OPINION
                          </span>
                          <button
                            type="button"
                            onClick={() => handleJumpToEditor('zone-editorial-opinion')}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '8px', fontWeight: 800, padding: '1px 4px', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                      <div style={{ fontSize: '9.5px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
                        👑 LEAD EDITORIAL ESSAY
                      </div>
                      <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px', lineHeight: 1.3 }}>
                        The Architecture of Sovereign Autonomy in an Era of Multipolar Fractures
                      </h4>
                      <p style={{ fontSize: '10.5px', color: '#94a3b8', margin: 0, lineHeight: 1.35 }}>
                        Why independent institutional capacity and domestic silicon manufacturing constitute genuine pillars of national security.
                      </p>
                    </div>

                    {/* Latest Intelligence */}
                    <div style={{ background: '#131c2e', border: '1px solid #24324a', borderRadius: '6px', padding: '10px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 900, color: '#b90014', textTransform: 'uppercase', marginBottom: '6px' }}>
                        LATEST INTELLIGENCE ⚡
                      </div>
                      {[
                        { time: "14m ago", text: "RBI maintains repo stance amid food inflation monitoring." },
                        { time: "28m ago", text: "Cabinet approves ₹76k Cr semiconductor incentive outlay." },
                        { time: "42m ago", text: "ISRO launches ocean surveillance payload on GSLV." }
                      ].map((w, wIdx) => (
                        <div key={`w-${wIdx}`} style={{ borderBottom: wIdx < 2 ? '1px solid #24324a' : 'none', paddingBottom: '4px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '8.5px', color: '#b90014', fontWeight: 800 }}>{w.time}</span>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1' }}>{w.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 3. ZONE: SECOND MAJOR EDITORIAL BAND (40% | 32% | 28%) */}
                <section style={{
                  display: 'grid',
                  gridTemplateColumns: previewViewport === 'mobile' ? '1fr' : (previewViewport === 'tablet' ? '55% 45%' : '40% 32% 28%'),
                  gap: '18px',
                  borderBottom: '1px solid #24324a',
                  paddingBottom: '20px'
                }}>
                  {/* Band Col 1: National / Band 1 */}
                  <div style={{ background: '#131c2e', padding: '12px', borderRadius: '6px', border: '1px solid #24324a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #24324a', paddingBottom: '6px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '3px', height: '12px', background: '#b90014', display: 'inline-block' }} />
                        {getZoneConfig('zone-band-1')?.sectionTitle || 'National Affairs'}
                      </span>
                      {showEditorOverlay && (
                        <button
                          type="button"
                          onClick={() => handleJumpToEditor('zone-band-1')}
                          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '8.5px', fontWeight: 800, padding: '2px 6px', cursor: 'pointer' }}
                        >
                          Edit Slot
                        </button>
                      )}
                    </div>
                    {band1Stories[0] && (
                      <div>
                        <div style={{ width: '100%', height: '110px', borderRadius: '4px', overflow: 'hidden', background: '#000', marginBottom: '6px' }}>
                          <img src={getSafeImage(band1Stories[0], 5)} alt={band1Stories[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 800, color: '#f8fafc', margin: '2px 0' }}>
                          {band1Stories[0].title}
                        </h4>
                        <p style={{ fontSize: '10.5px', color: '#94a3b8', margin: 0 }}>
                          {band1Stories[0].summary}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Band Col 2: World & Geopolitics / Band 2 */}
                  <div style={{ background: '#131c2e', padding: '12px', borderRadius: '6px', border: '1px solid #24324a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #24324a', paddingBottom: '6px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '3px', height: '12px', background: '#b90014', display: 'inline-block' }} />
                        {getZoneConfig('zone-band-2')?.sectionTitle || 'World & Geopolitics'}
                      </span>
                      {showEditorOverlay && (
                        <button
                          type="button"
                          onClick={() => handleJumpToEditor('zone-band-2')}
                          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '8.5px', fontWeight: 800, padding: '2px 6px', cursor: 'pointer' }}
                        >
                          Edit Slot
                        </button>
                      )}
                    </div>
                    {band2Stories.slice(0, 2).map((s, idx) => (
                      <div key={`b2-${idx}`} style={{ borderBottom: '1px solid #24324a', paddingBottom: '6px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '8.5px', color: '#b90014', fontWeight: 800 }}>{s.category}</span>
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#f8fafc', lineHeight: 1.25 }}>{s.title}</div>
                      </div>
                    ))}
                  </div>

                  {/* Band Col 3: Most Read Today Numbered Ranking */}
                  <div style={{ background: '#131c2e', padding: '12px', borderRadius: '6px', border: '1px solid #24324a' }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#b90014', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flame size={14} />
                      <span>MOST READ TODAY</span>
                    </div>
                    {allArticlesPool.slice(0, 4).map((m, idx) => (
                      <div key={`m-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: idx < 3 ? '1px solid #24324a' : 'none', paddingBottom: '4px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontFamily: 'Georgia, serif', fontWeight: 900, color: '#b90014' }}>0{idx + 1}</span>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1' }}>{m.title}</div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 4. ZONE: DEPARTMENT GRIDS (BUSINESS, TECH, + ALL CUSTOM DYNAMIC SLOTS) */}
                {/* 4.1 Department 1 */}
                {getZoneConfig('zone-dept-1')?.enabled !== false && (
                  <section style={{ borderBottom: '1px solid #24324a', paddingBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #24324a', paddingBottom: '6px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '4px', height: '14px', background: '#b90014', display: 'inline-block' }} />
                        {getZoneConfig('zone-dept-1')?.sectionTitle || 'Business, Markets & Economy'}
                      </span>
                      {showEditorOverlay && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '3px' }}>
                            Category: {getZoneConfig('zone-dept-1')?.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleJumpToEditor('zone-dept-1')}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '9px', fontWeight: 800, padding: '2px 6px', cursor: 'pointer' }}
                          >
                            Edit Slot
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'mobile' ? '1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
                      {dept1Stories.map((s, idx) => (
                        <div key={`d1-${idx}`} style={{ background: '#131c2e', padding: '10px', borderRadius: '6px', border: '1px solid #24324a' }}>
                          <div style={{ width: '100%', height: '90px', borderRadius: '4px', overflow: 'hidden', background: '#000', marginBottom: '6px' }}>
                            <img src={getSafeImage(s, idx + 2)} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <span style={{ fontSize: '8.5px', color: '#b90014', fontWeight: 800 }}>{s.category}</span>
                          <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', margin: '2px 0' }}>{s.title}</h4>
                          <div style={{ fontSize: '9.5px', color: '#64748b' }}>By {s.author}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 4.2 Department 2 */}
                {getZoneConfig('zone-dept-2')?.enabled !== false && (
                  <section style={{ borderBottom: '1px solid #24324a', paddingBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #24324a', paddingBottom: '6px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '4px', height: '14px', background: '#b90014', display: 'inline-block' }} />
                        {getZoneConfig('zone-dept-2')?.sectionTitle || 'Technology, AI & Space'}
                      </span>
                      {showEditorOverlay && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '3px' }}>
                            Category: {getZoneConfig('zone-dept-2')?.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleJumpToEditor('zone-dept-2')}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '9px', fontWeight: 800, padding: '2px 6px', cursor: 'pointer' }}
                          >
                            Edit Slot
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'mobile' ? '1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
                      {dept2Stories.map((s, idx) => (
                        <div key={`d2-${idx}`} style={{ background: '#131c2e', padding: '10px', borderRadius: '6px', border: '1px solid #24324a' }}>
                          <div style={{ width: '100%', height: '90px', borderRadius: '4px', overflow: 'hidden', background: '#000', marginBottom: '6px' }}>
                            <img src={getSafeImage(s, idx + 4)} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <span style={{ fontSize: '8.5px', color: '#b90014', fontWeight: 800 }}>{s.category}</span>
                          <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', margin: '2px 0' }}>{s.title}</h4>
                          <div style={{ fontSize: '9.5px', color: '#64748b' }}>By {s.author}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 4.3 Custom Dynamic Blocks Added by Admin */}
                {customDynamicSections.map((customSec) => {
                  const customStories = resolveZoneArticles(customSec, customSec.category, customSec.itemCount || 4);
                  return (
                    <section key={customSec.id} style={{ borderBottom: '1px solid #24324a', paddingBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #24324a', paddingBottom: '6px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '4px', height: '14px', background: '#b90014', display: 'inline-block' }} />
                          {customSec.sectionTitle || customSec.zoneName}
                          <span style={{ fontSize: '10px', background: '#b90014', color: '#fff', padding: '1px 6px', borderRadius: '3px', marginLeft: '6px' }}>
                            {customSec.zoneBadge || customSec.category}
                          </span>
                        </span>
                        {showEditorOverlay && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '3px' }}>
                              Category: {customSec.category}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleJumpToEditor(customSec.id)}
                              style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '9px', fontWeight: 800, padding: '2px 6px', cursor: 'pointer' }}
                            >
                              Edit Slot
                            </button>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'mobile' ? '1fr' : 'repeat(4, 1fr)', gap: '12px' }}>
                        {customStories.map((s, idx) => (
                          <div key={`dyn-prev-${customSec.id}-${idx}`} style={{ background: '#131c2e', padding: '10px', borderRadius: '6px', border: '1px solid #24324a' }}>
                            <div style={{ width: '100%', height: '90px', borderRadius: '4px', overflow: 'hidden', background: '#000', marginBottom: '6px' }}>
                              <img src={getSafeImage(s, idx + 1)} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <span style={{ fontSize: '8.5px', color: '#b90014', fontWeight: 800 }}>{s.category || customSec.category}</span>
                            <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', margin: '2px 0' }}>{s.title}</h4>
                            <div style={{ fontSize: '9.5px', color: '#64748b' }}>By {s.author}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}

                {/* 5. ZONE: DEEP DIVES 💎 SPECIAL INVESTIGATIONS BANNER */}
                <section style={{ background: '#064e3b', border: '1px solid #059669', borderRadius: '8px', padding: '16px 20px', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 900, textTransform: 'uppercase' }}>
                        SPECIAL INVESTIGATIONS
                      </div>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 900, margin: '2px 0' }}>
                        Deep Dives 💎
                      </h3>
                    </div>
                    <span style={{ fontSize: '10px', background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: '20px', color: '#34d399', fontWeight: 800 }}>
                      MEMBER EXCLUSIVE 🔒
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: previewViewport === 'mobile' ? '1fr' : 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                      { title: "The Shadow Nodes of Global High-Yield Microfinance", cat: "FINANCIAL FORENSICS", author: "Deep Dive Bureau" },
                      { title: "Rare Earth Refinery Bottlenecks & Critical Minerals Sovereignty", cat: "RESOURCE GEOPOLITICS", author: "Dr. Arvind Menon" },
                      { title: "Algorithmic Market Making & Flash Liquidity Voids", cat: "QUANTITATIVE DESK", author: "Elena Rostova" }
                    ].map((d, dIdx) => (
                      <div key={`dd-${dIdx}`} style={{ background: 'rgba(0,0,0,0.35)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                        <span style={{ fontSize: '8.5px', color: '#34d399', fontWeight: 800 }}>{d.cat}</span>
                        <h4 style={{ fontSize: '12px', fontWeight: 800, margin: '3px 0' }}>{d.title}</h4>
                        <div style={{ fontSize: '9.5px', color: '#93c5fd' }}>By {d.author}</div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 6. ZONE: FINANCIAL ENGAGEMENT MODULES (CURRENCY CONVERTER & MUTUAL FUNDS) */}
                <section style={{ display: 'grid', gridTemplateColumns: previewViewport === 'mobile' ? '1fr' : '1fr 1fr', gap: '14px' }}>
                  {/* Currency Converter */}
                  <div style={{ background: '#131c2e', border: '1px solid #24324a', borderRadius: '6px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <DollarSign size={14} color="#b90014" />
                      <span>CURRENCY CONVERTER</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
                      <span style={{ padding: '6px 10px', background: '#1e293b', borderRadius: '4px', color: '#fff', fontWeight: 800 }}>1,000 USD</span>
                      <span style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>=</span>
                      <span style={{ padding: '6px 10px', background: '#064e3b', borderRadius: '4px', color: '#34d399', fontWeight: 900 }}>83,900.00 INR</span>
                    </div>
                  </div>

                  {/* Top Mutual Funds */}
                  <div style={{ background: '#131c2e', border: '1px solid #24324a', borderRadius: '6px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#f8fafc', marginBottom: '8px' }}>
                      TOP MUTUAL FUNDS (3Y RETURN)
                    </div>
                    <div style={{ fontSize: '10.5px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                        <span>Invesco India Largecap</span>
                        <strong style={{ color: '#10b981' }}>+15.92%</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                        <span>WhiteOak Capital Large Cap</span>
                        <strong style={{ color: '#10b981' }}>+15.43%</strong>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Trending Topics Cloud */}
                <div style={{ background: '#131c2e', padding: '10px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '10.5px' }}>
                  <strong style={{ color: '#b90014' }}>TRENDING:</strong>
                  {["#Union Budget 2026", "#Semiconductor Fab", "#RBI Policy", "#ISRO Gaganyaan", "#Sensex 85k"].map((t, idx) => (
                    <span key={`tr-${idx}`} style={{ background: '#1e293b', padding: '2px 8px', borderRadius: '4px', color: '#cbd5e1' }}>
                      {t}
                    </span>
                  ))}
                </div>

              </div>

              {/* Simulated Footer */}
              <div style={{ background: '#0a0e17', borderTop: '1px solid #24324a', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b' }}>
                <span>© 2026 Daily Brief News Network. All Rights Reserved.</span>
                <span>ISO Certified • Fast 0-1ms Cache</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EDITION PRESETS */}
      {activeTab === 'presets' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {HOMEPAGE_ARTICLE_PRESETS.map((preset) => (
            <div
              key={preset.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
                  {preset.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {preset.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleApplyPreset(preset)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--accent-blue, #3b82f6)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={15} />
                <span>Apply This Preset</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD MODULAR SECTION BLOCK */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="#b90014" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  Add Modular Section Block
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Block Layout Type
                </label>
                <select
                  value={newBlockType}
                  onChange={(e) => {
                    setNewBlockType(e.target.value);
                    const sel = AVAILABLE_BLOCK_TYPES.find(b => b.type === e.target.value);
                    if (sel) {
                      setNewBlockBadge(sel.badge);
                      setNewBlockCount(sel.defaultCount);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    fontWeight: 700
                  }}
                >
                  {AVAILABLE_BLOCK_TYPES.map(b => (
                    <option key={b.type} value={b.type}>{b.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Section Title
                </label>
                <input
                  type="text"
                  value={newBlockTitle}
                  onChange={(e) => setNewBlockTitle(e.target.value)}
                  placeholder="e.g. Markets & Credit News"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    fontWeight: 700
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={newBlockCategory}
                    onChange={(e) => setNewBlockCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      fontWeight: 700
                    }}
                  >
                    {ALL_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Article Count
                  </label>
                  <select
                    value={newBlockCount}
                    onChange={(e) => setNewBlockCount(parseInt(e.target.value) || 4)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      fontWeight: 700
                    }}
                  >
                    <option value="1">1 Story</option>
                    <option value="2">2 Stories</option>
                    <option value="3">3 Stories</option>
                    <option value="4">4 Stories</option>
                    <option value="5">5 Stories</option>
                    <option value="6">6 Stories</option>
                    <option value="8">8 Stories</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateBlock}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#b90014',
                  color: '#ffffff',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(185, 0, 20, 0.3)'
                }}
              >
                Add Block to Homepage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PIN ARTICLE SELECTOR */}
      {pinningZoneId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '750px',
            maxHeight: '85vh',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  Pin Story to {sections.find(s => s.id === pinningZoneId)?.zoneBadge || 'Zone'}
                </h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Select any published article to pin as the featured story in this homepage block.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPinningZoneId(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Search & Filter Bar */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              gap: '10px'
            }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                <input
                  type="text"
                  placeholder="Search articles by headline or author..."
                  value={articleSearchQuery}
                  onChange={(e) => setArticleSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <select
                value={articleCategoryFilter}
                onChange={(e) => setArticleCategoryFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="all">All Categories</option>
                {ALL_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Modal Articles List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredArticlesForPinning.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <FileText size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <p>No published articles match your search filter.</p>
                </div>
              ) : (
                filteredArticlesForPinning.map(art => (
                  <div
                    key={art.id}
                    onClick={() => handlePinArticleToZone(pinningZoneId, art)}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#000' }}>
                        <img
                          src={getSafeImage(art)}
                          alt={art.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontSize: '0.7rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px' }}>
                            {art.category || 'General'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            By {art.author || 'Editorial'}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {art.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'var(--accent-blue, #3b82f6)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      Pin Story
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={() => setPinningZoneId(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
