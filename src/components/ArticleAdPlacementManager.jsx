"use client";

import React, { useState, useMemo, useRef } from 'react';
import { 
  GripVertical, 
  Move, 
  Maximize2, 
  AlignCenter, 
  AlignLeft, 
  AlignRight, 
  Smartphone,
  Plus,
  Trash2,
  Columns,
  FileText,
  LayoutTemplate,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Sparkles,
  ExternalLink,
  Upload,
  Zap,
  ChevronDown
} from 'lucide-react';

export const SAMPLE_AD_TEMPLATES = [
  {
    id: 'sample-taichi-1',
    name: '🧘 30-Day Tai Chi Plan (Leaderboard Banner)',
    label: 'Sponsored Health & Wellness',
    contentType: 'image',
    content: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    headline: '30-Day Tai Chi Masterclass for Beginners',
    description: 'Strengthen core balance, mental calm, and joint mobility with 15-minute daily guided routines.',
    targetUrl: 'https://taichi-academy.org/daily-brief-offer',
    ctaText: 'Start Free 7-Day Trial ↗',
    alignment: 'full_width',
    columnPosition: 'full',
    widthMode: 'leaderboard'
  },
  {
    id: 'sample-cloud-2',
    name: '🚀 Quantum Cloud AI Clusters (Float Left)',
    label: 'Enterprise Partner',
    contentType: 'placeholder',
    content: '',
    headline: 'Scale Generative AI with Quantum Multi-Cloud GPUs',
    description: 'Deploy distributed H100 GPU clusters with 99.999% SLA uptime and zero-trust data protection.',
    targetUrl: 'https://cloud.quantum-ai.net/compute',
    ctaText: 'Claim $500 Free Cloud Credits ↗',
    alignment: 'left',
    columnPosition: 'left_col',
    widthMode: 'rectangle'
  },
  {
    id: 'sample-ev-3',
    name: '⚡ Apex Electric Gran Coupe EV (Center Banner)',
    label: 'Automotive Showcase',
    contentType: 'image',
    content: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    headline: 'Experience the All-New Apex Electric Gran Coupe',
    description: '0-60 mph in 2.8s, 480-mile extended battery range, and Level 3 autonomous highway cruise.',
    targetUrl: 'https://apexmotors.com/models/apex-gt',
    ctaText: 'Book VIP Test Drive ↗',
    alignment: 'center',
    columnPosition: 'full',
    widthMode: 'responsive_banner'
  },
  {
    id: 'sample-finance-4',
    name: '📊 Global Wealth & Sovereign Markets 2026 (Float Right)',
    label: 'Financial Insights',
    contentType: 'image',
    content: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    headline: 'Executive Wealth & Sovereign Market Forecast 2026',
    description: 'Download the comprehensive 60-page research report on central bank rate pivots and currency markets.',
    targetUrl: 'https://bloomfield-capital.com/insights/report-2026',
    ctaText: 'Download Free PDF Report ↗',
    alignment: 'right',
    columnPosition: 'right_col',
    widthMode: 'rectangle'
  },
  {
    id: 'sample-travel-5',
    name: '✈️ Horizon Private Jet Expeditions (Full Width)',
    label: 'Curated Partner',
    contentType: 'placeholder',
    content: '',
    headline: 'Bespoke Private Aviation & Remote Island Escapes',
    description: 'Experience seamless door-to-destination private charters with dedicated 24/7 concierge service.',
    targetUrl: 'https://horizon-aviation.luxury/expeditions',
    ctaText: 'Explore Itineraries ↗',
    alignment: 'full_width',
    columnPosition: 'full',
    widthMode: 'leaderboard'
  }
];

