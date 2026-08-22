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
  Compass,
  FileText,
  Clock,
  User,
  Hash
} from 'lucide-react';

const ALL_CATEGORIES = [
  "All",
  "Top Stories",
  "Tech & AI",
  "Global Affairs",
  "Markets & Economy",
  "Science & Climate",
  "Movies",
  "Lifestyle",
  "Sports",
  "Opinion & Essays",
  "Culture & Design",
  "Deep Dives 💎",
  "India"
];

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
  const [searchTerm, setSearchTerm] = useState('');
  const [pinningZoneId, setPinningZoneId] = useState(null); // Zone ID currently selecting an article for
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [articleCategoryFilter, setArticleCategoryFilter] = useState('all');

  // Filter published articles for pinning
  const publishedArticles = useMemo(() => {
    return (articles || []).filter(a => a.status === 'Published');
  }, [articles]);

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

  // Helper to get matching live articles for a zone in preview
  const getZonePreviewArticles = (zone) => {
    if (zone.selectionMode === 'manual' && zone.pinnedArticleId) {
      const pinned = publishedArticles.find(a => a.id === zone.pinnedArticleId);
      if (pinned) return [pinned];
    }

    const cat = (zone.category || 'all').toLowerCase();
    if (cat === 'all' || cat === 'top stories') {
      return publishedArticles.slice(0, zone.itemCount || 4);
    }

    const filtered = publishedArticles.filter(a => (a.category || '').toLowerCase().includes(cat) || cat.includes((a.category || '').toLowerCase()));
    if (filtered.length > 0) {
      return filtered.slice(0, zone.itemCount || 4);
    }
    return publishedArticles.slice(0, zone.itemCount || 4);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
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
                Homepage Article Placement
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Assign news categories to homepage editorial zones, rename section titles, and pin featured stories.
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
              <span>Zone Editor</span>
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

          <button
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

          <button
            onClick={handleSaveAndPublish}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Save size={16} />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ZONE EDITOR */}
      {activeTab === 'editor' && (
        <div>
          {/* Quick Filter & Summary Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Compass size={18} color="var(--accent-blue, #3b82f6)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {sections.length} Homepage Editorial Zones Configured
              </span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                {sections.filter(s => s.selectionMode === 'manual').length} Pinned Custom Stories
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Filter Zone Type:</span>
              <select
                value={selectedZoneFilter}
                onChange={(e) => setSelectedZoneFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                <option value="all">All Zones</option>
                <option value="hero">Hero Stage (Zones 1-5)</option>
                <option value="opinion">Editorial Opinion (Zone 6)</option>
                <option value="band">Section Bands (Zones 7-8)</option>
                <option value="dept">Department Grids (Zones 9-10)</option>
                <option value="deep_dives">Deep Dives 💎 (Zone 11)</option>
              </select>
            </div>
          </div>

          {/* Zones Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {sections
              .filter(sec => {
                if (selectedZoneFilter === 'all') return true;
                if (selectedZoneFilter === 'hero') return sec.id.startsWith('zone-hero');
                if (selectedZoneFilter === 'opinion') return sec.id === 'zone-editorial-opinion';
                if (selectedZoneFilter === 'band') return sec.id.startsWith('zone-band');
                if (selectedZoneFilter === 'dept') return sec.id.startsWith('zone-dept');
                if (selectedZoneFilter === 'deep_dives') return sec.id === 'zone-deep-dives';
                return true;
              })
              .map((zone, zIdx) => {
                const isPinned = zone.selectionMode === 'manual' && zone.pinnedArticleId;
                const isEnabled = zone.enabled !== false;

                return (
                  <div
                    key={zone.id}
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
                    {/* Zone Header Row */}
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
                        <span style={{
                          background: isPinned ? 'var(--accent-blue, #3b82f6)' : 'var(--accent-purple, #8b5cf6)',
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          {zone.zoneBadge || `ZONE ${zIdx + 1}`}
                        </span>

                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                          {zone.zoneName}
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

                      {/* Enable/Disable Toggle */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => handleUpdateZone(zone.id, { enabled: e.target.checked })}
                          style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
                        />
                        <span>Visible on Homepage</span>
                      </label>
                    </div>

                    {/* Zone Configuration Controls (2-Column Grid) */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1.25rem',
                      alignItems: 'start'
                    }}>
                      {/* Left: Category Selector & Section Title */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {/* Section Title Input */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Section Display Title
                          </label>
                          <input
                            type="text"
                            value={zone.sectionTitle || ''}
                            onChange={(e) => handleUpdateZone(zone.id, { sectionTitle: e.target.value })}
                            placeholder="e.g. National Affairs, Top Story"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-card)',
                              color: 'var(--text-main)',
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        {/* Category Dropdown */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Assigned Article Category
                          </label>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <select
                              value={zone.category || 'All'}
                              onChange={(e) => handleUpdateZone(zone.id, { category: e.target.value })}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-main)',
                                fontSize: '0.9rem',
                                fontWeight: 800
                              }}
                            >
                              {ALL_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>
                                  📂 {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Story Count / Sort Order */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                              Article Count
                            </label>
                            <select
                              value={zone.itemCount || 4}
                              onChange={(e) => handleUpdateZone(zone.id, { itemCount: parseInt(e.target.value) || 4 })}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-main)',
                                fontSize: '0.85rem',
                                fontWeight: 700
                              }}
                            >
                              <option value="1">1 Story (Lead Only)</option>
                              <option value="2">2 Stories</option>
                              <option value="3">3 Stories</option>
                              <option value="4">4 Stories (Standard Grid)</option>
                              <option value="6">6 Stories</option>
                              <option value="8">8 Stories</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                              Sort Priority
                            </label>
                            <select
                              value={zone.sortOrder || 'latest'}
                              onChange={(e) => handleUpdateZone(zone.id, { sortOrder: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-main)',
                                fontSize: '0.85rem',
                                fontWeight: 700
                              }}
                            >
                              <option value="latest">Latest Published</option>
                              <option value="trending">Highest Views / Trending</option>
                              <option value="editors_pick">Editor's Pick Priority</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Right: Article Selection Mode (Auto vs Pinned) */}
                      <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '130px'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                              Article Placement Mode
                            </span>

                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                onClick={() => handleUnpinArticle(zone.id)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  border: 'none',
                                  background: zone.selectionMode === 'auto' ? 'var(--accent-blue, #3b82f6)' : 'var(--bg-surface)',
                                  color: zone.selectionMode === 'auto' ? '#fff' : 'var(--text-secondary)',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                ⚡ Automatic
                              </button>

                              <button
                                onClick={() => setPinningZoneId(zone.id)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  border: 'none',
                                  background: zone.selectionMode === 'manual' ? '#8b5cf6' : 'var(--bg-surface)',
                                  color: zone.selectionMode === 'manual' ? '#fff' : 'var(--text-secondary)',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                              >
                                <Pin size={11} /> Pin Article
                              </button>
                            </div>
                          </div>

                          {/* Mode Status Content */}
                          {zone.selectionMode === 'manual' && zone.pinnedArticleId ? (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '6px',
                              padding: '8px 10px',
                              marginTop: '6px'
                            }}>
                              {zone.pinnedArticleImage && (
                                <img
                                  src={zone.pinnedArticleImage}
                                  alt="Pinned thumbnail"
                                  style={{ width: '45px', height: '45px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
                                />
                              )}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {zone.pinnedArticleTitle || 'Pinned Article'}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  By {zone.pinnedArticleAuthor || 'Author'} • {zone.pinnedArticleCategory || zone.category}
                                </div>
                              </div>

                              <button
                                onClick={() => handleUnpinArticle(zone.id)}
                                title="Remove pinned article"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  padding: '4px'
                                }}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                              Articles will automatically be drawn from the <strong>"{zone.category || 'All'}"</strong> category in real-time as authors publish new stories.
                            </div>
                          )}
                        </div>

                        {/* Zone Description */}
                        {zone.description && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                            ℹ️ {zone.description}
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

      {/* TAB 2: LIVE SIMULATED PREVIEW */}
      {activeTab === 'preview' && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                Live Broadsheet Placement Simulation
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                Shows how articles will be displayed to readers on the homepage according to your current category assignments and pinned stories.
              </p>
            </div>

            <button
              onClick={handleSaveAndPublish}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Save size={15} />
              <span>Publish Placements</span>
            </button>
          </div>

          {/* Simulated Newspaper Broadheet */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            {/* Zone 1-5: Hero Section Cluster */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                ▲ HERO CLUSTER STAGE (ZONES 1 TO 5)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {/* Hero Lead */}
                {(() => {
                  const leadZone = sections.find(s => s.id === 'zone-hero-lead') || sections[0];
                  const previewArts = getZonePreviewArticles(leadZone);
                  const art = previewArts[0] || publishedArticles[0];

                  return (
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ padding: '6px 10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 900, display: 'flex', justifyContent: 'space-between' }}>
                        <span>ZONE 1: {leadZone.sectionTitle || 'MAIN LEAD'}</span>
                        <span>📂 {leadZone.category || 'All'}</span>
                      </div>
                      {art && (
                        <div style={{ padding: '12px' }}>
                          <img src={art.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"} alt={art.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#b90014', textTransform: 'uppercase' }}>{art.category}</div>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>{art.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{art.summary?.slice(0, 80)}...</div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Second Lead */}
                {(() => {
                  const secZone = sections.find(s => s.id === 'zone-hero-second-lead') || sections[3];
                  const previewArts = getZonePreviewArticles(secZone);
                  const art = previewArts[0] || publishedArticles[1];

                  return (
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ padding: '6px 10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 900, display: 'flex', justifyContent: 'space-between' }}>
                        <span>ZONE 4: {secZone.sectionTitle || 'SECOND LEAD'}</span>
                        <span>📂 {secZone.category || 'All'}</span>
                      </div>
                      {art && (
                        <div style={{ padding: '12px' }}>
                          <img src={art.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"} alt={art.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#b90014', textTransform: 'uppercase' }}>{art.category}</div>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>{art.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{art.summary?.slice(0, 80)}...</div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Sub Leads */}
                {(() => {
                  const sub1Zone = sections.find(s => s.id === 'zone-hero-sub-1') || sections[1];
                  const sub2Zone = sections.find(s => s.id === 'zone-hero-sub-2') || sections[2];
                  const art1 = getZonePreviewArticles(sub1Zone)[0] || publishedArticles[2];
                  const art2 = getZonePreviewArticles(sub2Zone)[0] || publishedArticles[3];

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3b82f6', marginBottom: '4px' }}>ZONE 2: {sub1Zone.sectionTitle} (📂 {sub1Zone.category})</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{art1?.title || 'Sub Story 1'}</div>
                      </div>

                      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3b82f6', marginBottom: '4px' }}>ZONE 3: {sub2Zone.sectionTitle} (📂 {sub2Zone.category})</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{art2?.title || 'Sub Story 2'}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Zone 7 & 8: Section Bands */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                ▲ SECTION BANDS (ZONES 7 & 8)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {sections.filter(s => s.id.startsWith('zone-band')).map(band => {
                  const arts = getZonePreviewArticles(band);

                  return (
                    <div key={band.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #b90014', paddingBottom: '6px', marginBottom: '10px' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                          {band.sectionTitle}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>
                          Category: {band.category}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {arts.slice(0, 3).map((art, aIdx) => (
                          <div key={`band-art-${aIdx}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: aIdx < 2 ? '1px solid var(--border-color)' : 'none' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)' }}>0{aIdx + 1}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{art.title}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{art.author || 'Desk'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Zone 9 & 10: Department Grids */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                ▲ DEPARTMENT 4-COLUMN GRIDS (ZONES 9 & 10)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {sections.filter(s => s.id.startsWith('zone-dept')).map(dept => {
                  const arts = getZonePreviewArticles(dept);

                  return (
                    <div key={dept.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #b90014', paddingBottom: '6px', marginBottom: '12px' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                          {dept.sectionTitle}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 800 }}>
                          Category: {dept.category} ({arts.length} stories)
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        {arts.slice(0, 4).map((art, aIdx) => (
                          <div key={`dept-art-${aIdx}`} style={{ background: 'var(--bg-card)', borderRadius: '6px', padding: '8px', border: '1px solid var(--border-color)' }}>
                            <img src={art.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80"} alt={art.title} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px' }} />
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>{art.title?.slice(0, 45)}...</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EDITION PRESETS */}
      {activeTab === 'presets' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {HOMEPAGE_ARTICLE_PRESETS.map((preset) => (
            <div
              key={preset.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
                  {preset.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 1rem 0' }}>
                  {preset.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--bg-card)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Configured Mappings:</div>
                  {preset.sections.slice(0, 5).map(ps => (
                    <div key={ps.id} style={{ fontSize: '0.75rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700 }}>{ps.sectionTitle}:</span>
                      <span style={{ color: '#3b82f6', fontWeight: 800 }}>📂 {ps.category}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleApplyPreset(preset)}
                style={{
                  marginTop: '1.25rem',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                <Sparkles size={15} />
                <span>Apply This Preset Edition</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ARTICLE PINNING MODAL / DRAWER */}
      {pinningZoneId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-color)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '850px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-card)'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase' }}>
                  Select Published Article To Pin
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: '2px 0 0 0' }}>
                  Pin Story to {sections.find(s => s.id === pinningZoneId)?.zoneName || 'Zone'}
                </h3>
              </div>

              <button
                onClick={() => setPinningZoneId(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                flex: 1,
                minWidth: '240px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 12px'
              }}>
                <Search size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search articles by title, summary, or author..."
                  value={articleSearchQuery}
                  onChange={(e) => setArticleSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    width: '100%',
                    outline: 'none'
                  }}
                />
              </div>

              <select
                value={articleCategoryFilter}
                onChange={(e) => setArticleCategoryFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                <option value="all">All Categories</option>
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Article List Body */}
            <div style={{
              padding: '1.25rem 1.5rem',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {filteredArticlesForPinning.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <AlertCircle size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>No published articles found matching your filter.</div>
                </div>
              ) : (
                filteredArticlesForPinning.map(art => (
                  <div
                    key={art.id}
                    onClick={() => handlePinArticleToZone(pinningZoneId, art)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '10px 14px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <img
                      src={art.imageUrl || art.coverImageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80"}
                      alt={art.title}
                      style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontSize: '0.7rem', fontWeight: 900, padding: '1px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>
                          {art.category || 'NEWS'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {art.author || 'Desk'}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {art.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {art.summary || art.excerpt}
                      </div>
                    </div>

                    <button
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'var(--accent-blue, #3b82f6)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        flexShrink: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Pin size={12} /> Pin
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
