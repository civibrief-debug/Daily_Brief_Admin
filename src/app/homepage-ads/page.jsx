"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import RoleBadge from '../../components/RoleBadge';
import {
  Megaphone,
  Save,
  Eye,
  EyeOff,
  Edit3,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Layout,
  Sliders,
  RefreshCw,
  Maximize2,
  Move,
  GripVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smartphone,
  Monitor,
  Zap,
  ChevronDown,
  Video,
  Play,
  LayoutGrid,
  Columns,
  FileText
} from 'lucide-react';
import ContinuousCoverVideo from '../../components/ContinuousCoverVideo';

export const HOMEPAGE_DROP_ZONES = [
  { id: 'dropzone-masthead-top', name: 'Zone 1: Top Banner / Leaderboard (Natural Scroll)', label: 'Top Banner', defaultFormat: 'leaderboard' },
  { id: 'dropzone-hero-above', name: 'Zone 2: Above Hero Spotlight (Top Stories)', label: 'Above Hero', defaultFormat: 'leaderboard' },
  { id: 'dropzone-hero-bottom', name: 'Zone 3: Below Hero Section (Mid-Page Billboard)', label: 'Mid-Page Billboard', defaultFormat: 'billboard' },
  { id: 'dropzone-feed-row-1', name: 'Zone 4: News Feed Stream (In-Feed Native)', label: 'In-Feed Native', defaultFormat: 'in_feed' },
  { id: 'dropzone-feed-row-2', name: 'Zone 5: News Feed Stream (After Article 4)', label: 'Feed Position 2', defaultFormat: 'in_feed' },
  { id: 'dropzone-sidebar-top', name: 'Zone 6: Right Sidebar (Above Most Read)', label: 'Sidebar Top', defaultFormat: 'rectangle' },
  { id: 'dropzone-sidebar-bottom', name: 'Zone 7: Right Sidebar (Below Most Read)', label: 'Sidebar Sticky', defaultFormat: 'rectangle' },
  { id: 'dropzone-deep-dives-top', name: 'Zone 8: Deep Dives 💎 Investigations Header', label: 'Deep Dives Header', defaultFormat: 'deep_dives' },
  { id: 'dropzone-footer-floating', name: 'Zone 9: Bottom Floating Anchor Bar', label: 'Footer Floating Bar', defaultFormat: 'leaderboard' }
];

export const HOMEPAGE_AD_PRESETS = [
  {
    id: 'preset-binance-crypto',
    name: '⚡ 💰 Binance VIP Crypto Trading (Top Leaderboard Banner)',
    sponsorName: 'Binance VIP Institutional',
    badgeText: 'SPONSORED',
    contentType: 'image',
    headline: 'Institutional Crypto Liquidity & 0% Trading Fees',
    subtitle: 'Enterprise-grade custody, low-latency API execution and global OTC desks.',
    ctaText: 'Explore Platform ↗',
    targetUrl: 'https://binance.com',
    mediaUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
    mediaLayout: 'side_media',
    mediaFit: 'contain',
    mediaHeight: '130px',
    mediaWidth: '220px',
    mediaBg: 'rgba(0, 0, 0, 0.95)',
    alignment: 'center',
    dropZoneId: 'dropzone-masthead-top',
    widthMode: '100%',
    customWidth: '100%',
    customHeight: '90px',
    isSticky: false,
    showOnDesktop: true,
    showOnTablet: true,
    showOnMobile: true
  },
  {
    id: 'preset-rolex-billboard',
    name: '⚡ ⌚ Rolex Deepsea Challenge (Mid-Page Billboard 970×250)',
    sponsorName: 'Rolex Precision Chronometers',
    badgeText: 'OFFICIAL PARTNER',
    contentType: 'image',
    headline: 'The Oyster Perpetual Deepsea Challenge',
    subtitle: 'Guaranteed waterproof to 11,000 meters. The supreme instrument of deep oceanic exploration.',
    ctaText: 'Discover Model ↗',
    targetUrl: 'https://rolex.com',
    mediaUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    mediaLayout: 'full_banner',
    mediaFit: 'contain',
    mediaHeight: '220px',
    mediaWidth: '100%',
    mediaBg: 'rgba(0, 0, 0, 0.95)',
    alignment: 'center',
    dropZoneId: 'dropzone-hero-bottom',
    widthMode: '100%',
    customWidth: '100%',
    customHeight: '180px',
    isSticky: false,
    showOnDesktop: true,
    showOnTablet: true,
    showOnMobile: true
  },
  {
    id: 'preset-google-cloud-ai',
    name: '⚡ ☁️ Google Cloud Vertex AI (In-Feed Sponsored Stream)',
    sponsorName: 'Google Cloud Platform',
    badgeText: 'CLOUD PARTNER',
    contentType: 'image',
    headline: 'Deploy Scalable AI Models Globally with Vertex AI',
    subtitle: 'Build with Gemini 1.5 Pro and enterprise security compliance at planet scale.',
    ctaText: 'Start Free Trial ↗',
    targetUrl: 'https://cloud.google.com',
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    mediaLayout: 'side_media',
    mediaFit: 'contain',
    mediaHeight: '130px',
    mediaWidth: '220px',
    mediaBg: 'rgba(0, 0, 0, 0.95)',
    alignment: 'center',
    dropZoneId: 'dropzone-feed-row-1',
    widthMode: '100%',
    customWidth: '100%',
    customHeight: '100px',
    isSticky: false,
    showOnDesktop: true,
    showOnTablet: true,
    showOnMobile: true
  },
  {
    id: 'preset-porsche-sidebar',
    name: '⚡ 🏎️ Porsche Taycan Turbo GT (Sidebar Rectangle 300×250)',
    sponsorName: 'Porsche Taycan Turbo GT',
    badgeText: 'AUTOMOTIVE',
    contentType: 'image',
    headline: 'Soul, Electrified: The All-New Porsche Taycan',
    subtitle: '0-100 km/h in 2.2 seconds. Peak performance meets timeless design.',
    ctaText: 'Configure Yours ↗',
    targetUrl: 'https://porsche.com',
    mediaUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80',
    mediaLayout: 'stacked',
    mediaFit: 'contain',
    mediaHeight: '150px',
    mediaWidth: '100%',
    mediaBg: 'rgba(0, 0, 0, 0.95)',
    alignment: 'center',
    dropZoneId: 'dropzone-sidebar-bottom',
    widthMode: '100%',
    customWidth: '100%',
    customHeight: '260px',
    isSticky: true,
    stickyTopOffset: '90px',
    showOnDesktop: true,
    showOnTablet: false,
    showOnMobile: false
  },
  {
    id: 'preset-ft-deepdives',
    name: '⚡ 📊 Financial Times Risk Index (Deep Dives Sponsor)',
    sponsorName: 'Financial Times Intelligence',
    badgeText: 'EDITORIAL PARTNER',
    headline: 'Global Geopolitical Risk Index 2026: Executive Briefing',
    subtitle: 'Exclusive macro analysis covering global supply chains, central banking, and semiconductors.',
    ctaText: 'Download Report ↗',
    targetUrl: 'https://ft.com',
    contentType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    mediaLayout: 'full_banner',
    mediaFit: 'contain',
    mediaHeight: '200px',
    mediaWidth: '100%',
    mediaBg: 'rgba(0, 0, 0, 0.95)',
    alignment: 'center',
    dropZoneId: 'dropzone-deep-dives-top',
    widthMode: '100%',
    customWidth: '100%',
    customHeight: '120px',
    isSticky: false,
    showOnDesktop: true,
    showOnTablet: true,
    showOnMobile: true
  },
  {
    id: 'preset-video-commercial',
    name: '⚡ 🎥 Apex Cyber-GT EV Video Commercial (Video Ad)',
    sponsorName: 'Apex Motors Global',
    badgeText: 'VIDEO SPOTLIGHT',
    contentType: 'video',
    headline: 'Experience the All-New Cyber-GT Autonomous Supercar',
    subtitle: 'Official continuous high-definition racetrack & wind-tunnel aerodynamic testing.',
    ctaText: 'Book VIP Test Drive ↗',
    targetUrl: 'https://apexmotors.com',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    mediaLayout: 'full_banner',
    mediaFit: 'contain',
    mediaHeight: '220px',
    mediaWidth: '100%',
    mediaBg: 'rgba(0, 0, 0, 0.95)',
    alignment: 'center',
    dropZoneId: 'dropzone-hero-bottom',
    widthMode: '100%',
    customWidth: '100%',
    customHeight: '220px',
    isSticky: false,
    showOnDesktop: true,
    showOnTablet: true,
    showOnMobile: true
  }
];