export default function ArticleAdPlacementManager({
  formData,
  setFormData,
  isSuperAdmin = true
}) {
  const [activeAdId, setActiveAdId] = useState(null);
  const [draggedAdId, setDraggedAdId] = useState(null);
  const [dragOverZoneId, setDragOverZoneId] = useState(null);
  const [viewMode, setViewMode] = useState('canvas'); // 'canvas' | 'live_article' | 'mobile'
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const fileInputRef = useRef(null);

  if (!isSuperAdmin) {
    return (
      <div style={{
        padding: '24px',
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: '12px',
        color: '#f87171',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>
          🔒 Restricted Access: Only Super Admin can manage article placeholder advertisements.
        </p>
      </div>
    );
  }

  // Multi-ad placements array normalization
  const adPlacements = useMemo(() => {
    if (Array.isArray(formData.adPlacements) && formData.adPlacements.length > 0) {
      return formData.adPlacements;
    }
    if (formData.placeholderAdEnabled) {
      return [{
        id: 'ad-place-default-1',
        enabled: true,
        placementType: formData.placeholderAdPositionType || 'after_paragraph',
        placementValue: formData.placeholderAdPositionValue || '2',
        alignment: formData.placeholderAdAlignment || 'center',
        columnPosition: formData.placeholderAdAlignment === 'left' ? 'left_col' : (formData.placeholderAdAlignment === 'right' ? 'right_col' : 'full'),
        sortOrder: 1,
        widthMode: 'responsive_banner',
        label: formData.placeholderAdLabel || 'Advertisement',
        contentType: formData.placeholderAdContentType || 'placeholder',
        content: formData.placeholderAdContent || '',
        targetUrl: formData.placeholderAdTargetUrl || '',
        headline: formData.placeholderAdHeadline || 'Premium Partner Showcase',
        description: formData.placeholderAdDescription || 'Discover exclusive offers and services from our verified partners.',
        ctaText: formData.placeholderAdCtaText || 'Learn More ↗',
        dropZoneId: formData.placeholderAdDropZoneId || 'dropzone-p-2'
      }];
    }
    return [];
  }, [formData.adPlacements, formData.placeholderAdEnabled, formData.placeholderAdPositionType, formData.placeholderAdPositionValue, formData.placeholderAdAlignment, formData.placeholderAdLabel, formData.placeholderAdContentType, formData.placeholderAdContent, formData.placeholderAdTargetUrl, formData.placeholderAdHeadline, formData.placeholderAdDescription, formData.placeholderAdCtaText, formData.placeholderAdDropZoneId]);

  const hasAds = adPlacements.length > 0;
  const currentAd = adPlacements.find(a => a.id === activeAdId) || adPlacements[0] || null;

  // Helper to update ad placements in formData
  const updateAdPlacements = (newPlacements) => {
    const isAnyActive = newPlacements.some(a => a.enabled);
    const primaryAd = newPlacements[0] || null;

    setFormData(prev => ({
      ...prev,
      adPlacements: newPlacements,
      placeholderAdEnabled: isAnyActive,
      placeholderAdDropZoneId: primaryAd ? primaryAd.dropZoneId : 'dropzone-p-2',
      placeholderAdPositionType: primaryAd ? primaryAd.placementType : 'after_paragraph',
      placeholderAdPositionValue: primaryAd ? primaryAd.placementValue : '2',
      placeholderAdAlignment: primaryAd ? primaryAd.alignment : 'center',
      placeholderAdLabel: primaryAd ? primaryAd.label : 'Advertisement',
      placeholderAdContentType: primaryAd ? primaryAd.contentType : 'placeholder',
      placeholderAdContent: primaryAd ? primaryAd.content : '',
      placeholderAdTargetUrl: primaryAd ? (primaryAd.targetUrl || primaryAd.linkUrl || '') : '',
      placeholderAdHeadline: primaryAd ? primaryAd.headline : '',
      placeholderAdDescription: primaryAd ? primaryAd.description : '',
      placeholderAdCtaText: primaryAd ? primaryAd.ctaText : ''
    }));
  };

  // Add a new Ad Placement (Blank)
  const handleAddNewAd = () => {
    const newIndex = adPlacements.length + 1;
    const nextTargetIdx = Math.min(newIndex * 2, 8);
    const newAd = {
      id: `ad-place-${Date.now()}-${newIndex}`,
      enabled: true,
      placementType: 'after_paragraph',
      placementValue: String(nextTargetIdx),
      alignment: newIndex % 2 === 1 ? 'center' : (newIndex % 4 === 0 ? 'right' : 'left'),
      columnPosition: newIndex % 2 === 1 ? 'full' : (newIndex % 4 === 0 ? 'right_col' : 'left_col'),
      sortOrder: newIndex,
      widthMode: 'responsive_banner',
      label: `Advertisement #${newIndex}`,
      contentType: 'placeholder',
      content: '',
      targetUrl: 'https://example.com/sponsor',
      headline: `Featured Sponsor Announcement #${newIndex}`,
      description: 'Explore cutting-edge solutions and exclusive promotions tailored for readers.',
      ctaText: 'Visit Partner ↗',
      dropZoneId: `dropzone-p-${nextTargetIdx}`
    };

    const updated = [...adPlacements, newAd];
    updateAdPlacements(updated);
    setActiveAdId(newAd.id);
  };

  // Insert a Preset Dummy Ad with Banner
  const handleInsertPresetAd = (template) => {
    setShowPresetDropdown(false);
    const newIndex = adPlacements.length + 1;
    const nextTargetIdx = Math.min(newIndex * 2, 8);
    const newAd = {
      id: `ad-place-preset-${Date.now()}-${newIndex}`,
      enabled: true,
      placementType: 'after_paragraph',
      placementValue: String(nextTargetIdx),
      alignment: template.alignment || 'center',
      columnPosition: template.columnPosition || 'full',
      sortOrder: newIndex,
      widthMode: template.widthMode || 'responsive_banner',
      label: template.label || 'Advertisement',
      contentType: template.contentType || 'image',
      content: template.content || '',
      targetUrl: template.targetUrl || 'https://example.com/sponsor',
      linkUrl: template.targetUrl || 'https://example.com/sponsor',
      headline: template.headline || 'Partner Showcase',
      description: template.description || 'Special offer for readers.',
      ctaText: template.ctaText || 'Learn More ↗',
      dropZoneId: `dropzone-p-${nextTargetIdx}`
    };

    const updated = [...adPlacements, newAd];
    updateAdPlacements(updated);
    setActiveAdId(newAd.id);
  };

  // Delete an Ad Placement
  const handleDeleteAd = (idToDelete) => {
    const updated = adPlacements.filter(a => a.id !== idToDelete);
    updateAdPlacements(updated);
    if (activeAdId === idToDelete) {
      setActiveAdId(updated[0]?.id || null);
    }
  };

  // Update a single field on a specific ad
  const handleUpdateAdField = (adId, field, value) => {
    const updated = adPlacements.map(ad => {
      if (ad.id === adId) {
        const updatedAd = { ...ad, [field]: value };
        if (field === 'alignment') {
          updatedAd.columnPosition = value === 'left' ? 'left_col' : (value === 'right' ? 'right_col' : 'full');
        }
        return updatedAd;
      }
      return ad;
    });
    updateAdPlacements(updated);
  };

  // Handle Image Upload for Active Ad
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentAd) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result;
      if (base64Url && typeof base64Url === 'string') {
        handleUpdateAdField(currentAd.id, 'content', base64Url);
        handleUpdateAdField(currentAd.id, 'contentType', 'image');
      }
    };
    reader.readAsDataURL(file);
  };

  // Parse actual article HTML into structured preview segments
  const segments = useMemo(() => {
    const rawContent = formData.content || '';
    if (!rawContent.trim()) {
      return [
        { id: 'intro', type: 'intro', label: 'PARAGRAPH 1 (LEAD INTRO)', text: formData.summary || 'Global markets and industrial investments continue to accelerate across major economic sectors...', html: null },
        { id: 'p-1', type: 'paragraph', label: 'PARAGRAPH 2', text: 'Financial regulators and technology leaders met this week to finalize comprehensive digital governance frameworks...', html: null },
        { id: 'p-2', type: 'paragraph', label: 'PARAGRAPH 3', text: 'There are costs and benefits to car use. The costs to the individual include acquiring the vehicle, repairs and maintenance, fuel, driving time, parking fees, taxes, and insurance...', html: null },
        { id: 'p-3', type: 'paragraph', label: 'PARAGRAPH 4', text: 'Personal benefits include on-demand transportation, mobility, independence, and convenience across urban centers...', html: null },
        { id: 'p-4', type: 'paragraph', label: 'PARAGRAPH 5', text: 'Societal benefits include economic benefits, such as job and wealth creation from the automotive industry, and societal wellbeing from leisure and travel opportunities...', html: null },
        { id: 'p-5', type: 'paragraph', label: 'PARAGRAPH 6', text: 'Widespread car use results in road congestion and promotes urban sprawl, leading to higher infrastructure costs, habitat destruction...', html: null },
        { id: 'p-6', type: 'paragraph', label: 'PARAGRAPH 7', text: 'There are costs and benefits to car use. The costs to the individual include acquiring the vehicle, repairs and maintenance, fuel, driving time, parking fees, taxes, and insurance...', html: null },
        { id: 'p-7', type: 'paragraph', label: 'PARAGRAPH 8', text: 'Further updates will be published as executive committees conclude the quarterly bilateral summits...', html: null }
      ];
    }

    // Extract text and media blocks from real article HTML
    const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (tempDiv) {
      tempDiv.innerHTML = rawContent;
      const blockElements = Array.from(tempDiv.querySelectorAll('p, h1, h2, h3, blockquote, figure, .video-wrapper, .youtube-video-wrapper, .vimeo-video-wrapper, .direct-video-wrapper'));
      
      if (blockElements.length > 0) {
        return blockElements.slice(0, 16).map((el, idx) => {
          const text = el.textContent.trim() || '';
          const isHeading = ['H1', 'H2', 'H3'].includes(el.tagName);
          const isMedia = el.tagName === 'FIGURE' || el.classList?.contains('video-wrapper') || el.classList?.contains('youtube-video-wrapper') || el.classList?.contains('vimeo-video-wrapper') || el.classList?.contains('direct-video-wrapper') || el.querySelector('img, video, iframe');
          
          let label = `PARAGRAPH ${idx + 1}`;
          let type = 'paragraph';
          if (idx === 0 && !isMedia && !isHeading) {
            label = 'PARAGRAPH 1 (LEAD INTRO)';
            type = 'intro';
          } else if (isHeading) {
            label = `HEADING: "${text.slice(0, 24)}..."`;
            type = 'heading';
          } else if (isMedia) {
            label = `MEDIA / FIGURE EMBED (POSITION ${idx + 1})`;
            type = 'media';
          }

          return {
            id: idx === 0 ? 'intro' : `p-${idx}`,
            index: idx,
            type,
            label,
            text: text.length > 220 ? text.slice(0, 220) + '...' : text,
            html: isMedia ? el.outerHTML : null
          };
        });
      }
    }

    return [
      { id: 'intro', index: 0, type: 'intro', label: 'PARAGRAPH 1 (LEAD INTRO)', text: 'Article introduction content...', html: null },
      { id: 'p-1', index: 1, type: 'paragraph', label: 'PARAGRAPH 2', text: 'Detailed article narrative continues here...', html: null },
      { id: 'p-2', index: 2, type: 'paragraph', label: 'PARAGRAPH 3', text: 'Supporting evidence, analytical insights, and data points...', html: null },
      { id: 'p-3', index: 3, type: 'paragraph', label: 'PARAGRAPH 4', text: 'Extended discussion on regional and international implications...', html: null }
    ];
  }, [formData.content, formData.summary]);

  // List of valid drop zones derived from content segments
  const dropZones = useMemo(() => {
    const zones = [
      { id: 'dropzone-intro', label: 'Position 1: After Intro Block', type: 'after_intro', value: 'intro', order: 1 }
    ];

    segments.forEach((seg, idx) => {
      if (idx > 0) {
        zones.push({
          id: `dropzone-p-${idx}`,
          label: `Position ${idx + 1}: After ${seg.label}`,
          type: 'after_paragraph',
          value: String(idx),
          order: idx + 1
        });
      }
    });

    zones.push({
      id: 'dropzone-related',
      label: `Position ${zones.length + 1}: Before Related Articles & Comments`,
      type: 'before_related',
      value: 'related',
      order: zones.length + 1
    });

    return zones;
  }, [segments]);

  // Handle Drag Events
  const handleDragStart = (e, adId) => {
    e.dataTransfer.setData('text/plain', adId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedAdId(adId);
  };

  const handleDragEnd = () => {
    setDraggedAdId(null);
    setDragOverZoneId(null);
  };

  const handleDragOver = (e, zoneId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverZoneId !== zoneId) {
      setDragOverZoneId(zoneId);
    }
  };

  const handleDragLeave = (e, zoneId) => {
    if (dragOverZoneId === zoneId) {
      setDragOverZoneId(null);
    }
  };

  const handleDrop = (e, zone) => {
    e.preventDefault();
    const droppedAdId = draggedAdId || e.dataTransfer.getData('text/plain');
    setDraggedAdId(null);
    setDragOverZoneId(null);

    if (!droppedAdId) return;

    const updated = adPlacements.map(ad => {
      if (ad.id === droppedAdId) {
        return {
          ...ad,
          dropZoneId: zone.id,
          placementType: zone.type,
          placementValue: zone.value,
          sortOrder: zone.order
        };
      }
      return ad;
    });

    updateAdPlacements(updated);
  };

  return (
    <div style={{
      background: '#04070d',
      border: '1.5px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '12px',
      padding: '22px',
      marginBottom: '1rem',
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Hidden File Input for Image Banner Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageFileUpload}
      />

      {/* Top Header: Multi-Ad Management & Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
            color: '#fff',
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)'
          }}>
            <Columns size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#ffffff' }}>
                Newspaper Multi-Ad Placement Studio
              </h4>
              <span style={{
                background: 'rgba(234, 179, 8, 0.15)',
                color: '#facc15',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.5px'
              }}>
                👑 SUPER ADMIN ONLY
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Upload images, add hyperlinks & CTA banners, and drag placements across Left, Center, Right, and Full-Width zones.
            </p>
          </div>
        </div>

        {/* Action Controls & Preset Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', position: 'relative' }}>
          {/* View Mode Switcher */}
          <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '2px', borderRadius: '6px' }}>
            <button
              type="button"
              onClick={() => setViewMode('canvas')}
              style={{
                padding: '4px 10px',
                background: viewMode === 'canvas' ? '#7c3aed' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <LayoutTemplate size={12} /> Newspaper Studio
            </button>
            <button
              type="button"
              onClick={() => setViewMode('live_article')}
              style={{
                padding: '4px 10px',
                background: viewMode === 'live_article' ? '#7c3aed' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FileText size={12} /> Full Article View with Ads
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              style={{
                padding: '4px 10px',
                background: viewMode === 'mobile' ? '#7c3aed' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Smartphone size={12} /> Mobile Flow
            </button>
          </div>

          {/* Quick Dummy Ad Preset Button & Menu */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowPresetDropdown(!showPresetDropdown)}
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.35)'
              }}
            >
              <Zap size={15} color="#38bdf8" />
              <span>⚡ Insert Preset Dummy Ad</span>
              <ChevronDown size={14} />
            </button>

            {showPresetDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: '#0f172a',
                border: '1.5px solid #38bdf8',
                borderRadius: '10px',
                padding: '8px',
                width: '320px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.8)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', padding: '4px 8px', textTransform: 'uppercase' }}>
                  Choose Sample Banner Ad Template:
                </div>
                {SAMPLE_AD_TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleInsertPresetAd(template)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.18)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                  >
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>{template.name}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {template.headline} • <i>{template.ctaText}</i>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Blank Ad Button */}
          <button
            type="button"
            onClick={handleAddNewAd}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.35)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={16} />
            <span>+ Add Blank Ad ({adPlacements.length})</span>
          </button>
        </div>
      </div>

      {/* Ad Selection Tabs / List */}
      {hasAds ? (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginRight: '4px' }}>
              Active Ads:
            </span>
            {adPlacements.map((ad, idx) => {
              const isSelected = (currentAd?.id === ad.id);
              return (
                <button
                  key={ad.id}
                  type="button"
                  onClick={() => setActiveAdId(ad.id)}
                  style={{
                    background: isSelected ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1.5px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    fontSize: '12px',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: ad.enabled ? '#34d399' : '#64748b'
                  }} />
                  <span>Ad #{idx + 1}: {ad.alignment?.toUpperCase()} ({ad.dropZoneId?.replace('dropzone-', '') || 'P-2'})</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE AD CONFIGURATION STUDIO PANEL (Images, Hyperlinks, Banners & Redirects) */}
          {currentAd && (
            <div style={{
              background: '#0b1120',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              borderRadius: '10px',
              padding: '18px',
              marginTop: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
            }}>
              {/* Row 1: Ad Type & Asset Selector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>
                    Ad Content Format:
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      { key: 'placeholder', label: '📢 Interactive Banner Box', icon: Sparkles },
                      { key: 'image', label: '🖼️ Custom Image Banner', icon: ImageIcon },
                      { key: 'html', label: '💻 Custom HTML Embed', icon: Code }
                    ].map(typeItem => {
                      const Icon = typeItem.icon;
                      const isTypeActive = (currentAd.contentType || 'placeholder') === typeItem.key;
                      return (
                        <button
                          key={typeItem.key}
                          type="button"
                          onClick={() => handleUpdateAdField(currentAd.id, 'contentType', typeItem.key)}
                          style={{
                            padding: '5px 10px',
                            background: isTypeActive ? '#7c3aed' : 'rgba(255, 255, 255, 0.05)',
                            border: isTypeActive ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            color: isTypeActive ? '#ffffff' : '#94a3b8',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Icon size={13} />
                          <span>{typeItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status & Delete */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    background: currentAd.enabled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                    border: currentAd.enabled ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '6px 12px',
                    borderRadius: '6px'
                  }}>
                    <input
                      type="checkbox"
                      checked={currentAd.enabled}
                      onChange={(e) => handleUpdateAdField(currentAd.id, 'enabled', e.target.checked)}
                      style={{ accentColor: '#10b981', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: currentAd.enabled ? '#34d399' : '#94a3b8' }}>
                      {currentAd.enabled ? 'Active on Article' : 'Disabled'}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeleteAd(currentAd.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Remove this ad placement"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Alignment, Breakpoint Zone, and Label */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                {/* Placement Alignment */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Alignment (Newspaper Flow)
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      { key: 'left', label: 'Left (Float)', icon: AlignLeft },
                      { key: 'center', label: 'Center', icon: AlignCenter },
                      { key: 'right', label: 'Right (Float)', icon: AlignRight },
                      { key: 'full_width', label: 'Full Width', icon: Maximize2 }
                    ].map(item => {
                      const Icon = item.icon;
                      const isActive = currentAd.alignment === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => handleUpdateAdField(currentAd.id, 'alignment', item.key)}
                          style={{
                            flex: 1,
                            padding: '6px 4px',
                            background: isActive ? '#7c3aed' : 'rgba(255, 255, 255, 0.05)',
                            border: isActive ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            color: isActive ? '#ffffff' : '#cbd5e1',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px'
                          }}
                        >
                          <Icon size={13} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Zone Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Assigned Breakpoint Zone
                  </label>
                  <select
                    value={currentAd.dropZoneId || 'dropzone-p-2'}
                    onChange={(e) => {
                      const selected = dropZones.find(z => z.id === e.target.value);
                      if (selected) {
                        const updated = adPlacements.map(a => a.id === currentAd.id ? {
                          ...a,
                          dropZoneId: selected.id,
                          placementType: selected.type,
                          placementValue: selected.value,
                          sortOrder: selected.order
                        } : a);
                        updateAdPlacements(updated);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: '#1e293b',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      borderRadius: '6px',
                      color: '#c084fc',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {dropZones.map(zone => (
                      <option key={zone.id} value={zone.id}>
                        📍 {zone.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ad Label */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Disclosure Tag Label
                  </label>
                  <input
                    type="text"
                    value={currentAd.label || 'Advertisement'}
                    onChange={(e) => handleUpdateAdField(currentAd.id, 'label', e.target.value)}
                    placeholder="e.g. Advertisement, Sponsored Partner"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: '#1e293b',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Row 3: Hyperlink Redirect Destination URL */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                padding: '12px 14px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  <LinkIcon size={13} />
                  <span>Destination Hyperlink (Redirect URL when clicked):</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    value={currentAd.targetUrl || currentAd.linkUrl || ''}
                    onChange={(e) => {
                      handleUpdateAdField(currentAd.id, 'targetUrl', e.target.value);
                      handleUpdateAdField(currentAd.id, 'linkUrl', e.target.value);
                    }}
                    placeholder="https://example.com/sponsor-offer (Clicks on banner will redirect here in new tab)"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: '#0f172a',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      borderRadius: '6px',
                      color: '#38bdf8',
                      fontSize: '12px',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                  {(currentAd.targetUrl || currentAd.linkUrl) && (
                    <a
                      href={currentAd.targetUrl || currentAd.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(56, 189, 248, 0.2)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        borderRadius: '6px',
                        color: '#38bdf8',
                        fontSize: '11px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ExternalLink size={13} />
                      <span>Test URL ↗</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Row 4: Custom Image Banner Upload & URL Options */}
              {currentAd.contentType === 'image' && (
                <div style={{
                  background: 'rgba(168, 85, 247, 0.08)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '8px',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>
                      <ImageIcon size={14} />
                      <span>Banner Image Asset (Upload or Enter URL):</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        background: '#7c3aed',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Upload size={13} />
                      <span>Upload Banner Image from Device</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <input
                      type="url"
                      value={currentAd.content || ''}
                      onChange={(e) => handleUpdateAdField(currentAd.id, 'content', e.target.value)}
                      placeholder="Paste Image URL: https://images.unsplash.com/... or upload banner graphic"
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {currentAd.content && (
                    <div style={{ borderRadius: '6px', overflow: 'hidden', maxHeight: '180px', border: '1px solid rgba(255,255,255,0.15)', position: 'relative' }}>
                      <img
                        src={currentAd.content}
                        alt={currentAd.label || 'Ad Banner'}
                        style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                      />
                      <span style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                        Image Banner Preview
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Row 5: Interactive Banner Box Fields (Headline, Subtitle, CTA) */}
              {currentAd.contentType === 'placeholder' && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px'
                }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Banner Headline Text
                    </label>
                    <input
                      type="text"
                      value={currentAd.headline || ''}
                      onChange={(e) => handleUpdateAdField(currentAd.id, 'headline', e.target.value)}
                      placeholder="e.g. 30-Day Tai Chi Plan for Beginners"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Call to Action (CTA Button)
                    </label>
                    <input
                      type="text"
                      value={currentAd.ctaText || ''}
                      onChange={(e) => handleUpdateAdField(currentAd.id, 'ctaText', e.target.value)}
                      placeholder="e.g. Learn More ↗, Claim Offer, Visit Sponsor"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Description / Subtitle
                    </label>
                    <input
                      type="text"
                      value={currentAd.description || ''}
                      onChange={(e) => handleUpdateAdField(currentAd.id, 'description', e.target.value)}
                      placeholder="e.g. Guided masterclasses with world-class instructors. Limited seats available."
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Row 6: Custom HTML Embed Code */}
              {currentAd.contentType === 'html' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Custom HTML / Iframe / Script Embed Code:
                  </label>
                  <textarea
                    rows={4}
                    value={currentAd.content || ''}
                    onChange={(e) => handleUpdateAdField(currentAd.id, 'content', e.target.value)}
                    placeholder="<iframe src='...' width='100%' height='90'></iframe> or custom advertiser HTML"
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0f172a',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#38bdf8',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '24px 16px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#94a3b8' }}>
            No placeholder advertisements have been placed on this article yet.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleAddNewAd}
              style={{
                background: '#7c3aed',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              + Create Blank Ad
            </button>
            <button
              type="button"
              onClick={() => handleInsertPresetAd(SAMPLE_AD_TEMPLATES[0])}
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={15} />
              <span>⚡ Insert Sample Tai Chi Banner Ad</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: INTERACTIVE NEWSPAPER CANVAS (MATCHING IMAGE 1) */}
      {viewMode !== 'live_article' ? (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Move size={15} />
                Interactive Placement Canvas (Matches Image 1):
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                (Drag the purple ad blocks into the dashed target zones)
              </span>
            </div>
          </div>

          <div style={{
            background: '#04070d',
            border: '1.5px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: viewMode === 'mobile' ? '16px 12px' : '26px 32px',
            maxWidth: viewMode === 'mobile' ? '460px' : '100%',
            margin: '0 auto',
            transition: 'max-width 0.25s ease'
          }}>
            {/* Render Dropzone 0 (Intro) */}
            {renderDropZoneSlot('dropzone-intro', dropZones[0])}

            {/* Render Content Stream with Interleaved Ads & Dropzones (Matching Image 1 Structure) */}
            {segments.map((seg, segIdx) => {
              const correspondingZone = dropZones[segIdx + 1];
              const zoneId = correspondingZone ? correspondingZone.id : `dropzone-p-${segIdx}`;
              const assignedAds = adPlacements.filter(a => a.enabled && a.dropZoneId === zoneId);

              const leftAd = assignedAds.find(a => a.alignment === 'left');
              const rightAd = assignedAds.find(a => a.alignment === 'right');
              const centerOrFullAds = assignedAds.filter(a => a.alignment === 'center' || a.alignment === 'full_width');

              return (
                <React.Fragment key={seg.id}>
                  {/* Paragraph or Media Card Matching Image 1 */}
                  <div style={{
                    background: '#0a0e17',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    margin: '10px 0'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#f8fafc',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '6px'
                    }}>
                      <span style={{ width: '8px', height: '12px', background: '#ffffff', borderRadius: '1px', display: 'inline-block' }} />
                      <span>{seg.label}</span>
                    </div>

                    {seg.html ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: seg.html }}
                        style={{ margin: '8px 0', borderRadius: '6px', overflow: 'hidden' }}
                      />
                    ) : (
                      <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
                        {seg.text}
                      </p>
                    )}
                  </div>

                  {/* Side-by-Side Multi-Column Newspaper Layout (Matching Image 1 EXACTLY when Left/Right Ad is present) */}
                  {(leftAd || rightAd) ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: viewMode === 'mobile' ? '1fr' : '1fr 1fr',
                      gap: '16px',
                      margin: '12px 0',
                      alignItems: 'start'
                    }}>
                      {/* Left Column */}
                      {leftAd ? (
                        renderDraggableAdCard(leftAd)
                      ) : (
                        renderDropZoneSlot(zoneId, correspondingZone)
                      )}

                      {/* Right Column */}
                      {rightAd ? (
                        renderDraggableAdCard(rightAd)
                      ) : (
                        <div>
                          {segments[segIdx + 1] && (
                            <div style={{
                              background: '#0a0e17',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '8px',
                              padding: '14px 18px',
                              marginBottom: '10px'
                            }}>
                              <div style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                color: '#f8fafc',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginBottom: '6px'
                              }}>
                                <span style={{ width: '8px', height: '12px', background: '#ffffff', borderRadius: '1px', display: 'inline-block' }} />
                                <span>{segments[segIdx + 1].label}</span>
                              </div>
                              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                                {segments[segIdx + 1].text}
                              </p>
                            </div>
                          )}
                          {renderDropZoneSlot(zoneId, correspondingZone)}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Center / Full-Width Ads at this breakpoint */}
                  {centerOrFullAds.map(ad => renderDraggableAdCard(ad))}

                  {/* Droppable Insertion Target Line if no Left/Right ad rendered it */}
                  {!leftAd && !rightAd && correspondingZone && (
                    renderDropZoneSlot(correspondingZone.id, correspondingZone)
                  )}
                </React.Fragment>
              );
            })}

            {/* Footer Dropzone: Before Related Articles */}
            {(() => {
              const relatedZone = dropZones.find(z => z.type === 'before_related');
              if (!relatedZone) return null;
              const relatedAds = adPlacements.filter(a => a.enabled && a.dropZoneId === relatedZone.id);
              return (
                <React.Fragment>
                  {relatedAds.map(ad => renderDraggableAdCard(ad))}
                  {renderDropZoneSlot(relatedZone.id, relatedZone)}
                </React.Fragment>
              );
            })()}

            {/* Related Articles Footer Preview Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '14px',
              marginTop: '16px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '12px',
              fontWeight: 600
            }}>
              [End of Article Content • Related Briefings & Discussion Section]
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: LIVE FULL ARTICLE WITH EMBEDDED ADS (EXACT READER RENDERING) */
        <div style={{
          background: '#090d16',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '32px 40px',
          color: '#f8fafc',
          maxHeight: '700px',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '8px',
            padding: '8px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#c084fc' }}>
              👁️ Super Admin Live Article Preview with Active Ad Placements ({adPlacements.filter(a => a.enabled).length} Ads)
            </span>
            <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
              All ads are rendered in their exact saved positions with clickable destination links
            </span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', marginBottom: '16px', lineHeight: 1.3 }}>
            {formData.title || 'Untitled Article'}
          </h1>

          {formData.summary && (
            <p style={{ fontSize: '15px', color: '#94a3b8', fontStyle: 'italic', borderLeft: '3px solid #38bdf8', paddingLeft: '12px', marginBottom: '24px' }}>
              {formData.summary}
            </p>
          )}

          {/* Full Article Content with Injected Ads */}
          <div style={{ fontSize: '16px', lineHeight: 1.8, color: '#cbd5e1' }}>
            {segments.map((seg, segIdx) => {
              const correspondingZone = dropZones[segIdx + 1];
              const zoneId = correspondingZone ? correspondingZone.id : `dropzone-p-${segIdx}`;
              const assignedAds = adPlacements.filter(a => a.enabled && a.dropZoneId === zoneId);

              return (
                <React.Fragment key={seg.id}>
                  {seg.html ? (
                    <div dangerouslySetInnerHTML={{ __html: seg.html }} style={{ margin: '18px 0' }} />
                  ) : (
                    <p style={{ marginBottom: '18px' }}>
                      {seg.text}
                    </p>
                  )}

                  {/* Render Assigned Ads at this exact position */}
                  {assignedAds.map(ad => renderDraggableAdCard(ad))}
                </React.Fragment>
              );
            })}

            {/* Before Related Ads */}
            {(() => {
              const relatedZone = dropZones.find(z => z.type === 'before_related');
              if (!relatedZone) return null;
              const relatedAds = adPlacements.filter(a => a.enabled && a.dropZoneId === relatedZone.id);
              return relatedAds.map(ad => renderDraggableAdCard(ad));
            })()}
          </div>
        </div>
      )}
    </div>
  );

  // Sub-renderer: Draggable Ad Placement Card (Custom Image Banner, CTA Banner, or HTML)
  function renderDraggableAdCard(ad) {
    let widthStyle = '100%';
    if (ad.alignment === 'left' || ad.alignment === 'right') {
      widthStyle = '100%';
    } else if (ad.alignment === 'center') {
      widthStyle = '92%';
    }

    const targetLink = ad.targetUrl || ad.linkUrl || '';

    return (
      <div
        key={ad.id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, ad.id)}
        onDragEnd={handleDragEnd}
        onClick={() => setActiveAdId(ad.id)}
        style={{
          width: widthStyle,
          margin: '12px auto',
          background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.3) 0%, rgba(15, 23, 42, 0.96) 100%)',
          border: '2px solid #a855f7',
          borderRadius: '10px',
          padding: '16px 20px',
          boxShadow: '0 0 24px rgba(168, 85, 247, 0.35)',
          cursor: 'grab',
          userSelect: 'none',
          position: 'relative',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease'
        }}
        title="Drag to reposition this advertisement"
      >
        {/* Header Bar Matching Image 1 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
          paddingBottom: '8px',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GripVertical size={16} color="#c084fc" />
            <span style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#c084fc',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              📢 {ad.label || 'ADVERTISEMENT'} (SAVED POSITION)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#8b5cf6',
              color: '#ffffff',
              padding: '3px 10px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}>
              ALIGN: {ad.alignment?.toUpperCase() || 'CENTER'}
            </span>
            <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
              ⠿ Drag to move
            </span>
          </div>
        </div>

        {/* Dynamic Ad Content Display: Image / Custom Banner / HTML */}
        {ad.contentType === 'image' && ad.content ? (
          <div style={{ borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
            <img
              src={ad.content}
              alt={ad.label || 'Ad Banner'}
              style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', display: 'block', borderRadius: '6px' }}
            />
            {targetLink && (
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(0,0,0,0.85)',
                color: '#38bdf8',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid rgba(56,189,248,0.4)'
              }}>
                <LinkIcon size={12} />
                <span>Redirects to: {targetLink.replace(/^https?:\/\//, '').slice(0, 24)}... ↗</span>
              </div>
            )}
          </div>
        ) : ad.contentType === 'html' && ad.content ? (
          <div
            dangerouslySetInnerHTML={{ __html: ad.content }}
            style={{ borderRadius: '6px', overflow: 'hidden', padding: '10px', background: 'rgba(0,0,0,0.4)' }}
          />
        ) : (
          /* Rich Interactive Banner Slot Container */
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px dashed rgba(168, 85, 247, 0.4)',
            borderRadius: '8px',
            padding: '18px 16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
              {ad.headline || '[Interactive Sponsor Banner Ad Slot]'}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', maxWidth: '520px', lineHeight: 1.4 }}>
              {ad.description || 'Standard Leaderboard / Responsive Rectangle Slot (Auto-rendered for all readers)'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <div style={{
                background: '#10b981',
                color: '#ffffff',
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
              }}>
                <span>{ad.ctaText || 'Learn More ↗'}</span>
              </div>

              {targetLink ? (
                <span style={{ fontSize: '11px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <LinkIcon size={12} />
                  <span>Redirects to: <u>{targetLink.replace(/^https?:\/\//, '').slice(0, 26)}...</u></span>
                </span>
              ) : (
                <span style={{ fontSize: '10px', color: '#64748b' }}>(No destination URL set)</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Sub-renderer: Droppable Insertion Target Line (Matching Image 1 "+ Drop Target: 📍 ...")
  function renderDropZoneSlot(zoneId, zone) {
    const isDragOver = dragOverZoneId === zoneId;
    return (
      <div
        key={zoneId}
        onDragOver={(e) => handleDragOver(e, zoneId)}
        onDragLeave={(e) => handleDragLeave(e, zoneId)}
        onDrop={(e) => handleDrop(e, zone || { id: zoneId, type: 'after_paragraph', value: '2', order: 2 })}
        style={{
          margin: '8px 0',
          padding: isDragOver ? '16px' : '6px 12px',
          border: isDragOver ? '2px dashed #a855f7' : '1px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          background: isDragOver ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.02)',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}
        title="Drop advertisement here to reposition"
      >
        <span style={{
          fontSize: '11px',
          fontWeight: isDragOver ? 800 : 600,
          color: isDragOver ? '#c084fc' : '#64748b'
        }}>
          {isDragOver ? `📍 Drop Advertisement Here (${zone?.label || zoneId})` : `+ Drop Target: 📍 ${zone?.label || zoneId}`}
        </span>
      </div>
    );
  }
}