export default function HomepageAdPlacementPage() {
  const { homepageAds, updateHomepageAds, updateSingleHomepageAd, showToast } = useAdmin();

  const [activeTab, setActiveTab] = useState('studio'); // 'studio', 'live_view', 'mobile_view'
  const [activeAdId, setActiveAdId] = useState(null);
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);
  const [draggedAdId, setDraggedAdId] = useState(null);
  const [dragOverZoneId, setDragOverZoneId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleSaveLiveHomepage = async () => {
    try {
      setIsSaving(true);
      await updateHomepageAds(adPlacements);
      setSaveSuccessMsg('✅ Live Homepage & Advertisements updated successfully!');
      showToast('Live homepage ad placements saved!', 'success');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error saving homepage ads:', err);
      showToast('Failed to save live ads.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewLiveSite = () => {
    setActiveTab(prev => prev === 'live_view' ? 'studio' : 'live_view');
  };

  const handleOpenLiveSiteUrl = () => {
    window.open('https://civibrief.pages.dev', '_blank', 'noopener,noreferrer');
  };

  // Resize State
  const [resizingAdId, setResizingAdId] = useState(null);
  const resizeStartPos = useRef({ x: 0, y: 0, startW: 0, startH: 0 });

  // Ensure ad list has dropZoneId populated
  const adPlacements = useMemo(() => {
    return homepageAds.map((ad, idx) => ({
      ...ad,
      dropZoneId: ad.dropZoneId || HOMEPAGE_DROP_ZONES[idx % HOMEPAGE_DROP_ZONES.length].id,
      alignment: ad.alignment || 'center',
      widthMode: ad.widthMode || '100%',
      customWidth: ad.customWidth || '100%',
      customHeight: ad.customHeight || 'auto',
      contentType: ad.contentType || 'image'
    }));
  }, [homepageAds]);

  // Active Ad for editor
  const currentAd = useMemo(() => {
    if (activeAdId) {
      const found = adPlacements.find(a => a.id === activeAdId);
      if (found) return found;
    }
    return adPlacements[0] || null;
  }, [activeAdId, adPlacements]);

  // Set first ad active by default if none selected
  useEffect(() => {
    if (!activeAdId && adPlacements.length > 0) {
      setActiveAdId(adPlacements[0].id);
    }
  }, [activeAdId, adPlacements]);

  // Global mouse handlers for live drag-to-resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!resizingAdId) return;
      const dx = e.clientX - resizeStartPos.current.x;
      const dy = e.clientY - resizeStartPos.current.y;
      const newW = Math.max(260, resizeStartPos.current.startW + dx);
      const newH = Math.max(70, resizeStartPos.current.startH + dy);

      updateSingleHomepageAd(resizingAdId, {
        customWidth: `${newW}px`,
        customHeight: `${newH}px`,
        widthMode: 'custom'
      });
    };

    const handleMouseUp = () => {
      if (resizingAdId) {
        setResizingAdId(null);
        showToast("Ad dimensions resized successfully!", "info");
      }
    };

    if (resizingAdId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingAdId, updateSingleHomepageAd, showToast]);

  const handleStartResize = (ad, e) => {
    e.preventDefault();
    e.stopPropagation();
    const cardEl = e.currentTarget.closest('.resizable-ad-card');
    const startW = cardEl ? cardEl.offsetWidth : 600;
    const startH = cardEl ? cardEl.offsetHeight : 120;
    resizeStartPos.current = { x: e.clientX, y: e.clientY, startW, startH };
    setResizingAdId(ad.id);
  };

  // Add Blank Ad
  const handleAddBlankAd = () => {
    const newId = `ad-custom-${Date.now()}`;
    const targetZone = HOMEPAGE_DROP_ZONES[adPlacements.length % HOMEPAGE_DROP_ZONES.length];
    const newAd = {
      id: newId,
      slotId: `slot-${Date.now()}`,
      slotName: `Custom Ad #${adPlacements.length + 1}`,
      dropZoneId: targetZone.id,
      enabled: true,
      sponsorName: 'New Sponsor Name',
      badgeText: 'SPONSORED',
      headline: 'Promotional Headline Copy Goes Here',
      subtitle: 'Supporting description of the featured service, offer, or special product.',
      ctaText: 'Learn More ↗',
      targetUrl: 'https://dailybrief.com',
      contentType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      alignment: 'center',
      widthMode: '100%',
      customWidth: '100%',
      customHeight: 'auto',
      customHtml: ''
    };
    const updated = [...adPlacements, newAd];
    updateHomepageAds(updated);
    setActiveAdId(newId);
    showToast(`Added new ad #${updated.length}`, 'success');
  };

  // Insert Preset Template
  const handleInsertPreset = (preset) => {
    const newId = `ad-preset-${Date.now()}`;
    const newAd = {
      ...preset,
      id: newId,
      slotId: `slot-${Date.now()}`,
      slotName: preset.sponsorName,
      enabled: true
    };
    const updated = [...adPlacements, newAd];
    updateHomepageAds(updated);
    setActiveAdId(newId);
    setIsPresetDropdownOpen(false);
    showToast(`Inserted preset: "${preset.sponsorName}"`, 'success');
  };

  // Remove Ad
  const handleRemoveAd = (adId, e) => {
    if (e) e.stopPropagation();
    if (confirm("Are you sure you want to remove this ad placement?")) {
      const updated = adPlacements.filter(a => a.id !== adId);
      updateHomepageAds(updated);
      if (activeAdId === adId && updated.length > 0) {
        setActiveAdId(updated[0].id);
      }
      showToast("Ad removed", "info");
    }
  };

  // Toggle Active on Homepage
  const handleToggleActive = (adId, e) => {
    if (e) e.stopPropagation();
    const ad = adPlacements.find(a => a.id === adId);
    if (ad) {
      updateSingleHomepageAd(adId, { enabled: !ad.enabled });
      showToast(`Ad "${ad.sponsorName}" ${!ad.enabled ? 'Activated' : 'Paused'}`, 'info');
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e, adId) => {
    e.dataTransfer.setData('text/plain', adId);
    setDraggedAdId(adId);
  };

  const handleDragOver = (e, zoneId) => {
    e.preventDefault();
    if (dragOverZoneId !== zoneId) {
      setDragOverZoneId(zoneId);
    }
  };

  const handleDragLeave = () => {
    setDragOverZoneId(null);
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    const adId = e.dataTransfer.getData('text/plain') || draggedAdId;
    if (adId) {
      updateSingleHomepageAd(adId, { dropZoneId: zoneId });
      setActiveAdId(adId);
      showToast(`Ad moved to ${HOMEPAGE_DROP_ZONES.find(z => z.id === zoneId)?.label || zoneId}`, 'success');
    }
    setDraggedAdId(null);
    setDragOverZoneId(null);
  };

  const isMobile = activeTab === 'mobile_view';
  const isLiveReader = activeTab === 'live_view';

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '5rem' }}>
      
      {/* 1. TOP HEADER TOOLBAR (THEME-ADAPTIVE) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Left Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '13px',
              background: activeTab === 'studio' ? '#8b5cf6' : 'var(--bg-surface)',
              color: activeTab === 'studio' ? '#ffffff' : 'var(--text-main)',
              border: activeTab === 'studio' ? '1px solid #8b5cf6' : '1px solid var(--border-color)',
              cursor: 'pointer',
              boxShadow: activeTab === 'studio' ? '0 4px 12px rgba(139, 92, 246, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <LayoutGrid size={15} /> Homepage Studio
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('live_view')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '13px',
              background: activeTab === 'live_view' ? '#10b981' : 'var(--bg-surface)',
              color: activeTab === 'live_view' ? '#ffffff' : 'var(--text-main)',
              border: activeTab === 'live_view' ? '1px solid #10b981' : '1px solid var(--border-color)',
              cursor: 'pointer',
              boxShadow: activeTab === 'live_view' ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <FileText size={15} /> Full Homepage View with Ads
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mobile_view')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '13px',
              background: activeTab === 'mobile_view' ? '#3b82f6' : 'var(--bg-surface)',
              color: activeTab === 'mobile_view' ? '#ffffff' : 'var(--text-main)',
              border: activeTab === 'mobile_view' ? '1px solid #3b82f6' : '1px solid var(--border-color)',
              cursor: 'pointer',
              boxShadow: activeTab === 'mobile_view' ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Smartphone size={15} /> Mobile Flow
          </button>
        </div>

        {/* Right Actions: Insert Preset & Add Blank Ad */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          {/* Insert Preset Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsPresetDropdownOpen(!isPresetDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '13px',
                background: '#06b6d4',
                color: '#000000',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.35)'
              }}
            >
              <Zap size={15} fill="#000000" />
              <span>⚡ Insert Preset Ad</span>
              <ChevronDown size={14} />
            </button>

            {isPresetDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '380px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color-strong)',
                borderRadius: '10px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                zIndex: 9999,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '10px 14px', background: 'var(--bg-card)', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Select High-Converting Preset Template
                </div>
                <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                  {HOMEPAGE_AD_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleInsertPreset(preset)}
                      style={{
                        padding: '12px 14px',
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>
                        {preset.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {preset.headline}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add Blank Ad Button */}
          <button
            type="button"
            onClick={handleAddBlankAd}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '12.5px',
              background: '#8b5cf6',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
            }}
          >
            <Plus size={15} /> + Add Blank Ad ({adPlacements.length})
          </button>

          {/* Preview Live Site Toggle / Button */}
          <button
            type="button"
            onClick={handlePreviewLiveSite}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '12.5px',
              background: activeTab === 'live_view' ? '#6366f1' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
            }}
            title="Preview Homepage with Live Placements"
          >
            <Eye size={15} /> {activeTab === 'live_view' ? '🛠️ Exit Preview' : '👁️ Preview Live Site'}
          </button>

          {/* Update Live Homepage & Ads Button */}
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveLiveHomepage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: 900,
              fontSize: '13px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}
            title="Save and publish all homepage ad placements live"
          >
            <Save size={15} /> {isSaving ? 'Updating...' : '💾 Update Live Homepage & Ads'}
          </button>
        </div>
      </div>

      {/* 2. ACTIVE ADS PILLS ROW (THEME-ADAPTIVE) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          ACTIVE ADS:
        </span>
        {adPlacements.map((ad, idx) => {
          const isSelected = ad.id === currentAd?.id;
          const zone = HOMEPAGE_DROP_ZONES.find(z => z.id === ad.dropZoneId);
          return (
            <button
              key={ad.id}
              type="button"
              onClick={() => setActiveAdId(ad.id)}
              draggable
              onDragStart={(e) => handleDragStart(e, ad.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                background: isSelected ? 'rgba(168, 85, 247, 0.15)' : 'var(--bg-surface)',
                border: isSelected ? '1.5px solid #a855f7' : '1px solid var(--border-color)',
                color: isSelected ? 'var(--text-main)' : 'var(--text-secondary)',
                cursor: 'grab',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 0 12px rgba(168, 85, 247, 0.25)' : 'none'
              }}
            >
              <GripVertical size={12} style={{ color: 'var(--text-muted)' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: ad.enabled ? '#10b981' : '#ef4444' }} />
              <span>
                {ad.contentType === 'video' ? '🎥' : ad.contentType === 'collage' ? '🖼️' : '📢'} Ad #{idx + 1}: {ad.alignment?.toUpperCase()} ({zone?.label || 'Custom'})
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. AD CONFIGURATION STUDIO CONTROLS (EXACTLY MATCHING IMAGE 1 & THEME-ADAPTIVE) */}
      {currentAd && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border-color-strong)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          {/* Row 1: AD CONTENT FORMAT: [Multi-Media Collage] [Interactive Banner Box] [Embed Online Image] [Embed Online Video] [Custom HTML Embed]   [Active on Homepage] [Remove] */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--accent-purple, #8b5cf6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '6px' }}>
                AD CONTENT FORMAT:
              </span>

              {[
                { id: 'collage', label: 'Multi-Media Collage', icon: '🖼️' },
                { id: 'banner', label: 'Interactive Banner Box', icon: '📢' },
                { id: 'image', label: 'Embed Online Image', icon: '🖼️' },
                { id: 'video', label: 'Embed Online Video', icon: '🎥' },
                { id: 'html', label: 'Custom HTML Embed', icon: '💻' }
              ].map((fmt) => {
                const isSelected = currentAd.contentType === fmt.id || (!currentAd.contentType && fmt.id === 'image');
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => updateSingleHomepageAd(currentAd.id, { contentType: fmt.id })}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: isSelected ? '#8b5cf6' : 'var(--bg-surface)',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      border: isSelected ? '1px solid #8b5cf6' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 12px rgba(139, 92, 246, 0.4)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{fmt.icon}</span>
                    <span>{fmt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Toggle & Remove Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={(e) => handleToggleActive(currentAd.id, e)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 800,
                  background: currentAd.enabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: currentAd.enabled ? '#10b981' : '#ef4444',
                  border: `1px solid ${currentAd.enabled ? '#10b981' : '#ef4444'}`,
                  cursor: 'pointer'
                }}
              >
                {currentAd.enabled ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                <span>Active on Homepage</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleRemoveAd(currentAd.id, e)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>

          {/* Row 2: ALIGNMENT (NEWSPAPER FLOW) | ASSIGNED BREAKPOINT ZONE | DISCLOSURE TAG LABEL */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 1.2fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* Alignment Controls */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: 'var(--accent-purple, #8b5cf6)', textTransform: 'uppercase', marginBottom: '6px' }}>
                ALIGNMENT (HOMEPAGE FLOW)
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[
                  { id: 'left', label: 'Left (Float)', icon: <AlignLeft size={14} /> },
                  { id: 'center', label: 'Center', icon: <AlignCenter size={14} /> },
                  { id: 'right', label: 'Right (Float)', icon: <AlignRight size={14} /> },
                  { id: 'full', label: 'Full Width', icon: <Maximize2 size={14} /> }
                ].map(align => {
                  const isSelected = (currentAd.alignment || 'center') === align.id;
                  return (
                    <button
                      key={align.id}
                      type="button"
                      onClick={() => {
                        let nextWidth = currentAd.customWidth || '100%';
                        if (align.id === 'left' || align.id === 'right') {
                          nextWidth = '320px';
                        } else if (align.id === 'center') {
                          nextWidth = '75%';
                        } else if (align.id === 'full') {
                          nextWidth = '100%';
                        }
                        updateSingleHomepageAd(currentAd.id, { alignment: align.id, customWidth: nextWidth });
                        showToast(`Switched to ${align.label}`, 'info');
                      }}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '8px 4px',
                        borderRadius: '6px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        background: isSelected ? '#8b5cf6' : 'var(--bg-surface)',
                        color: isSelected ? '#ffffff' : 'var(--text-main)',
                        border: isSelected ? '1px solid #8b5cf6' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 0 10px rgba(139, 92, 246, 0.35)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {align.icon}
                      <span>{align.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assigned Breakpoint Zone Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: 'var(--accent-purple, #8b5cf6)', textTransform: 'uppercase', marginBottom: '6px' }}>
                ASSIGNED BREAKPOINT ZONE
              </label>
              <select
                className="form-control"
                value={currentAd.dropZoneId}
                onChange={(e) => updateSingleHomepageAd(currentAd.id, { dropZoneId: e.target.value })}
                style={{
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color-strong)',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  height: '42px'
                }}
              >
                {HOMEPAGE_DROP_ZONES.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    📍 {zone.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Disclosure Tag Label */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: 'var(--accent-purple, #8b5cf6)', textTransform: 'uppercase', marginBottom: '6px' }}>
                DISCLOSURE TAG LABEL
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Sponsored Health & Wellness"
                value={currentAd.badgeText || ''}
                onChange={(e) => updateSingleHomepageAd(currentAd.id, { badgeText: e.target.value })}
                style={{ background: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '12px', height: '42px' }}
              />
            </div>
          </div>

          {/* Row 2.5: RESIZE & DIMENSION OPTIONS (PRESETS & SLIDERS) */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Maximize2 size={13} style={{ color: 'var(--accent-purple, #8b5cf6)' }} />
                <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--accent-purple, #8b5cf6)', textTransform: 'uppercase' }}>
                  AD RESIZING & DIMENSION CONTROLS:
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-green, #10b981)' }}>
                Current Size: {currentAd.customWidth || '100%'} × {currentAd.customHeight || 'auto'}
              </span>
            </div>

            {/* Quick Preset Dimension Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {[
                { label: 'Skyscraper (160×600)', width: '160px', height: '600px', align: currentAd.alignment === 'right' ? 'right' : 'left' },
                { label: 'Wide Skyscraper (120×600)', width: '120px', height: '600px', align: currentAd.alignment === 'right' ? 'right' : 'left' },
                { label: 'Leaderboard (728×90)', width: '728px', height: '90px', align: 'center' },
                { label: 'Billboard (970×250)', width: '970px', height: '220px', align: 'center' },
                { label: 'Medium Rect (300×250)', width: '300px', height: '260px', align: currentAd.alignment === 'right' ? 'right' : 'left' },
                { label: '100% Full Width', width: '100%', height: 'auto', align: 'full' },
                { label: '75% Large Banner', width: '75%', height: 'auto', align: 'center' },
                { label: '50% Half Width', width: '50%', height: 'auto', align: currentAd.alignment === 'right' ? 'right' : 'left' }
              ].map(dim => {
                const isSelected = currentAd.customWidth === dim.width;
                return (
                  <button
                    key={dim.label}
                    type="button"
                    onClick={() => updateSingleHomepageAd(currentAd.id, { customWidth: dim.width, customHeight: dim.height, alignment: dim.align || currentAd.alignment })}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: isSelected ? '#8b5cf6' : 'var(--bg-card)',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      border: isSelected ? '1px solid #8b5cf6' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {dim.label}
                  </button>
                );
              })}
            </div>

            {/* Interactive Sliders & Precise Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', alignItems: 'center' }}>
              {/* Width Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Width Slider:</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{currentAd.customWidth || '100%'}</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="100"
                  step="5"
                  value={parseInt(currentAd.customWidth) || 100}
                  onChange={(e) => updateSingleHomepageAd(currentAd.id, { customWidth: `${e.target.value}%` })}
                  style={{ width: '100%', cursor: 'pointer', accentColor: '#8b5cf6' }}
                />
              </div>

              {/* Custom Width & Height Inputs */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Custom Width</label>
                  <input
                    type="text"
                    value={currentAd.customWidth || '100%'}
                    onChange={(e) => updateSingleHomepageAd(currentAd.id, { customWidth: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', fontSize: '12px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Height</label>
                  <input
                    type="text"
                    value={currentAd.customHeight || 'auto'}
                    onChange={(e) => updateSingleHomepageAd(currentAd.id, { customHeight: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', fontSize: '12px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2.75: STICKY AD BEHAVIOR & DEVICE VISIBILITY CONTROLS (THE ECONOMIC TIMES FEATURE) */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '14px 16px',
            marginBottom: '1.25rem',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '16px'
          }}>
            {/* Left: Sticky Settings */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Zap size={13} style={{ color: 'var(--accent-purple, #8b5cf6)' }} />
                <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--accent-purple, #8b5cf6)', textTransform: 'uppercase' }}>
                  DESKTOP STICKY SCROLL BEHAVIOR:
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-main)' }}>
                  <input
                    type="checkbox"
                    checked={currentAd.isSticky !== false}
                    onChange={(e) => updateSingleHomepageAd(currentAd.id, { isSticky: e.target.checked })}
                    style={{ accentColor: '#8b5cf6', width: '15px', height: '15px' }}
                  />
                  <span>Enable Desktop Sticky Pinning</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Top Offset:</label>
                  <input
                    type="text"
                    value={currentAd.stickyTopOffset || '90px'}
                    onChange={(e) => updateSingleHomepageAd(currentAd.id, { stickyTopOffset: e.target.value })}
                    placeholder="90px"
                    style={{ width: '65px', padding: '4px 6px', fontSize: '11.5px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                  />
                </div>
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                Left & right rail skyscrapers remain fixed in view during vertical scroll. Top leaderboard banner scrolls naturally with page.
              </div>
            </div>

            {/* Right: Device Visibility Toggles */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Monitor size={13} style={{ color: 'var(--accent-blue, #3b82f6)' }} />
                <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--accent-blue, #3b82f6)', textTransform: 'uppercase' }}>
                  RESPONSIVE DEVICE VISIBILITY:
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-main)' }}>
                  <input
                    type="checkbox"
                    checked={currentAd.showOnDesktop !== false}
                    onChange={(e) => updateSingleHomepageAd(currentAd.id, { showOnDesktop: e.target.checked })}
                    style={{ accentColor: '#3b82f6', width: '14px', height: '14px' }}
                  />
                  <span>🖥️ Desktop</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-main)' }}>
                  <input
                    type="checkbox"
                    checked={currentAd.showOnTablet || false}
                    onChange={(e) => updateSingleHomepageAd(currentAd.id, { showOnTablet: e.target.checked })}
                    style={{ accentColor: '#3b82f6', width: '14px', height: '14px' }}
                  />
                  <span>📱 Tablet</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-main)' }}>
                  <input
                    type="checkbox"
                    checked={currentAd.showOnMobile || false}
                    onChange={(e) => updateSingleHomepageAd(currentAd.id, { showOnMobile: e.target.checked })}
                    style={{ accentColor: '#3b82f6', width: '14px', height: '14px' }}
                  />
                  <span>📲 Mobile</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-main)', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    checked={currentAd.openNewTab !== false}
                    onChange={(e) => updateSingleHomepageAd(currentAd.id, { openNewTab: e.target.checked })}
                    style={{ accentColor: '#10b981', width: '14px', height: '14px' }}
                  />
                  <span>↗ Open in New Tab</span>
                </label>
              </div>
            </div>
          </div>

          {/* Row 3: DESTINATION HYPERLINK BOX (EXACTLY MATCHING IMAGE 1) */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '1.25rem'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 900, color: 'var(--accent-blue, #3b82f6)', textTransform: 'uppercase', marginBottom: '8px' }}>
              <LinkIcon size={13} /> DESTINATION HYPERLINK (REDIRECT URL WHEN READER CLICKS AD):
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="url"
                className="form-control"
                placeholder="https://taichi-academy.org/daily-brief-offer"
                value={currentAd.targetUrl || ''}
                onChange={(e) => updateSingleHomepageAd(currentAd.id, { targetUrl: e.target.value })}
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  flex: 1,
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  border: '1px solid var(--border-color-strong)'
                }}
              />
              <a
                href={currentAd.targetUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: 'var(--accent-blue, #3b82f6)',
                  border: '1px solid var(--accent-blue, #3b82f6)',
                  borderRadius: '6px',
                  padding: '8px 18px',
                  fontSize: '12px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <ExternalLink size={14} /> Test Redirect ↗
              </a>
            </div>
          </div>

          {/* Row 4: EMBED CONTENT BOX (ACCORDING TO SELECTED FORMAT) */}
          {(currentAd.contentType === 'image' || !currentAd.contentType) && (
            <div style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '14px 16px',
              boxSizing: 'border-box',
              marginBottom: '1.25rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 900, color: 'var(--accent-purple, #8b5cf6)', textTransform: 'uppercase', marginBottom: '8px' }}>
                <ImageIcon size={14} /> EMBED ONLINE IMAGE BANNER (DIRECT IMAGE URL):
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80"
                value={currentAd.mediaUrl || ''}
                onChange={(e) => updateSingleHomepageAd(currentAd.id, { mediaUrl: e.target.value })}
                style={{
                  width: '100%',
                  display: 'block',
                  boxSizing: 'border-box',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-mono)',
                  border: '1px solid var(--border-color-strong)',
                  padding: '10px 14px',
                  borderRadius: '6px'
                }}
              />
            </div>
          )}

          {/* Interactive Banner Box Fields */}
          {currentAd.contentType === 'banner' && (
            <div style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '14px 16px',
              boxSizing: 'border-box',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    SPONSOR / CLIENT NAME
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Binance VIP, Rolex, Tesla"
                    value={currentAd.sponsorName || ''}
                    onChange={(e) => updateSingleHomepageAd(currentAd.id, { sponsorName: e.target.value })}
                    style={{ width: '100%', display: 'block', boxSizing: 'border-box', background: 'var(--bg-card)', color: 'var(--text-main)', padding: '10px 14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    CTA BUTTON LABEL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Explore Platform ↗"
                    value={currentAd.ctaText || ''}
                    onChange={(e) => updateSingleHomepageAd(currentAd.id, { ctaText: e.target.value })}
                    style={{ width: '100%', display: 'block', boxSizing: 'border-box', background: 'var(--bg-card)', color: 'var(--text-main)', padding: '10px 14px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  PROMOTIONAL HEADLINE TITLE
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Primary promotional headline..."
                  value={currentAd.headline || ''}
                  onChange={(e) => updateSingleHomepageAd(currentAd.id, { headline: e.target.value })}
                  style={{ width: '100%', display: 'block', boxSizing: 'border-box', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 700, padding: '10px 14px' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  SUPPORTING SUBTITLE / DESCRIPTION
                </label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Brief description of the offer or product..."
                  value={currentAd.subtitle || ''}
                  onChange={(e) => updateSingleHomepageAd(currentAd.id, { subtitle: e.target.value })}
                  style={{ width: '100%', display: 'block', boxSizing: 'border-box', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '12px', padding: '10px 14px' }}
                />
              </div>

              <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: 'var(--accent-purple, #8b5cf6)', textTransform: 'uppercase', marginBottom: '4px' }}>
                BANNER IMAGE URL
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={currentAd.mediaUrl || ''}
                onChange={(e) => updateSingleHomepageAd(currentAd.id, { mediaUrl: e.target.value })}
                style={{ width: '100%', display: 'block', boxSizing: 'border-box', background: 'var(--bg-card)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '10px 14px' }}
              />
            </div>
          )}

          {/* Embed Online Video Fields */}
          {currentAd.contentType === 'video' && (
            <div style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '14px 16px',
              boxSizing: 'border-box',
              marginBottom: '1.25rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 900, color: 'var(--accent-purple, #8b5cf6)', textTransform: 'uppercase', marginBottom: '8px' }}>
                <Video size={14} /> EMBED ONLINE VIDEO (DIRECT MP4 OR YOUTUBE / VIMEO URL):
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="https://commondatastorage.googleapis.com/...mp4 or YouTube link"
                value={currentAd.mediaUrl || ''}
                onChange={(e) => updateSingleHomepageAd(currentAd.id, { mediaUrl: e.target.value })}
                style={{ width: '100%', display: 'block', boxSizing: 'border-box', background: 'var(--bg-card)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontSize: '12.5px', padding: '10px 14px' }}
              />
            </div>
          )}

          {/* DEDICATED MEDIA RESIZING, COMPLETE VISIBILITY & LAYOUT CONTROL PANEL */}
          {(currentAd.contentType === 'image' || currentAd.contentType === 'video' || currentAd.contentType === 'banner' || !currentAd.contentType || currentAd.mediaUrl) && (
            <div style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--accent-purple, #8b5cf6)',
              borderRadius: '10px',
              padding: '16px 18px',
              boxSizing: 'border-box',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Maximize2 size={16} style={{ color: 'var(--accent-purple, #8b5cf6)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🎨 Image & Video Sizing & Visibility Options
                  </span>
                </div>
                <span style={{ fontSize: '10.5px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple, #8b5cf6)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                  HOMEPAGE DISPLAY CONTROLS
                </span>
              </div>

              {/* 1. MEDIA DISPLAY LAYOUT */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  1. Media Presentation Layout on Homepage:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'full_banner', label: 'Full Billboard Banner', desc: 'Full-width media stage with CTA footer' },
                    { id: 'side_media', label: 'Side-by-Side (Split)', desc: 'Media alongside headline & button' },
                    { id: 'stacked', label: 'Stacked (Top Media)', desc: 'Large top media with details below' },
                    { id: 'media_only', label: 'Pure Creative Banner', desc: 'Direct clickable visual banner' }
                  ].map(mode => {
                    const isSel = (currentAd.mediaLayout || (currentAd.format === 'billboard' ? 'full_banner' : 'side_media')) === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => updateSingleHomepageAd(currentAd.id, { mediaLayout: mode.id })}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: isSel ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                          background: isSel ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-card)',
                          color: isSel ? '#ffffff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ fontSize: '11.5px', fontWeight: 800, color: isSel ? '#c084fc' : 'var(--text-main)', marginBottom: '2px' }}>
                          {mode.label}
                        </div>
                        <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                          {mode.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. MEDIA FIT / COMPLETE VISIBILITY MODE */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Eye size={13} style={{ color: '#10b981' }} />
                  2. Media Scaling & Complete Visibility Mode:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'contain', label: '🔍 Completely Visible', desc: '100% visible, no crop (Recommended)' },
                    { id: 'cover', label: '📐 Fill & Crop', desc: 'Fills container area' },
                    { id: 'fill', label: '↕️ Stretch to Fit', desc: 'Exact 100% boundary stretch' },
                    { id: 'scale-down', label: '🌟 Original Scale', desc: 'Natural proportions' }
                  ].map(fit => {
                    const isSel = (currentAd.mediaFit || 'contain') === fit.id;
                    return (
                      <button
                        key={fit.id}
                        type="button"
                        onClick={() => updateSingleHomepageAd(currentAd.id, { mediaFit: fit.id })}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: isSel ? '2px solid #10b981' : '1px solid var(--border-color)',
                          background: isSel ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                          color: isSel ? '#ffffff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ fontSize: '11px', fontWeight: 800, color: isSel ? '#34d399' : 'var(--text-main)', marginBottom: '2px' }}>
                          {fit.label}
                        </div>
                        <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                          {fit.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. MEDIA HEIGHT & WIDTH CONTROLS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                {/* Media Height */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Media Height:
                    </label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>
                      {currentAd.mediaHeight || '220px'}
                    </span>
                  </div>
                  {/* Preset Buttons */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {[
                      { label: '90px Compact', val: '90px' },
                      { label: '140px Standard', val: '140px' },
                      { label: '220px Billboard', val: '220px' },
                      { label: '300px Tall', val: '300px' },
                      { label: '400px Hero', val: '400px' },
                      { label: 'Auto', val: 'auto' }
                    ].map(p => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => updateSingleHomepageAd(currentAd.id, { mediaHeight: p.val })}
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 7px',
                          borderRadius: '4px',
                          border: (currentAd.mediaHeight || '220px') === p.val ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                          background: (currentAd.mediaHeight || '220px') === p.val ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-card)',
                          color: (currentAd.mediaHeight || '220px') === p.val ? '#38bdf8' : 'var(--text-secondary)',
                          cursor: 'pointer'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 220px, 300px, auto"
                    value={currentAd.mediaHeight || '220px'}
                    onChange={(e) => updateSingleHomepageAd(currentAd.id, { mediaHeight: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '12px', padding: '6px 10px' }}
                  />
                </div>

                {/* Media Width (For Side-by-side or bounded cards) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Media Width (Side-by-Side):
                    </label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#a855f7' }}>
                      {currentAd.mediaWidth || '220px'}
                    </span>
                  </div>
                  {/* Preset Buttons */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {[
                      { label: '140px Small', val: '140px' },
                      { label: '220px Standard', val: '220px' },
                      { label: '320px Wide', val: '320px' },
                      { label: '40% Split', val: '40%' },
                      { label: '50% Half', val: '50%' }
                    ].map(p => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => updateSingleHomepageAd(currentAd.id, { mediaWidth: p.val })}
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 7px',
                          borderRadius: '4px',
                          border: (currentAd.mediaWidth || '220px') === p.val ? '1px solid #a855f7' : '1px solid var(--border-color)',
                          background: (currentAd.mediaWidth || '220px') === p.val ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-card)',
                          color: (currentAd.mediaWidth || '220px') === p.val ? '#a855f7' : 'var(--text-secondary)',
                          cursor: 'pointer'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 220px, 320px, 40%"
                    value={currentAd.mediaWidth || '220px'}
                    onChange={(e) => updateSingleHomepageAd(currentAd.id, { mediaWidth: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '12px', padding: '6px 10px' }}
                  />
                </div>
              </div>

              {/* 4. MEDIA LETTERBOX BACKDROP COLOR */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Letterbox Backdrop Framing (When using Completely Visible / Contain):
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Deep Black', color: '#000000' },
                    { label: 'Slate Dark', color: '#0f172a' },
                    { label: 'Card Surface', color: 'var(--bg-card)' },
                    { label: 'Transparent', color: 'transparent' },
                    { label: 'Pure White', color: '#ffffff' }
                  ].map(bg => (
                    <button
                      key={bg.label}
                      type="button"
                      onClick={() => updateSingleHomepageAd(currentAd.id, { mediaBg: bg.color })}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        border: (currentAd.mediaBg || '#000000') === bg.color ? '2px solid #8b5cf6' : '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: bg.color, border: '1px solid #666', display: 'inline-block' }} />
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. LIVE MEDIA PREVIEW CONTAINER IN AD EDITOR */}
              {currentAd.mediaUrl && (
                <div style={{
                  width: '100%',
                  marginTop: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: currentAd.mediaBg || '#000000',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    zIndex: 5,
                    background: 'rgba(0,0,0,0.85)',
                    color: '#c084fc',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(192, 132, 252, 0.3)'
                  }}>
                    LIVE PREVIEW ({currentAd.mediaFit || 'contain'} · {currentAd.mediaHeight || '220px'})
                  </div>
                  <div style={{
                    width: '100%',
                    height: currentAd.mediaHeight === 'auto' ? '220px' : (currentAd.mediaHeight || '220px'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {currentAd.contentType === 'video' ? (
                      <ContinuousCoverVideo
                        src={currentAd.mediaUrl}
                        autoPlay={true}
                        muted={true}
                        loop={true}
                        controls={false}
                        style={{ width: '100%', height: '100%', objectFit: currentAd.mediaFit || 'contain' }}
                      />
                    ) : (
                      <img
                        src={currentAd.mediaUrl}
                        alt="Ad preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: currentAd.mediaFit || 'contain',
                          display: 'block'
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Multi-Media Collage Fields */}
          {currentAd.contentType === 'collage' && (
            <div style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '14px 16px',
              boxSizing: 'border-box'
            }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: 'var(--accent-purple, #8b5cf6)', textTransform: 'uppercase', marginBottom: '8px' }}>
                🖼️ MULTI-MEDIA 2X2 QUAD COLLAGE SHOWCASE:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', height: '110px' }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={`col-prev-${i}`} style={{ background: `url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80) center/cover`, borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                ))}
              </div>
            </div>
          )}

          {/* Custom HTML Embed Fields with Google Ads & AdSense Tools */}
          {currentAd.contentType === 'html' && (
            <div style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '14px 16px',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 900, color: 'var(--accent-purple, #8b5cf6)', textTransform: 'uppercase' }}>
                  <Code size={14} /> GOOGLE ADSENSE & GOOGLE AD MANAGER (DFP) CODE EMBED:
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const template = `<ins class="adsbygoogle"\n  style="display:inline-block;width:160px;height:600px"\n  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"\n  data-ad-slot="1234567890"></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`;
                      updateSingleHomepageAd(currentAd.id, { customHtml: template, customWidth: '160px', customHeight: '600px', widthMode: 'custom' });
                      showToast('Inserted Google Ads 160×600 Skyscraper snippet', 'info');
                    }}
                    style={{ fontSize: '10.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid #3b82f6', cursor: 'pointer' }}
                  >
                    + Skyscraper Tag
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const template = `<ins class="adsbygoogle"\n  style="display:inline-block;width:728px;height:90px"\n  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"\n  data-ad-slot="9876543210"></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`;
                      updateSingleHomepageAd(currentAd.id, { customHtml: template, customWidth: '728px', customHeight: '90px', widthMode: 'custom' });
                      showToast('Inserted Google Ads 728×90 Leaderboard snippet', 'info');
                    }}
                    style={{ fontSize: '10.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', cursor: 'pointer' }}
                  >
                    + Leaderboard Tag
                  </button>
                </div>
              </div>
              <textarea
                className="form-control"
                rows={5}
                placeholder="<!-- Paste Google AdSense <ins> tag, Google Ad Manager script, or iframe embed code here -->"
                value={currentAd.customHtml || ''}
                onChange={(e) => updateSingleHomepageAd(currentAd.id, { customHtml: e.target.value })}
                style={{ width: '100%', display: 'block', boxSizing: 'border-box', background: 'var(--bg-card)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '10px 14px' }}
              />
            </div>
          )}
        </div>
      )}


      {/* 4. VISUAL HOMEPAGE CANVAS WITH DRAG-AND-DROP & RESIZE (THEME-ADAPTIVE) */}
      <div style={{
        background: 'var(--bg-card)',
        border: '2px solid var(--border-color-strong)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
      }}>
        {/* Top Browser Bar */}
        <div style={{ background: 'var(--bg-surface)', padding: '10px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '12px' }}>https://civibrief.pages.dev (Live Homepage Layout)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--accent-green, #10b981)', fontWeight: 800 }}>
            <Sparkles size={14} />
            <span>{isLiveReader ? '👁️ Live Reader Mode (Ads Embedded)' : '🛠️ Studio Drag & Resize Placement Mode'}</span>
          </div>
        </div>

        {/* CANVAS BODY (3-ZONE DESKTOP PREVIEW) */}
        <div style={{
          padding: isMobile ? '16px' : '24px 20px',
          maxWidth: isMobile ? '480px' : '100%',
          margin: '0 auto',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', justifyContent: 'center' }}>
            {/* CENTRAL NEWSPAPER EDITORIAL FLOW */}
            <div style={{ flex: 1, minWidth: 0, maxWidth: isMobile ? '100%' : '1180px', width: '100%' }}>
              {/* ZONE 1: MASTHEAD TOP BANNER (NATURAL SCROLL) */}
              {renderInteractiveDropZone('dropzone-masthead-top', 'Masthead Top Banner (Below Navigation Bar)', adPlacements, isLiveReader, activeAdId, setActiveAdId, handleDragStart, handleDragOver, handleDragLeave, handleDrop, dragOverZoneId, handleStartResize, handleToggleActive, handleRemoveAd)}

              {/* SIMULATED HOMEPAGE MASTHEAD */}
              <div style={{ margin: '1.5rem 0', padding: '1.25rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '1.4rem' : '2rem', fontWeight: 900, letterSpacing: '2px', color: 'var(--text-main)' }}>DAILY ⚜ BRIEF</div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Top Stories</span>
                    <span>Tech & AI</span>
                    <span>Markets</span>
                    <span style={{ color: 'var(--accent-blue, #3b82f6)' }}>Deep Dives 💎</span>
                  </div>
                </div>

                {/* ZONE 2: ABOVE HERO SPOTLIGHT */}
                {renderInteractiveDropZone('dropzone-hero-above', 'Above Hero Spotlight (Top Stories)', adPlacements, isLiveReader, activeAdId, setActiveAdId, handleDragStart, handleDragOver, handleDragLeave, handleDrop, dragOverZoneId, handleStartResize, handleToggleActive, handleRemoveAd)}

                {/* Top 4 Stories Simulation */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.8fr 1.2fr', gap: '16px', minHeight: '280px' }}>
                  <div style={{ background: 'var(--bg-card)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, background: 'url(https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80) center/cover' }} />
                    <div style={{ padding: '14px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--accent-green, #10b981)', fontWeight: 800 }}>TECHNOLOGY • AI</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>The Architecture of Tomorrow: Next-Gen Compute Models</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gap: '8px' }}>
                    {[1, 2, 3, 4].map(idx => (
                      <div key={`sample-side-${idx}`} style={{ background: 'var(--bg-card)', borderRadius: '6px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border-color)' }}>
                        <div>
                          <div style={{ fontSize: '9px', color: 'var(--accent-green, #10b981)', fontWeight: 700 }}>NEWS 0{idx}</div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>Story Headline 0{idx} Preview Title</div>
                        </div>
                        <div style={{ width: '55px', height: '36px', background: 'var(--bg-surface-hover)', borderRadius: '4px', flexShrink: 0 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ZONE 3: HERO BOTTOM BILLBOARD */}
              {renderInteractiveDropZone('dropzone-hero-bottom', 'Below Hero Section (Billboard Zone)', adPlacements, isLiveReader, activeAdId, setActiveAdId, handleDragStart, handleDragOver, handleDragLeave, handleDrop, dragOverZoneId, handleStartResize, handleToggleActive, handleRemoveAd)}

              {/* MAIN FEED & SIDEBAR GRID SIMULATION */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '24px', margin: '2rem 0' }}>
                {/* News Feed */}
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Latest Intelligence Feed</span>
                  </div>

                  {/* Feed Row 1 */}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                    <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ width: '100%', height: '100px', background: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80) center/cover', borderRadius: '6px', marginBottom: '8px' }} />
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Orbital Manufacturing Hubs: Commercial Space Expansion</div>
                    </div>
                    <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ width: '100%', height: '100px', background: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80) center/cover', borderRadius: '6px', marginBottom: '8px' }} />
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Tokamak Plasma Milestone: High-Temperature Magnets</div>
                    </div>
                  </div>

                  {/* ZONE 4: FEED ROW 1 */}
                  {renderInteractiveDropZone('dropzone-feed-row-1', 'News Feed Stream (After Article 2)', adPlacements, isLiveReader, activeAdId, setActiveAdId, handleDragStart, handleDragOver, handleDragLeave, handleDrop, dragOverZoneId, handleStartResize, handleToggleActive, handleRemoveAd)}

                  {/* Feed Row 2 */}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', marginTop: '16px', marginBottom: '16px' }}>
                    <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ width: '100%', height: '100px', background: 'url(https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80) center/cover', borderRadius: '6px', marginBottom: '8px' }} />
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>RNA Synthetic Therapeutics: Gene Therapy Evolution</div>
                    </div>
                    <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ width: '100%', height: '100px', background: 'url(https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80) center/cover', borderRadius: '6px', marginBottom: '8px' }} />
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Next-Gen Photovoltaics: Transcontinental Supergrids</div>
                    </div>
                  </div>

                  {/* ZONE 5: FEED ROW 2 */}
                  {renderInteractiveDropZone('dropzone-feed-row-2', 'News Feed Stream (After Article 4)', adPlacements, isLiveReader, activeAdId, setActiveAdId, handleDragStart, handleDragOver, handleDragLeave, handleDrop, dragOverZoneId, handleStartResize, handleToggleActive, handleRemoveAd)}
                </div>

                {/* Sidebar Column */}
                <div>
                  {/* ZONE 6: SIDEBAR TOP */}
                  {renderInteractiveDropZone('dropzone-sidebar-top', 'Right Sidebar (Above Most Read)', adPlacements, isLiveReader, activeAdId, setActiveAdId, handleDragStart, handleDragOver, handleDragLeave, handleDrop, dragOverZoneId, handleStartResize, handleToggleActive, handleRemoveAd)}

                  <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '16px', border: '1px solid var(--border-color)', margin: '14px 0' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-amber, #f59e0b)', marginBottom: '12px' }}>🔥 Most Read Today</div>
                    {[1, 2, 3].map(i => (
                      <div key={`side-most-${i}`} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent-green, #10b981)', fontWeight: 800 }}>0{i}</span>
                        <span>Global Microchip Supply Trends 2026</span>
                      </div>
                    ))}
                  </div>

                  {/* ZONE 7: SIDEBAR BOTTOM */}
                  {renderInteractiveDropZone('dropzone-sidebar-bottom', 'Right Sidebar (Below Most Read)', adPlacements, isLiveReader, activeAdId, setActiveAdId, handleDragStart, handleDragOver, handleDragLeave, handleDrop, dragOverZoneId, handleStartResize, handleToggleActive, handleRemoveAd)}
                </div>
              </div>

              {/* ZONE 8: DEEP DIVES HEADER */}
              {renderInteractiveDropZone('dropzone-deep-dives-top', 'Deep Dives 💎 Investigations Header Banner', adPlacements, isLiveReader, activeAdId, setActiveAdId, handleDragStart, handleDragOver, handleDragLeave, handleDrop, dragOverZoneId, handleStartResize, handleToggleActive, handleRemoveAd)}

              {/* Deep Dives Section Simulation */}
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>
                  <span>💎 DEEP DIVES (Subscribers Exclusive)</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  In-depth investigative briefings and comprehensive long-form reports reserved exclusively for active subscribers.
                </div>
              </div>

              {/* ZONE 9: FOOTER FLOATING */}
              {renderInteractiveDropZone('dropzone-footer-floating', 'Bottom Floating Footer Anchor Bar', adPlacements, isLiveReader, activeAdId, setActiveAdId, handleDragStart, handleDragOver, handleDragLeave, handleDrop, dragOverZoneId, handleStartResize, handleToggleActive, handleRemoveAd)}
            </div>
          </div>

          {/* Success Banner if Saved */}
          {saveSuccessMsg && (
            <div style={{
              margin: '20px 0 10px 0',
              padding: '14px 18px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1.5px solid #10b981',
              borderRadius: '8px',
              color: '#34d399',
              fontSize: '13.5px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle size={18} />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Bottom Floating/Fixed Action Dock for Quick Update & Preview (Matches User Request) */}
          <div style={{
            marginTop: '24px',
            padding: '18px 24px',
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-color-strong)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#8b5cf6', color: '#ffffff', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 900 }}>
                📢
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>
                  Homepage Ad Placements Configured ({adPlacements.filter(a => a.enabled).length} Active)
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                  All 9 placements ready to preview or deploy directly to the live reader homepage
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handlePreviewLiveSite}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                }}
              >
                <Eye size={15} />
                <span>{activeTab === 'live_view' ? '🛠️ Exit Preview' : '👁️ Preview Live Site'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenLiveSiteUrl}
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Open live site in a new browser tab"
              >
                <ExternalLink size={14} />
                <span>↗ Open Live Website</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveLiveHomepage}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 24px',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                }}
              >
                <Save size={16} />
                <span>{isSaving ? 'Updating...' : '💾 Update Live Homepage & Ads'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/**
 * Interactive Drag-and-Drop Drop Zone Component
 */
function renderInteractiveDropZone(
  zoneId,
  zoneTitle,
  adPlacements,
  isLiveReader,
  activeAdId,
  setActiveAdId,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  dragOverZoneId,
  handleStartResize,
  handleToggleActive,
  handleRemoveAd
) {
  const assignedAds = adPlacements.filter(a => a.dropZoneId === zoneId);
  const isDragTarget = dragOverZoneId === zoneId;

  // In live reader view, if no active ads, don't show empty placeholder
  if (isLiveReader && (!assignedAds || assignedAds.filter(a => a.enabled).length === 0)) {
    return null;
  }

  return (
    <div
      onDragOver={(e) => handleDragOver(e, zoneId)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, zoneId)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
        margin: '14px 0',
        padding: isLiveReader ? '0' : '10px',
        borderRadius: '10px',
        border: isLiveReader ? 'none' : (isDragTarget ? '2.5px dashed #8b5cf6' : assignedAds.length > 0 ? '1.5px dashed rgba(16, 185, 129, 0.4)' : '1.5px dashed var(--border-color-strong)'),
        background: isLiveReader ? 'transparent' : (isDragTarget ? 'rgba(139, 92, 246, 0.1)' : assignedAds.length > 0 ? 'rgba(16, 185, 129, 0.02)' : 'var(--bg-surface)'),
        transition: 'all 0.2s ease',
        minHeight: isLiveReader ? 'auto' : '50px'
      }}
    >
      {/* Zone Header Label (Shown in Studio Placement Mode) */}
      {!isLiveReader && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, color: isDragTarget ? 'var(--accent-purple, #8b5cf6)' : 'var(--text-secondary)' }}>
              📍 {zoneTitle}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              ({assignedAds.length} Assigned {assignedAds.length === 1 ? 'Ad' : 'Ads'})
            </span>
          </div>

          <div style={{ fontSize: '10px', color: isDragTarget ? 'var(--accent-purple, #8b5cf6)' : 'var(--text-muted)', fontWeight: 700 }}>
            {isDragTarget ? '⚡ Drop Ad Here to Place in this Zone' : 'Drag any Ad Card here'}
          </div>
        </div>
      )}

      {/* Render Assigned Ads in this Zone */}
      {assignedAds.map((ad) => {
        if (isLiveReader && !ad.enabled) return null;
        const isSelected = activeAdId === ad.id;

        const align = ad.alignment || 'center';
        const isFloated = align === 'left' || align === 'right';
        let cardMargin = '8px 0';
        let cardAlignSelf = 'stretch';
        let cardWidth = ad.customWidth || (isFloated ? '320px' : '100%');

        if (align === 'left') {
          cardMargin = '8px auto 8px 0';
          cardAlignSelf = 'flex-start';
          if (!ad.customWidth || ad.customWidth === '100%') cardWidth = '320px';
        } else if (align === 'right') {
          cardMargin = '8px 0 8px auto';
          cardAlignSelf = 'flex-end';
          if (!ad.customWidth || ad.customWidth === '100%') cardWidth = '320px';
        } else if (align === 'center') {
          cardMargin = '8px auto';
          cardAlignSelf = 'center';
          if (!ad.customWidth || ad.customWidth === '100%') cardWidth = '75%';
        } else if (align === 'full') {
          cardMargin = '8px 0';
          cardAlignSelf = 'stretch';
          cardWidth = '100%';
        }

        const adCardElement = (
          <div
            key={ad.id}
            className="resizable-ad-card"
            draggable={!isLiveReader}
            onDragStart={(e) => handleDragStart(e, ad.id)}
            onClick={() => !isLiveReader && setActiveAdId(ad.id)}
            style={{
              position: 'relative',
              width: cardWidth,
              maxWidth: '100%',
              minHeight: ad.customHeight && ad.customHeight !== 'auto' ? ad.customHeight : 'auto',
              margin: isFloated ? '0' : cardMargin,
              alignSelf: isFloated ? 'auto' : cardAlignSelf,
              display: 'block',
              boxSizing: 'border-box',
              flexShrink: 0,
              border: isLiveReader ? 'none' : (isSelected ? '2px solid #8b5cf6' : '1.5px solid var(--border-color-strong)'),
              borderRadius: isFloated ? '12px' : '8px',
              padding: isLiveReader ? '0' : '8px',
              background: isLiveReader ? 'transparent' : 'var(--bg-surface)',
              boxShadow: isSelected ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none',
              cursor: isLiveReader ? 'default' : 'grab',
              transition: 'all 0.25s ease'
            }}
          >
            {/* Studio Action Bar above Card */}
            {!isLiveReader && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', background: 'var(--bg-card)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--text-main)' }}>
                  <GripVertical size={13} style={{ color: 'var(--text-muted)' }} />
                  <span>{ad.sponsorName}</span>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>• {cardWidth}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={(e) => handleToggleActive(ad.id, e)}
                    style={{
                      background: ad.enabled ? '#10b981' : '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '2px 6px',
                      fontSize: '9px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {ad.enabled ? 'ACTIVE' : 'PAUSED'}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleRemoveAd(ad.id, e)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: '3px',
                      padding: '2px 6px',
                      fontSize: '9px',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Render Ad Content */}
            {renderLiveAdCreative(ad)}

            {/* SE CORNER RESIZE DRAG HANDLE (SOUTH-EAST) */}
            {!isLiveReader && (
              <div
                className="ad-resize-handle-se"
                onMouseDown={(e) => handleStartResize(ad, e)}
                title="Click and drag horizontally/vertically to resize width & height"
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '18px',
                  height: '18px',
                  cursor: 'se-resize',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#8b5cf6',
                  borderRadius: '3px',
                  color: '#ffffff',
                  zIndex: 20
                }}
              >
                <Move size={10} />
              </div>
            )}
          </div>
        );

        if (isFloated) {
          if (zoneId === 'dropzone-in-feed-mid') {
            return (
              <div
                key={ad.id}
                style={{
                  display: 'flex',
                  flexDirection: align === 'right' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: '18px',
                  width: '100%',
                  margin: '8px 0'
                }}
              >
                {adCardElement}

                {/* Editorial Flow Beside Floated Ad (Matching Image 1 Flow) */}
                <div style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '14px 18px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--accent-emerald, #10b981)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    📰 Editorial Flow Beside Floated Ad
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>
                    Breaking Analysis: Global Macro Trends & Sovereign Market Movements
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Readers navigate seamlessly around left/right floated sponsor features while engaging with verified real-time journalism, investigative reporting, and daily macro insights.
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={ad.id}
              style={{
                display: 'flex',
                justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
                width: '100%',
                margin: '8px 0'
              }}
            >
              {adCardElement}
            </div>
          );
        }

        return adCardElement;
      })}

      {/* Empty Drop Target in Studio Mode */}
      {!isLiveReader && assignedAds.length === 0 && (
        <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
          + Drag and Drop any Ad here or select from dropdown
        </div>
      )}
    </div>
  );
}

/**
 * Creative Ad Renderer for Live & Studio views (EXACT MATCH TO IMAGE 1 FOR LEFT/RIGHT FLOAT)
 */
function renderLiveAdCreative(ad) {
  const isFloated = ad.alignment === 'left' || ad.alignment === 'right';

  if (ad.customHtml && ad.customHtml.trim()) {
    return (
      <div 
        style={{ width: '100%', minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)', borderRadius: '6px', padding: '10px' }}
        dangerouslySetInnerHTML={{ __html: ad.customHtml }}
      />
    );
  }

  // 0. SKYSCRAPER FORMAT (DESKTOP LEFT / RIGHT STICKY RAILS)
  if (ad.dropZoneId === 'dropzone-left-rail' || ad.dropZoneId === 'dropzone-right-rail' || ad.format === 'skyscraper') {
    return (
      <div style={{
        width: '100%',
        background: 'var(--bg-surface)',
        border: '1.5px solid var(--border-color)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '9px', fontWeight: 900, color: 'var(--accent-purple, #8b5cf6)', textTransform: 'uppercase' }}>
            {ad.badgeText || 'SPONSORED'}
          </span>
          <a href={ad.targetUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', fontSize: '9px', display: 'flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
            <ExternalLink size={9} />
          </a>
        </div>

        {/* Media */}
        <a href={ad.targetUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ width: '100%', height: '320px', display: 'block', background: '#000', position: 'relative' }}>
          {ad.contentType === 'video' && ad.mediaUrl ? (
            <ContinuousCoverVideo
              src={ad.mediaUrl}
              autoPlay={true}
              muted={true}
              loop={true}
              controls={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={ad.mediaUrl || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"}
              alt={ad.headline || 'Ad'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
        </a>

        {/* Headline & CTA */}
        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
            {ad.headline}
          </div>
          {ad.subtitle && (
            <div style={{ fontSize: '9.5px', color: 'var(--text-secondary)', lineHeight: 1.25 }}>
              {ad.subtitle}
            </div>
          )}
          {ad.ctaText && (
            <a href={ad.targetUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ background: '#8b5cf6', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '4px 6px', borderRadius: '3px', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center', marginTop: '3px' }}>
              {ad.ctaText} ↗
            </a>
          )}
        </div>
      </div>
    );
  }

  // 1. FLOATED EDITORIAL AD CARD FORMAT (EXACT MATCH TO IMAGE 1 FOR LEFT / RIGHT FLOAT)
  if (isFloated) {
    return (
      <div style={{
        background: 'var(--bg-surface)',
        border: '1.5px solid var(--border-color)',
        borderRadius: '12px',
        padding: '14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Ad Disclosure Header Bar (Matching Image 1: [ADVERTISEMENT #1] ... [↗ Visit Link SPONSOR]) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '6px'
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 800,
            color: 'var(--accent-purple, #8b5cf6)',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Megaphone size={12} />
            <span>{ad.badgeText || 'ADVERTISEMENT'}</span>
          </div>

          <a
            href={ad.targetUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '9.5px',
              color: '#38bdf8',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={10} /> Visit Link
            <span style={{ color: 'var(--text-muted)', marginLeft: '3px', textTransform: 'uppercase', fontSize: '8.5px' }}>
              SPONSOR
            </span>
          </a>
        </div>

        {/* Media / Photo Showcase Area with Explore CTA Badge Overlay (Exact Match to Image 1) */}
        {ad.contentType === 'video' && ad.mediaUrl ? (
          <div style={{ width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
            <ContinuousCoverVideo
              src={ad.mediaUrl}
              autoPlay={true}
              muted={true}
              loop={true}
              controls={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '220px',
            borderRadius: '8px',
            overflow: 'hidden',
            background: ad.mediaUrl ? `url(${ad.mediaUrl}) center/cover` : 'var(--bg-surface-hover)',
            border: '1px solid var(--border-color)'
          }}>
            {/* Explore Series / CTA Button Badge in Bottom-Right Corner (Exact Match to Image 1) */}
            <a
              href={ad.targetUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
            >
              <span>{ad.ctaText || 'Explore Series'}</span>
              <span>↗</span>
            </a>
          </div>
        )}

        {/* Headline & Subtitle below Photo */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.35 }}>
            {ad.headline}
          </div>
          {ad.subtitle && (
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.35 }}>
              {ad.subtitle}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Resizing & visibility options for dropzone preview
  const layout = ad.mediaLayout || (ad.format === 'billboard' ? 'full_banner' : 'side_media');
  const fitMode = ad.mediaFit || 'contain';
  const mediaHeight = ad.mediaHeight || (layout === 'full_banner' || layout === 'media_only' ? (ad.customHeight && ad.customHeight !== 'auto' ? ad.customHeight : '200px') : '120px');
  const mediaWidth = ad.mediaWidth || (layout === 'side_media' ? '180px' : '100%');
  const mediaBg = ad.mediaBg || (fitMode === 'contain' ? 'rgba(0, 0, 0, 0.95)' : 'transparent');

  // 1. PURE CREATIVE / MEDIA ONLY FORMAT
  if (layout === 'media_only' && ad.mediaUrl) {
    return (
      <div style={{
        width: '100%',
        height: mediaHeight === 'auto' ? '200px' : mediaHeight,
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        background: mediaBg,
        border: '1px solid var(--border-color)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        {ad.contentType === 'video' ? (
          <ContinuousCoverVideo
            src={ad.mediaUrl}
            autoPlay={true}
            muted={true}
            loop={true}
            controls={false}
            style={{ width: '100%', height: '100%', objectFit: fitMode }}
          />
        ) : (
          <img
            src={ad.mediaUrl}
            alt={ad.headline || 'Ad Banner'}
            style={{ width: '100%', height: '100%', objectFit: fitMode, display: 'block', margin: '0 auto' }}
          />
        )}
        <span style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.85)', color: '#ffffff', fontSize: '8.5px', fontWeight: 900, padding: '2px 6px', borderRadius: '3px' }}>
          {ad.badgeText || 'ADVERTISEMENT'}
        </span>
      </div>
    );
  }

  // 2. FULL-WIDTH BILLBOARD BANNER FORMAT
  if (layout === 'full_banner' && ad.mediaUrl) {
    return (
      <div style={{
        width: '100%',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 10px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ background: '#8b5cf6', color: '#ffffff', fontSize: '8.5px', fontWeight: 900, padding: '1px 5px', borderRadius: '2px', textTransform: 'uppercase' }}>
              {ad.badgeText || 'SPONSORED'}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 800 }}>{ad.sponsorName}</span>
          </div>
          <span style={{ color: '#8b5cf6', fontSize: '10px', fontWeight: 800 }}>{ad.ctaText || 'Learn More'} ↗</span>
        </div>

        <div style={{
          width: '100%',
          height: mediaHeight === 'auto' ? '200px' : mediaHeight,
          background: mediaBg,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {ad.contentType === 'video' ? (
            <ContinuousCoverVideo
              src={ad.mediaUrl}
              autoPlay={true}
              muted={true}
              loop={true}
              controls={false}
              style={{ width: '100%', height: '100%', objectFit: fitMode }}
            />
          ) : (
            <img
              src={ad.mediaUrl}
              alt={ad.headline || 'Ad'}
              style={{ width: '100%', height: '100%', objectFit: fitMode, display: 'block', margin: '0 auto' }}
            />
          )}
        </div>

        {(ad.headline || ad.subtitle) && (
          <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: 'var(--bg-card)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {ad.headline && <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ad.headline}</div>}
              {ad.subtitle && <div style={{ fontSize: '10px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ad.subtitle}</div>}
            </div>
            <span style={{ background: '#8b5cf6', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, flexShrink: 0 }}>
              {ad.ctaText || 'Explore'} ↗
            </span>
          </div>
        )}
      </div>
    );
  }

  // 3. STACKED FORMAT
  if (layout === 'stacked' && ad.mediaUrl) {
    return (
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{ width: '100%', height: mediaHeight, background: mediaBg, position: 'relative', overflow: 'hidden' }}>
          {ad.contentType === 'video' ? (
            <ContinuousCoverVideo
              src={ad.mediaUrl}
              autoPlay={true}
              muted={true}
              loop={true}
              controls={false}
              style={{ width: '100%', height: '100%', objectFit: fitMode }}
            />
          ) : (
            <img
              src={ad.mediaUrl}
              alt={ad.headline || 'Ad'}
              style={{ width: '100%', height: '100%', objectFit: fitMode, display: 'block', margin: '0 auto' }}
            />
          )}
        </div>
        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)' }}>{ad.headline}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{ad.subtitle}</div>
          </div>
          <span style={{ background: '#8b5cf6', color: '#fff', padding: '5px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, flexShrink: 0 }}>
            {ad.ctaText || 'Learn More'} ↗
          </span>
        </div>
      </div>
    );
  }

  // 4. SIDE-BY-SIDE SPLIT CARD FORMAT (Default for standard banners & feeds)
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '14px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        {ad.mediaUrl && (
          <div style={{
            width: mediaWidth,
            maxWidth: '45%',
            height: mediaHeight,
            borderRadius: '6px',
            overflow: 'hidden',
            flexShrink: 0,
            background: mediaBg,
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {ad.contentType === 'video' ? (
              <ContinuousCoverVideo
                src={ad.mediaUrl}
                autoPlay={true}
                muted={true}
                loop={true}
                playsInline={true}
                controls={false}
                style={{ width: '100%', height: '100%', objectFit: fitMode }}
              />
            ) : (
              <img
                src={ad.mediaUrl}
                alt={ad.headline || 'Ad Media'}
                style={{ width: '100%', height: '100%', objectFit: fitMode, display: 'block' }}
              />
            )}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ background: 'var(--brand-gold, #f59e0b)', color: '#000000', fontSize: '8.5px', fontWeight: 900, padding: '1px 5px', borderRadius: '2px', letterSpacing: '0.5px' }}>
              {ad.badgeText || 'SPONSORED'}
            </span>
            <span style={{ color: 'var(--accent-green, #10b981)', fontSize: '10.5px', fontWeight: 800 }}>{ad.sponsorName}</span>
          </div>
          <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {ad.headline}
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {ad.subtitle}
          </div>
        </div>
      </div>

      <a
        href={ad.targetUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: 'var(--brand-red, #dc2626)',
          color: '#ffffff',
          padding: '6px 14px',
          borderRadius: '4px',
          fontSize: '10.5px',
          fontWeight: 800,
          textDecoration: 'none',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
        }}
      >
        {ad.ctaText || 'Explore'} ↗
      </a>
    </div>
  );
}

