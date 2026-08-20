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
  Zap,
  ChevronDown,
  Video,
  Play,
  LayoutGrid,
  Layers,
  Upload,
  MousePointerClick,
  Volume2,
  VolumeX
} from 'lucide-react';
import ContinuousCoverVideo from './ContinuousCoverVideo';

// Helper to extract embed video URL (YouTube, Vimeo, etc.) with zero controls & continuous loop
export const parseVideoEmbedUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const cleanUrl = rawUrl.trim();

  // YouTube - Silent Looping Background Video (No play/pause buttons, no controls, no branding)
  const ytMatch = cleanUrl.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1&enablejsapi=1&fs=0&color=white&autohide=1`;
  }

  // Vimeo - Silent Looping Background Video (No controls)
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|)(\d+))/i) || cleanUrl.match(/player\.vimeo\.com\/video\/(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1&controls=0&autopause=0`;
  }

  return null;
};

export const DEFAULT_COLLAGE_ITEMS = [
  {
    id: 'tile-1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    mediaType: 'image',
    title: 'Deep Reflection',
    tag: 'Featured',
    targetUrl: 'https://example.com/portrait'
  },
  {
    id: 'tile-2',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    mediaType: 'image',
    title: 'Joyful Connection',
    tag: 'Community',
    targetUrl: 'https://example.com/community'
  },
  {
    id: 'tile-3',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    mediaType: 'image',
    title: 'Quiet Moments',
    tag: 'Spotlight',
    targetUrl: 'https://example.com/stories'
  },
  {
    id: 'tile-4',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    mediaType: 'image',
    title: 'Collaborative Study',
    tag: 'Education',
    targetUrl: 'https://example.com/learn'
  }
];

export const SAMPLE_AD_TEMPLATES = [
  {
    id: 'sample-collage-community-0',
    name: '🖼️ Youth, Culture & Community Stories (2x2 Quad Collage Ad)',
    label: 'Community & Culture Showcase',
    contentType: 'collage',
    content: '',
    collageLayout: 'grid_2x2',
    collageGap: '8px',
    collageRadius: '12px',
    collageItems: DEFAULT_COLLAGE_ITEMS,
    headline: 'Youth, Culture & Community Photo Story Collective',
    description: 'Explore our multi-frame editorial visual narrative highlighting diverse human experiences.',
    targetUrl: 'https://example.com/community-showcase',
    ctaText: 'Explore Photo Series ↗',
    alignment: 'center',
    columnPosition: 'full',
    widthMode: 'responsive_banner'
  },
  {
    id: 'sample-video-ev-1',
    name: '🎥 Apex Cyber-GT EV Commercial (Video Ad)',
    label: 'Automotive Video Spotlight',
    contentType: 'video',
    content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    headline: 'Experience the All-New Apex Cyber-GT Supercar',
    description: 'Watch official track footage, aerodynamics test, and Level 3 autonomous highway cruise.',
    targetUrl: 'https://apexmotors.com/cyber-gt',
    ctaText: 'Book VIP Test Drive ↗',
    alignment: 'center',
    columnPosition: 'full',
    widthMode: 'responsive_banner',
    videoAutoplay: true,
    videoLoop: true,
    videoMuted: true,
    videoControls: true
  },
  {
    id: 'sample-video-gaming-2',
    name: '🎮 Next-Gen Unreal Tech Trailer (Video Ad)',
    label: 'Interactive Tech Partner',
    contentType: 'video',
    content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    headline: 'Immersive Real-Time Cinematic Raytracing Engine',
    description: 'Experience unprecedented visual fidelity with revolutionary real-time physics simulations.',
    targetUrl: 'https://unrealengine.com/nextgen',
    ctaText: 'Download Tech Demo ↗',
    alignment: 'full_width',
    columnPosition: 'full',
    widthMode: 'leaderboard',
    videoAutoplay: true,
    videoLoop: true,
    videoMuted: true,
    videoControls: true
  },
  {
    id: 'sample-taichi-3',
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
    id: 'sample-cloud-4',
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
    id: 'sample-finance-5',
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
  const [studioMuted, setStudioMuted] = useState(true);
  const studioIframeRef = useRef(null);

  const toggleStudioMute = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const nextMuted = !studioMuted;
    setStudioMuted(nextMuted);

    if (studioIframeRef.current && studioIframeRef.current.contentWindow) {
      try {
        if (nextMuted) {
          studioIframeRef.current.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
          studioIframeRef.current.contentWindow.postMessage('{"method":"setMuted","value":true}', '*');
        } else {
          studioIframeRef.current.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
          studioIframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          studioIframeRef.current.contentWindow.postMessage('{"method":"setMuted","value":false}', '*');
          studioIframeRef.current.contentWindow.postMessage('{"method":"setVolume","value":1}', '*');
          studioIframeRef.current.contentWindow.postMessage('{"method":"play"}', '*');
        }
      } catch (err) {}
    }
  };

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
        description: formData.placeholderAdDescription !== undefined ? formData.placeholderAdDescription : '',
        ctaText: formData.placeholderAdCtaText || 'Learn More ↗',
        videoAutoplay: formData.placeholderAdVideoAutoplay ?? true,
        videoLoop: formData.placeholderAdVideoLoop ?? true,
        videoMuted: formData.placeholderAdVideoMuted ?? true,
        videoControls: formData.placeholderAdVideoControls ?? true,
        dropZoneId: formData.placeholderAdDropZoneId || 'dropzone-p-2'
      }];
    }
    return [];
  }, [formData.adPlacements, formData.placeholderAdEnabled, formData.placeholderAdPositionType, formData.placeholderAdPositionValue, formData.placeholderAdAlignment, formData.placeholderAdLabel, formData.placeholderAdContentType, formData.placeholderAdContent, formData.placeholderAdTargetUrl, formData.placeholderAdHeadline, formData.placeholderAdDescription, formData.placeholderAdCtaText, formData.placeholderAdVideoAutoplay, formData.placeholderAdVideoLoop, formData.placeholderAdVideoMuted, formData.placeholderAdVideoControls, formData.placeholderAdDropZoneId]);

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
      placeholderAdCtaText: primaryAd ? primaryAd.ctaText : '',
      placeholderAdVideoAutoplay: primaryAd ? primaryAd.videoAutoplay : true,
      placeholderAdVideoLoop: primaryAd ? primaryAd.videoLoop : true,
      placeholderAdVideoMuted: primaryAd ? primaryAd.videoMuted : true,
      placeholderAdVideoControls: primaryAd ? primaryAd.videoControls : true,
      placeholderAdCollageLayout: primaryAd ? primaryAd.collageLayout : 'grid_2x2',
      placeholderAdCollageGap: primaryAd ? primaryAd.collageGap : '8px',
      placeholderAdCollageRadius: primaryAd ? primaryAd.collageRadius : '12px',
      placeholderAdCollageItems: primaryAd ? (primaryAd.collageItems || DEFAULT_COLLAGE_ITEMS) : DEFAULT_COLLAGE_ITEMS
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
      contentType: 'collage',
      content: '',
      collageLayout: 'grid_2x2',
      collageGap: '8px',
      collageRadius: '12px',
      collageItems: DEFAULT_COLLAGE_ITEMS,
      targetUrl: 'https://example.com/sponsor',
      headline: `Multi-Frame Partner Showcase #${newIndex}`,
      description: '',
      ctaText: 'Explore Series ↗',
      videoAutoplay: true,
      videoLoop: true,
      videoMuted: true,
      videoControls: true,
      dropZoneId: `dropzone-p-${nextTargetIdx}`
    };

    const updated = [...adPlacements, newAd];
    updateAdPlacements(updated);
    setActiveAdId(newAd.id);
  };

  // Insert a Preset Dummy Ad
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
      collageLayout: template.collageLayout || 'grid_2x2',
      collageGap: template.collageGap || '8px',
      collageRadius: template.collageRadius || '12px',
      collageItems: template.collageItems || DEFAULT_COLLAGE_ITEMS,
      targetUrl: template.targetUrl || 'https://example.com/sponsor',
      linkUrl: template.targetUrl || 'https://example.com/sponsor',
      headline: template.headline || 'Partner Showcase',
      description: template.description || 'Special offer for readers.',
      ctaText: template.ctaText || 'Learn More ↗',
      videoAutoplay: template.videoAutoplay ?? true,
      videoLoop: template.videoLoop ?? true,
      videoMuted: template.videoMuted ?? true,
      videoControls: template.videoControls ?? true,
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

  // Tile Management Helpers for Collage Ads
  const handleUpdateTile = (adId, tileIdx, updatedFields) => {
    const ad = adPlacements.find(a => a.id === adId);
    if (!ad) return;
    const items = Array.isArray(ad.collageItems) && ad.collageItems.length > 0 
      ? [...ad.collageItems] 
      : [...DEFAULT_COLLAGE_ITEMS];
    if (items[tileIdx]) {
      items[tileIdx] = { ...items[tileIdx], ...updatedFields };
    }
    handleUpdateAdField(adId, 'collageItems', items);
  };

  const handleAddTile = (adId) => {
    const ad = adPlacements.find(a => a.id === adId);
    if (!ad) return;
    const items = Array.isArray(ad.collageItems) && ad.collageItems.length > 0 
      ? [...ad.collageItems] 
      : [...DEFAULT_COLLAGE_ITEMS];
    const newTile = {
      id: `tile-${Date.now()}-${items.length + 1}`,
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      title: `Story #${items.length + 1}`,
      tag: 'Featured',
      targetUrl: ''
    };
    handleUpdateAdField(adId, 'collageItems', [...items, newTile]);
  };

  const handleRemoveTile = (adId, tileIdx) => {
    const ad = adPlacements.find(a => a.id === adId);
    if (!ad) return;
    const items = (Array.isArray(ad.collageItems) && ad.collageItems.length > 0 ? ad.collageItems : DEFAULT_COLLAGE_ITEMS).filter((_, i) => i !== tileIdx);
    handleUpdateAdField(adId, 'collageItems', items);
  };

  const handleResetCollage = (adId) => {
    handleUpdateAdField(adId, 'collageItems', DEFAULT_COLLAGE_ITEMS);
  };

  // Update multiple fields on a specific ad atomically
  const handleUpdateAdFields = (adId, fieldsObject) => {
    const currentList = Array.isArray(adPlacements) && adPlacements.length > 0 ? adPlacements : [];
    const updated = currentList.map(ad => {
      if (ad.id === adId) {
        const updatedAd = { ...ad, ...fieldsObject };
        if (fieldsObject.alignment) {
          updatedAd.columnPosition = fieldsObject.alignment === 'left' ? 'left_col' : (fieldsObject.alignment === 'right' ? 'right_col' : 'full');
        }
        return updatedAd;
      }
      return ad;
    });
    updateAdPlacements(updated);
  };

  // Update a single field on a specific ad
  const handleUpdateAdField = (adId, field, value) => {
    handleUpdateAdFields(adId, { [field]: value });
  };

  // Helper to extract embed video URL (YouTube, Vimeo, etc.)
  const parseVideoEmbedUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return null;
    const cleanUrl = rawUrl.trim();

    // YouTube
    const ytMatch = cleanUrl.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|)(\d+))/i) || cleanUrl.match(/player\.vimeo\.com\/video\/(\d+)/i);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1`;
    }

    return null;
  };

  // Parse actual article HTML into structured preview segments (Real Content)
  const segments = useMemo(() => {
    const rawContent = (formData.content || '').trim();

    if (rawContent && typeof document !== 'undefined') {
      try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = rawContent;

        // Query all semantic block elements
        const allBlocks = Array.from(tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6, blockquote, figure, ul, ol, table, .video-wrapper, .youtube-video-wrapper, .vimeo-video-wrapper, .direct-video-wrapper, .resizable-image-wrapper'));

        if (allBlocks.length > 0) {
          return allBlocks.map((el, idx) => {
            const text = el.textContent.trim() || '';
            const isHeading = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName);
            const isQuote = el.tagName === 'BLOCKQUOTE';
            const isList = el.tagName === 'UL' || el.tagName === 'OL';
            const isTable = el.tagName === 'TABLE';
            const isMedia = el.tagName === 'FIGURE' || el.tagName === 'IMG' || el.querySelector('img, video, iframe') || el.classList?.contains('video-wrapper') || el.classList?.contains('resizable-image-wrapper');

            let label = `PARAGRAPH ${idx + 1}`;
            let type = 'paragraph';
            if (idx === 0 && !isMedia && !isHeading) {
              label = 'PARAGRAPH 1 (LEAD INTRO)';
              type = 'intro';
            } else if (isHeading) {
              label = `${el.tagName}: "${text.slice(0, 40)}${text.length > 40 ? '...' : ''}"`;
              type = 'heading';
            } else if (isQuote) {
              label = `PULL-QUOTE (BLOCK ${idx + 1})`;
              type = 'quote';
            } else if (isList) {
              label = `LIST ITEMS (BLOCK ${idx + 1})`;
              type = 'list';
            } else if (isTable) {
              label = `DATA TABLE (BLOCK ${idx + 1})`;
              type = 'table';
            } else if (isMedia) {
              label = `MEDIA EMBED (POSITION ${idx + 1})`;
              type = 'media';
            }

            return {
              id: idx === 0 ? 'intro' : `p-${idx}`,
              index: idx,
              type,
              label,
              text: text,
              html: el.outerHTML
            };
          });
        }

        // Direct children fallback
        const children = Array.from(tempDiv.children);
        if (children.length > 0) {
          return children.map((el, idx) => {
            const text = el.textContent.trim() || '';
            return {
              id: idx === 0 ? 'intro' : `p-${idx}`,
              index: idx,
              type: idx === 0 ? 'intro' : 'paragraph',
              label: idx === 0 ? 'PARAGRAPH 1 (LEAD INTRO)' : `PARAGRAPH ${idx + 1}`,
              text: text,
              html: el.outerHTML
            };
          });
        }
      } catch (err) {
        console.warn('Error parsing article HTML for ad placement:', err);
      }
    }

    // If rawContent is plain text without HTML tags, split by double newlines or single newlines
    if (rawContent) {
      const paras = rawContent.split(/\n\s*\n|\n/).map(p => p.trim()).filter(Boolean);
      if (paras.length > 0) {
        return paras.map((pText, idx) => ({
          id: idx === 0 ? 'intro' : `p-${idx}`,
          index: idx,
          type: idx === 0 ? 'intro' : 'paragraph',
          label: idx === 0 ? 'PARAGRAPH 1 (LEAD INTRO)' : `PARAGRAPH ${idx + 1}`,
          text: pText,
          html: `<p>${pText}</p>`
        }));
      }
    }

    // Contextual fallback based on the actual article being edited
    const title = formData.title || 'Untitled Article Draft';
    const summary = formData.summary || 'Article draft overview awaiting story body text.';
    return [
      { id: 'intro', index: 0, type: 'intro', label: 'PARAGRAPH 1 (LEAD INTRO)', text: summary, html: `<p><strong>${summary}</strong></p>` },
      { id: 'p-1', index: 1, type: 'paragraph', label: 'PARAGRAPH 2 (DRAFT BODY)', text: `In-depth reporting on "${title}" will appear here as you type in the Story tab.`, html: `<p>In-depth reporting on <em>"${title}"</em> will appear here as you type in the Story tab.</p>` },
      { id: 'p-2', index: 2, type: 'paragraph', label: 'PARAGRAPH 3 (ANALYTICAL INSIGHTS)', text: `Key evidence, stakeholder interviews, and data points regarding ${title} are presented here.`, html: `<p>Key evidence, stakeholder interviews, and data points regarding ${title} are presented here.</p>` },
      { id: 'p-3', index: 3, type: 'paragraph', label: 'PARAGRAPH 4 (OUTLOOK & SUMMARY)', text: `Concluding perspectives and subsequent updates on ${title}.`, html: `<p>Concluding perspectives and subsequent updates on ${title}.</p>` }
    ];
  }, [formData.content, formData.summary, formData.title]);

  // List of valid drop zones derived from content segments
  const dropZones = useMemo(() => {
    const zones = [
      { id: 'dropzone-intro', label: 'Position 1: After Intro Block', type: 'after_intro', value: 'intro', order: 1 }
    ];

    segments.forEach((seg, idx) => {
      zones.push({
        id: `dropzone-p-${idx + 1}`,
        label: `Position ${idx + 2}: After ${seg.label}`,
        type: 'after_paragraph',
        value: String(idx + 1),
        order: idx + 2
      });
    });

    zones.push({
      id: 'dropzone-related',
      label: `Position ${zones.length + 1}: Before Related Articles & Discussion`,
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
          placementType: zone.type || 'after_paragraph',
          placementValue: zone.value || '2',
          sortOrder: zone.order || 2
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
              Embed online video ads, images & interactive CTA banners with automatic click-through link redirection.
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
              <span>⚡ Insert Preset Ad</span>
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
                width: '340px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.8)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', padding: '4px 8px', textTransform: 'uppercase' }}>
                  Choose Online Embed Ad Preset:
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
              const formatIcon = ad.contentType === 'video' ? '🎥' : (ad.contentType === 'image' ? '🖼️' : '📢');
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
                  <span>{formatIcon} Ad #{idx + 1}: {ad.alignment?.toUpperCase()} ({ad.dropZoneId?.replace('dropzone-', '') || 'P-2'})</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE AD CONFIGURATION STUDIO PANEL */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>
                    Ad Content Format:
                  </span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'collage', label: '🖼️ Multi-Media Collage', icon: LayoutGrid },
                      { key: 'placeholder', label: '📢 Interactive Banner Box', icon: Sparkles },
                      { key: 'image', label: '🖼️ Embed Online Image', icon: ImageIcon },
                      { key: 'video', label: '🎥 Embed Online Video', icon: Video },
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
                    placeholder="e.g. Advertisement, Sponsored Video, Partner Spotlight"
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

              {/* Row 3: Destination Hyperlink (CRITICAL: When user clicks ad, redirects to this link) */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1.5px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '8px',
                padding: '14px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  <LinkIcon size={14} />
                  <span>Destination Hyperlink (Redirect URL when reader clicks ad):</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={currentAd.targetUrl !== undefined ? currentAd.targetUrl : (currentAd.linkUrl !== undefined ? currentAd.linkUrl : '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleUpdateAdFields(currentAd.id, {
                        targetUrl: val,
                        linkUrl: val
                      });
                    }}
                    placeholder="https://sponsor.com/landing-page (Clicking anywhere on this ad redirects readers here)"
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      background: '#0f172a',
                      border: '1px solid rgba(56, 189, 248, 0.5)',
                      borderRadius: '6px',
                      color: '#38bdf8',
                      fontSize: '13px',
                      fontWeight: 700,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {(currentAd.targetUrl || currentAd.linkUrl) && (
                    <a
                      href={currentAd.targetUrl || currentAd.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 16px',
                        background: 'rgba(56, 189, 248, 0.2)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        borderRadius: '6px',
                        color: '#38bdf8',
                        fontSize: '12px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ExternalLink size={14} />
                      <span>Test Redirect ↗</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Row 4: EMBED ONLINE VIDEO AD */}
              {currentAd.contentType === 'video' && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1.5px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Video size={16} color="#f87171" />
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#f87171', textTransform: 'uppercase' }}>
                      Embed Online Video (YouTube, Vimeo, or Direct MP4 / WebM URL):
                    </label>
                  </div>

                  {/* Online Video URL Input */}
                  <div>
                    <input
                      type="url"
                      value={currentAd.content || ''}
                      onChange={(e) => handleUpdateAdField(currentAd.id, 'content', e.target.value)}
                      placeholder="Enter Online Video URL: e.g. https://www.youtube.com/watch?v=... or https://vimeo.com/... or https://.../video.mp4"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#0f172a',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Video Playback Options */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                      Playback Controls:
                    </span>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#f8fafc', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={currentAd.videoAutoplay ?? true}
                        onChange={(e) => handleUpdateAdField(currentAd.id, 'videoAutoplay', e.target.checked)}
                        style={{ accentColor: '#ef4444' }}
                      />
                      <span>Autoplay Video</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#f8fafc', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={currentAd.videoMuted ?? true}
                        onChange={(e) => handleUpdateAdField(currentAd.id, 'videoMuted', e.target.checked)}
                        style={{ accentColor: '#ef4444' }}
                      />
                      <span>Muted by Default</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#f8fafc', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={currentAd.videoLoop ?? true}
                        onChange={(e) => handleUpdateAdField(currentAd.id, 'videoLoop', e.target.checked)}
                        style={{ accentColor: '#ef4444' }}
                      />
                      <span>Loop Video</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#f8fafc', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={currentAd.videoControls ?? true}
                        onChange={(e) => handleUpdateAdField(currentAd.id, 'videoControls', e.target.checked)}
                        style={{ accentColor: '#ef4444' }}
                      />
                      <span>Show Controls</span>
                    </label>
                  </div>

                  {/* Video Text & CTA Settings */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#f87171', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Video Headline / Title
                      </label>
                      <input
                        type="text"
                        value={currentAd.headline || ''}
                        onChange={(e) => handleUpdateAdField(currentAd.id, 'headline', e.target.value)}
                        placeholder="e.g. Watch the Official Product Debut"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: '#0f172a',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '12px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#f87171', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Clickable CTA Button Text (Redirects on click)
                      </label>
                      <input
                        type="text"
                        value={currentAd.ctaText || ''}
                        onChange={(e) => handleUpdateAdField(currentAd.id, 'ctaText', e.target.value)}
                        placeholder="e.g. Visit Sponsor ↗, Explore Model, Watch Demo"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: '#0f172a',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '12px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Live Video Preview in Studio Panel */}
                  {currentAd.content && (
                    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)', position: 'relative', background: '#000', maxHeight: '280px' }}>
                      {/* Floating Volume / Mute Toggle Button */}
                      <button
                        type="button"
                        onClick={toggleStudioMute}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          zIndex: 20,
                          background: 'rgba(9, 13, 22, 0.85)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: studioMuted ? '#cbd5e1' : '#38bdf8',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.7)',
                          transition: 'all 0.2s ease',
                          pointerEvents: 'auto'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        title={studioMuted ? "Click to Unmute" : "Click to Mute"}
                      >
                        {studioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>

                      {parseVideoEmbedUrl(currentAd.content) ? (
                        <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden', background: '#000' }}>
                          <iframe
                            ref={studioIframeRef}
                            src={parseVideoEmbedUrl(currentAd.content)}
                            title="Ad Video Preview"
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              width: '145%',
                              height: '145%',
                              transform: 'translate(-50%, -50%)',
                              border: 'none',
                              display: 'block',
                              pointerEvents: 'none'
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                      ) : (
                        <div style={{ width: '100%', height: '220px' }}>
                          <ContinuousCoverVideo
                            src={currentAd.content}
                            controls={false}
                            autoPlay={true}
                            loop={true}
                            muted={studioMuted}
                            playsInline={true}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                          />
                        </div>
                      )}
                      <span style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.85)', color: '#f87171', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.4)', pointerEvents: 'none' }}>
                        🎥 Continuous Looping Video Ad
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Row 4.5: MULTI-MEDIA COLLAGE AD STUDIO (2x2 Quad Grid, 1x2, 1+2, etc.) */}
              {currentAd.contentType === 'collage' && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(99, 102, 241, 0.08) 100%)',
                  border: '1.5px solid rgba(168, 85, 247, 0.35)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Collage Layout Preset Buttons */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LayoutGrid size={14} color="#c084fc" />
                        <label style={{ fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>
                          Collage Grid Layout Pattern:
                        </label>
                      </div>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Matching Quad (2x2) & Dynamic Multi-Frame Layouts
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[
                        { key: 'grid_2x2', label: '⊞ 2x2 Quad Grid (4 Tiles)', desc: '2 rows x 2 columns (Classic Quad Collage)' },
                        { key: 'grid_1x2', label: '▥ 2-Grid Split (2 Tiles)', desc: '2 equal vertical columns' },
                        { key: 'grid_1_plus_2', label: '◫ 1+2 Featured (3 Tiles)', desc: '1 large hero on left + 2 stacked' },
                        { key: 'grid_3_cols', label: '☵ 3 Columns (3 Tiles)', desc: '3 equal column cards' },
                        { key: 'grid_1_plus_3', label: '⬚ 1+3 Banner (4 Tiles)', desc: '1 wide top header + 3 bottom cards' }
                      ].map(layoutOpt => {
                        const isLayoutActive = (currentAd.collageLayout || 'grid_2x2') === layoutOpt.key;
                        return (
                          <button
                            key={layoutOpt.key}
                            type="button"
                            onClick={() => handleUpdateAdField(currentAd.id, 'collageLayout', layoutOpt.key)}
                            style={{
                              padding: '6px 12px',
                              background: isLayoutActive ? '#7c3aed' : 'rgba(255, 255, 255, 0.05)',
                              border: isLayoutActive ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '6px',
                              color: isLayoutActive ? '#ffffff' : '#94a3b8',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                            title={layoutOpt.desc}
                          >
                            <span>{layoutOpt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Collage Styling Parameters (Gap & Radius) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Grid Gap Between Tiles:
                      </label>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {['4px', '8px', '12px', '16px'].map(gap => (
                          <button
                            key={gap}
                            type="button"
                            onClick={() => handleUpdateAdField(currentAd.id, 'collageGap', gap)}
                            style={{
                              flex: 1,
                              padding: '4px 6px',
                              background: (currentAd.collageGap || '8px') === gap ? '#a855f7' : 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '4px',
                              color: '#fff',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {gap}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Outer & Tile Corner Radius:
                      </label>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {['4px', '8px', '12px', '16px', '20px'].map(radius => (
                          <button
                            key={radius}
                            type="button"
                            onClick={() => handleUpdateAdField(currentAd.id, 'collageRadius', radius)}
                            style={{
                              flex: 1,
                              padding: '4px 6px',
                              background: (currentAd.collageRadius || '12px') === radius ? '#a855f7' : 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '4px',
                              color: '#fff',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {radius}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Collage Headline & CTA */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Collage Headline Title:
                      </label>
                      <input
                        type="text"
                        value={currentAd.headline || ''}
                        onChange={(e) => handleUpdateAdField(currentAd.id, 'headline', e.target.value)}
                        placeholder="e.g. Youth & Community Stories Collective"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: '#0f172a',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '12px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Call-to-Action (CTA Button):
                      </label>
                      <input
                        type="text"
                        value={currentAd.ctaText || ''}
                        onChange={(e) => handleUpdateAdField(currentAd.id, 'ctaText', e.target.value)}
                        placeholder="e.g. Explore Photo Series ↗"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: '#0f172a',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '12px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Description / Story Subtitle:
                      </label>
                      <input
                        type="text"
                        value={currentAd.description || ''}
                        onChange={(e) => handleUpdateAdField(currentAd.id, 'description', e.target.value)}
                        placeholder="e.g. Visual stories of human resilience, connections, and community moments."
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: '#0f172a',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '12px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Collage Tiles List & Local File / URL Uploader */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={14} color="#38bdf8" />
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                          Collage Media Tiles ({(currentAd.collageItems || DEFAULT_COLLAGE_ITEMS).length} Slots)
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => handleResetCollage(currentAd.id)}
                          style={{
                            padding: '4px 10px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '6px',
                            color: '#cbd5e1',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ⚡ Load 4-Photo Sample Grid
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddTile(currentAd.id)}
                          style={{
                            padding: '4px 12px',
                            background: '#0284c7',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Plus size={12} />
                          <span>+ Add Tile Slot</span>
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                      {(Array.isArray(currentAd.collageItems) && currentAd.collageItems.length > 0 ? currentAd.collageItems : DEFAULT_COLLAGE_ITEMS).map((tile, tileIdx) => {
                        const isVideo = tile.mediaType === 'video' || /\.(mp4|webm|ogg)(\?.*)?$/i.test(tile.url || '');
                        const tilePosLabel = (currentAd.collageLayout === 'grid_2x2' || !currentAd.collageLayout)
                          ? (tileIdx === 0 ? 'Top-Left' : (tileIdx === 1 ? 'Top-Right' : (tileIdx === 2 ? 'Bottom-Left' : (tileIdx === 3 ? 'Bottom-Right' : `#${tileIdx + 1}`))))
                          : `#${tileIdx + 1}`;

                        return (
                          <div
                            key={tile.id || tileIdx}
                            style={{
                              background: '#090d16',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '8px',
                              padding: '10px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}
                          >
                            {/* Slot Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>
                                🖼️ Slot {tileIdx + 1} ({tilePosLabel})
                              </span>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '10px', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                                  {isVideo ? '🎥 Video' : '🖼️ Image'}
                                </span>
                                {(currentAd.collageItems?.length || DEFAULT_COLLAGE_ITEMS.length) > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTile(currentAd.id, tileIdx)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#ef4444',
                                      cursor: 'pointer',
                                      padding: '2px'
                                    }}
                                    title="Delete this tile"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Media Preview & Device File Upload */}
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '6px',
                                overflow: 'hidden',
                                background: '#020617',
                                flexShrink: 0,
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {isVideo ? (
                                  <video src={tile.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted autoPlay loop playsInline />
                                ) : (
                                  <img
                                    src={tile.url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'}
                                    alt={`Tile ${tileIdx + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';
                                    }}
                                  />
                                )}
                              </div>

                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <input
                                  type="file"
                                  id={`ad-tile-upload-${currentAd.id}-${tileIdx}`}
                                  accept="image/*,video/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const isVid = file.type.startsWith('video');
                                    if (isVid) {
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        const dataUrl = ev.target?.result;
                                        if (dataUrl) {
                                          handleUpdateTile(currentAd.id, tileIdx, { url: dataUrl, mediaType: 'video' });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    } else {
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        const raw = ev.target?.result;
                                        if (!raw) return;
                                        const img = new Image();
                                        img.onload = () => {
                                          const canvas = document.createElement('canvas');
                                          const MAX_WIDTH = 1200;
                                          let width = img.width;
                                          let height = img.height;
                                          if (width > MAX_WIDTH) {
                                            height = Math.round(height * (MAX_WIDTH / width));
                                            width = MAX_WIDTH;
                                          }
                                          canvas.width = width;
                                          canvas.height = height;
                                          const ctx = canvas.getContext('2d');
                                          ctx.drawImage(img, 0, 0, width, height);
                                          const compressed = canvas.toDataURL('image/jpeg', 0.85);
                                          handleUpdateTile(currentAd.id, tileIdx, { url: compressed, mediaType: 'image' });
                                        };
                                        img.src = raw;
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />

                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`ad-tile-upload-${currentAd.id}-${tileIdx}`)?.click()}
                                  style={{
                                    padding: '4px 8px',
                                    background: 'rgba(56, 189, 248, 0.15)',
                                    border: '1px solid rgba(56, 189, 248, 0.3)',
                                    borderRadius: '4px',
                                    color: '#38bdf8',
                                    fontSize: '10.5px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <Upload size={11} />
                                  <span>Upload from Computer</span>
                                </button>

                                <input
                                  type="url"
                                  value={tile.url || ''}
                                  onChange={(e) => handleUpdateTile(currentAd.id, tileIdx, { url: e.target.value })}
                                  placeholder="OR paste Image/Video URL"
                                  style={{
                                    width: '100%',
                                    padding: '4px 8px',
                                    background: '#020617',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    color: '#ffffff',
                                    fontSize: '11px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                  }}
                                />
                              </div>
                            </div>

                            {/* Caption & Target URL Fields */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                              <input
                                type="text"
                                value={tile.title || ''}
                                onChange={(e) => handleUpdateTile(currentAd.id, tileIdx, { title: e.target.value })}
                                placeholder="Caption / Title"
                                style={{
                                  padding: '4px 6px',
                                  background: '#020617',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  borderRadius: '4px',
                                  color: '#cbd5e1',
                                  fontSize: '11px',
                                  outline: 'none'
                                }}
                              />
                              <input
                                type="text"
                                value={tile.tag || ''}
                                onChange={(e) => handleUpdateTile(currentAd.id, tileIdx, { tag: e.target.value })}
                                placeholder="Tag (e.g. Featured)"
                                style={{
                                  padding: '4px 6px',
                                  background: '#020617',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  borderRadius: '4px',
                                  color: '#cbd5e1',
                                  fontSize: '11px',
                                  outline: 'none'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Interactive Collage Preview in Studio (Auto-Resizes with Alignment like Canva Card) */}
                  {(() => {
                    const alignVal = currentAd.alignment || 'center';
                    const isCompactLayout = (alignVal === 'left' || alignVal === 'right');
                    const wrapperStyle = {
                      maxWidth: isCompactLayout ? '340px' : (alignVal === 'center' ? '540px' : '100%'),
                      margin: alignVal === 'left' ? '0 auto 0 0' : (alignVal === 'right' ? '0 0 0 auto' : '0 auto'),
                      width: '100%',
                      background: '#040711',
                      border: '1.5px solid rgba(168, 85, 247, 0.4)',
                      borderRadius: '12px',
                      padding: isCompactLayout ? '12px' : '16px',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
                      transition: 'all 0.25s ease'
                    };

                    return (
                      <div style={{ background: '#020617', padding: '14px', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <LayoutGrid size={13} color="#a855f7" />
                            <span>Live Alignment & Resizing Preview</span>
                          </span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: isCompactLayout ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                            color: isCompactLayout ? '#38bdf8' : '#c084fc',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}>
                            📍 {alignVal.toUpperCase()} ALIGNED ({isCompactLayout ? 'Auto-Resized 340px Compact Card' : (alignVal === 'center' ? 'Centered 540px' : '100% Full Width')})
                          </span>
                        </div>

                        {/* Centered/Left/Right Resized Card Container */}
                        <div style={wrapperStyle}>
                          {/* 1. Header Disclosure Bar */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <LayoutGrid size={11} color="#a855f7" />
                              <span>{currentAd.label || 'Sponsored Showcase'}</span>
                            </div>
                            <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 700 }}>SPONSOR</span>
                          </div>

                          {/* 2. Proportional Collage Grid (Square 1:1 on 2x2) */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: (currentAd.collageLayout === 'grid_1x2' || currentAd.collageLayout === 'grid_2x2' || !currentAd.collageLayout) 
                                ? 'repeat(2, 1fr)' 
                                : (currentAd.collageLayout === 'grid_3_cols' ? 'repeat(3, 1fr)' : (currentAd.collageLayout === 'grid_1_plus_2' ? '1.2fr 0.8fr' : 'repeat(3, 1fr)')),
                              gridTemplateRows: (currentAd.collageLayout === 'grid_2x2' || !currentAd.collageLayout)
                                ? 'repeat(2, 1fr)'
                                : (currentAd.collageLayout === 'grid_1_plus_2' ? 'repeat(2, 1fr)' : (currentAd.collageLayout === 'grid_1_plus_3' ? '1.2fr 1fr' : '1fr')),
                              gap: currentAd.collageGap || '6px',
                              borderRadius: currentAd.collageRadius || '10px',
                              overflow: 'hidden',
                              background: 'rgba(0, 0, 0, 0.5)',
                              aspectRatio: currentAd.collageLayout === 'grid_3_cols' ? '16 / 7' : (currentAd.collageLayout === 'grid_1x2' ? '16 / 9' : '1 / 1'),
                              width: '100%',
                              maxHeight: isCompactLayout ? '320px' : '420px',
                              border: '1px solid rgba(255, 255, 255, 0.15)'
                            }}
                          >
                            {(Array.isArray(currentAd.collageItems) && currentAd.collageItems.length > 0 ? currentAd.collageItems : DEFAULT_COLLAGE_ITEMS).map((item, idx) => {
                              const itemSpanStyle = {};
                              if (currentAd.collageLayout === 'grid_1_plus_2' && idx === 0) {
                                itemSpanStyle.gridRow = '1 / 3';
                              } else if (currentAd.collageLayout === 'grid_1_plus_3' && idx === 0) {
                                itemSpanStyle.gridColumn = '1 / 4';
                              }

                              const isVideo = item.mediaType === 'video' || /\.(mp4|webm|ogg)(\?.*)?$/i.test(item.url || '');

                              return (
                                <div
                                  key={item.id || idx}
                                  style={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderRadius: '4px',
                                    background: '#090d16',
                                    ...itemSpanStyle
                                  }}
                                >
                                  {isVideo ? (
                                    <video src={item.url} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                  ) : (
                                    <img
                                      src={item.url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'}
                                      alt={item.title || `Frame ${idx + 1}`}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                  )}

                                  {(item.tag || item.title) && (
                                    <div style={{
                                      position: 'absolute',
                                      bottom: '4px',
                                      left: '4px',
                                      background: 'rgba(0, 0, 0, 0.75)',
                                      color: '#f8fafc',
                                      fontSize: isCompactLayout ? '8.5px' : '9.5px',
                                      fontWeight: 700,
                                      padding: '1px 6px',
                                      borderRadius: '3px',
                                      border: '1px solid rgba(255, 255, 255, 0.15)',
                                      maxWidth: '85%',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}>
                                      {item.tag || item.title}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* 3. Info & Full-Width CTA Section (Canva Style when Compact) */}
                          {isCompactLayout ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', marginTop: '10px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', lineHeight: 1.3 }}>
                                {currentAd.headline || 'Featured Story Narrative'}
                              </div>
                              {currentAd.description && (
                                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.35 }}>
                                  {currentAd.description}
                                </div>
                              )}
                              <div style={{
                                width: '100%',
                                marginTop: '4px',
                                background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                                color: '#ffffff',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '5px',
                                boxShadow: '0 3px 12px rgba(168, 85, 247, 0.4)'
                              }}>
                                <MousePointerClick size={12} />
                                <span>{currentAd.ctaText || 'Get Started Free ↗'}</span>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                                  {currentAd.headline || 'Featured Story Narrative'}
                                </div>
                                {currentAd.description && (
                                  <div style={{ fontSize: '11px', color: '#94a3b8', maxWidth: '440px', lineHeight: 1.35 }}>
                                    {currentAd.description}
                                  </div>
                                )}
                              </div>
                              <div style={{
                                background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                                color: '#ffffff',
                                padding: '6px 14px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 8px rgba(168, 85, 247, 0.35)'
                              }}>
                                <MousePointerClick size={12} />
                                <span>{currentAd.ctaText || 'Explore Showcase ↗'}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Row 5: EMBED ONLINE IMAGE BANNER */}
              {currentAd.contentType === 'image' && (
                <div style={{
                  background: 'rgba(168, 85, 247, 0.08)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '8px',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <ImageIcon size={14} color="#c084fc" />
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>
                      Embed Online Image Banner (Direct Image URL):
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <input
                      type="url"
                      value={currentAd.content || ''}
                      onChange={(e) => handleUpdateAdField(currentAd.id, 'content', e.target.value)}
                      placeholder="Paste Online Image URL: e.g. https://images.unsplash.com/... or https://sponsor.com/banner.png"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
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
                      <span style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.85)', color: '#c084fc', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                        Online Image Embed Preview (Click redirects to destination URL)
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Row 6: Interactive Banner Box Fields */}
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

              {/* Row 7: Custom HTML Embed Code */}
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
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
              <Video size={15} />
              <span>⚡ Insert Sample Video Ad</span>
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
                Interactive Placement Canvas (Real Article View):
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                (Drag ad blocks into dashed slots or click "+ Place Ad Here" to position ads inside the story)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>
                {segments.length} Article Sections • {adPlacements.filter(a => a.enabled).length} Active Ads
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
            {/* REAL ARTICLE CONTEXT HEADER BANNER */}
            <div style={{
              background: 'linear-gradient(180deg, #0f172a 0%, #090d16 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '18px 22px',
              marginBottom: '18px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px'
                  }}>
                    {formData.category || 'NEWS'}
                  </span>
                  {(formData.kicker || formData.supertitle) && (
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {formData.kicker || formData.supertitle}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  By <strong>{formData.author || 'Staff Reporter'}</strong> • {formData.readTime || '3 min read'}
                </div>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: '6px 0 10px 0', lineHeight: 1.35 }}>
                {formData.title || 'Untitled Article Headline'}
              </h2>

              {formData.summary && (
                <div style={{
                  fontSize: '13px',
                  color: '#cbd5e1',
                  lineHeight: 1.5,
                  borderLeft: '3px solid #38bdf8',
                  paddingLeft: '12px',
                  margin: '8px 0 12px 0',
                  fontStyle: 'italic'
                }}>
                  {formData.summary}
                </div>
              )}

              {/* Cover media preview if present */}
              {(formData.imageUrl || formData.videoUrl) && (
                <div style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  maxHeight: '220px',
                  marginTop: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {formData.coverMediaType === 'video' && formData.videoUrl ? (
                    <ContinuousCoverVideo
                      src={formData.videoUrl}
                      controls={false}
                      autoPlay={true}
                      loop={true}
                      muted={true}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <img
                      src={formData.imageUrl}
                      alt={formData.title || 'Cover'}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                  {(formData.photoCaption || formData.photoCredit) && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                      padding: '8px 12px',
                      fontSize: '11px',
                      color: '#e2e8f0'
                    }}>
                      {formData.photoCaption && <span>{formData.photoCaption} </span>}
                      {formData.photoCredit && <span style={{ opacity: 0.75 }}>({formData.photoCredit})</span>}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Render Dropzone 0 (Intro Slot) */}
            {renderDropZoneSlot('dropzone-intro', dropZones[0])}

            {/* Render Content Stream with Interleaved Ads & Dropzones */}
            {segments.map((seg, segIdx) => {
              const correspondingZone = dropZones[segIdx + 1];
              const zoneId = correspondingZone ? correspondingZone.id : `dropzone-p-${segIdx + 1}`;
              const assignedAds = adPlacements.filter(a => a.enabled && a.dropZoneId === zoneId);

              const leftAd = assignedAds.find(a => a.alignment === 'left');
              const rightAd = assignedAds.find(a => a.alignment === 'right');
              const centerOrFullAds = assignedAds.filter(a => a.alignment === 'center' || a.alignment === 'full_width' || !a.alignment);

              return (
                <React.Fragment key={seg.id || `seg-${segIdx}`}>
                  {/* Real Paragraph / Section Card with Full Content */}
                  <div style={{
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    margin: '12px 0'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#38bdf8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      paddingBottom: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '12px', background: '#38bdf8', borderRadius: '1px', display: 'inline-block' }} />
                        <span>{seg.label}</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>
                        Section #{segIdx + 1}
                      </span>
                    </div>

                    {seg.html ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: seg.html }}
                        style={{
                          fontSize: '14px',
                          lineHeight: 1.7,
                          color: '#e2e8f0'
                        }}
                      />
                    ) : (
                      <p style={{ margin: 0, fontSize: '14px', color: '#e2e8f0', lineHeight: 1.7 }}>
                        {seg.text}
                      </p>
                    )}
                  </div>

                  {/* Side-by-Side Multi-Column Newspaper Layout */}
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
                              background: '#090d16',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '8px',
                              padding: '14px 18px',
                              marginBottom: '10px'
                            }}>
                              <div style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                color: '#38bdf8',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginBottom: '6px'
                              }}>
                                <span style={{ width: '8px', height: '12px', background: '#38bdf8', borderRadius: '1px', display: 'inline-block' }} />
                                <span>{segments[segIdx + 1].label}</span>
                              </div>
                              <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
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
              [End of Article Content • Related Briefings & Reader Comments Section]
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
          maxHeight: '750px',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '8px',
            padding: '10px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#c084fc' }}>
              👁️ Reader Live Article View with Embedded Ad Placements ({adPlacements.filter(a => a.enabled).length} Active Ads)
            </span>
            <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
              Shows real layout as published on reader site (civibrief.pages.dev)
            </span>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{
                background: '#dc2626',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                {formData.category || 'NEWS'}
              </span>
              {(formData.kicker || formData.supertitle) && (
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#f87171', textTransform: 'uppercase' }}>
                  {formData.kicker || formData.supertitle}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', marginBottom: '14px', lineHeight: 1.25 }}>
              {formData.title || 'Untitled Article'}
            </h1>

            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
              By <strong>{formData.author || 'Staff Reporter'}</strong> • {formData.readTime || '3 min read'}
            </div>

            {/* Summary Block */}
            {formData.summary && (
              <p style={{ fontSize: '16px', color: '#cbd5e1', fontStyle: 'italic', borderLeft: '3px solid #38bdf8', paddingLeft: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                {formData.summary}
              </p>
            )}

            {/* Cover Media */}
            {(formData.imageUrl || formData.videoUrl) && (
              <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                {formData.coverMediaType === 'video' && formData.videoUrl ? (
                  <ContinuousCoverVideo
                    src={formData.videoUrl}
                    controls={true}
                    autoPlay={true}
                    loop={true}
                    muted={true}
                    style={{ width: '100%', height: '380px', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={formData.imageUrl}
                    alt={formData.title}
                    style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
                  />
                )}
                {(formData.photoCaption || formData.photoCredit) && (
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                    {formData.photoCaption} {formData.photoCredit && <em>({formData.photoCredit})</em>}
                  </div>
                )}
              </div>
            )}

            {/* Intro Slot Ads */}
            {(() => {
              const introAds = adPlacements.filter(a => a.enabled && a.dropZoneId === 'dropzone-intro');
              return introAds.map(ad => renderDraggableAdCard(ad));
            })()}

            {/* Full Article Content with Injected Ads */}
            <div style={{ fontSize: '16px', lineHeight: 1.8, color: '#cbd5e1' }}>
              {segments.map((seg, segIdx) => {
                const correspondingZone = dropZones[segIdx + 1];
                const zoneId = correspondingZone ? correspondingZone.id : `dropzone-p-${segIdx + 1}`;
                const assignedAds = adPlacements.filter(a => a.enabled && a.dropZoneId === zoneId);

                return (
                  <React.Fragment key={seg.id || `seg-live-${segIdx}`}>
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
        </div>
      )}
    </div>
  );

  // Sub-renderer: Draggable Ad Placement Card
  function renderDraggableAdCard(ad) {
    const isCompact = (ad.alignment === 'left' || ad.alignment === 'right');
    let widthStyle = '100%';
    let maxWidthStyle = '100%';
    let marginStyle = '16px auto';

    if (ad.alignment === 'left') {
      widthStyle = '46%';
      maxWidthStyle = '340px';
      marginStyle = '12px auto 18px 0';
    } else if (ad.alignment === 'right') {
      widthStyle = '46%';
      maxWidthStyle = '340px';
      marginStyle = '12px 0 18px auto';
    } else if (ad.alignment === 'center') {
      widthStyle = '88%';
      maxWidthStyle = '540px';
      marginStyle = '16px auto';
    }

    const targetLink = ad.targetUrl || ad.linkUrl || '';
    const videoEmbed = parseVideoEmbedUrl(ad.content);

    return (
      <div
        key={ad.id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, ad.id)}
        onDragEnd={handleDragEnd}
        onClick={() => setActiveAdId(ad.id)}
        style={{
          width: widthStyle,
          maxWidth: maxWidthStyle,
          margin: marginStyle,
          background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.3) 0%, rgba(15, 23, 42, 0.96) 100%)',
          border: '2px solid #a855f7',
          borderRadius: '12px',
          padding: isCompact ? '12px 14px' : '16px 20px',
          boxShadow: '0 0 24px rgba(168, 85, 247, 0.35)',
          cursor: 'grab',
          userSelect: 'none',
          position: 'relative',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease'
        }}
        title="Drag to reposition this advertisement"
      >
        {/* Header Bar with Slot Changer Dropdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
          paddingBottom: '8px',
          marginBottom: '10px',
          flexWrap: 'wrap',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GripVertical size={14} color="#c084fc" />
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#c084fc',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              📢 {ad.label || 'ADVERTISEMENT'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Quick Slot Changer Dropdown */}
            <select
              value={ad.dropZoneId || 'dropzone-p-1'}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const targetZoneId = e.target.value;
                const targetZone = dropZones.find(z => z.id === targetZoneId);
                const updated = adPlacements.map(a => a.id === ad.id ? {
                  ...a,
                  dropZoneId: targetZoneId,
                  placementType: targetZone?.type || 'after_paragraph',
                  placementValue: targetZone?.value || '2',
                  sortOrder: targetZone?.order || 2
                } : a);
                updateAdPlacements(updated);
              }}
              style={{
                background: '#1e1b4b',
                color: '#c084fc',
                border: '1px solid #a855f7',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {dropZones.map(z => (
                <option key={z.id} value={z.id}>
                  {z.label}
                </option>
              ))}
            </select>

            <span style={{
              background: isCompact ? '#38bdf8' : '#8b5cf6',
              color: isCompact ? '#000000' : '#ffffff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '9.5px',
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}>
              {ad.alignment?.toUpperCase() || 'CENTER'}
            </span>
          </div>
        </div>

        {/* 0. MULTI-MEDIA COLLAGE AD FORMAT (2x2 Quad Grid, 1x2, 1+2, etc.) */}
        {ad.contentType === 'collage' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: (ad.collageLayout === 'grid_1x2' || ad.collageLayout === 'grid_2x2' || !ad.collageLayout) 
                  ? 'repeat(2, 1fr)' 
                  : (ad.collageLayout === 'grid_3_cols' ? 'repeat(3, 1fr)' : (ad.collageLayout === 'grid_1_plus_2' ? '1.2fr 0.8fr' : 'repeat(3, 1fr)')),
                gridTemplateRows: (ad.collageLayout === 'grid_2x2' || !ad.collageLayout)
                  ? 'repeat(2, 1fr)'
                  : (ad.collageLayout === 'grid_1_plus_2' ? 'repeat(2, 1fr)' : (ad.collageLayout === 'grid_1_plus_3' ? '1.2fr 1fr' : '1fr')),
                gap: ad.collageGap || '6px',
                borderRadius: ad.collageRadius || '10px',
                overflow: 'hidden',
                background: 'rgba(0, 0, 0, 0.4)',
                aspectRatio: ad.collageLayout === 'grid_3_cols' ? '16 / 7' : (ad.collageLayout === 'grid_1x2' ? '16 / 9' : '1 / 1'),
                width: '100%',
                maxHeight: isCompact ? '320px' : '420px'
              }}
            >
              {(Array.isArray(ad.collageItems) && ad.collageItems.length > 0 ? ad.collageItems : DEFAULT_COLLAGE_ITEMS).map((item, idx) => {
                const itemSpanStyle = {};
                if (ad.collageLayout === 'grid_1_plus_2' && idx === 0) {
                  itemSpanStyle.gridRow = '1 / 3';
                } else if (ad.collageLayout === 'grid_1_plus_3' && idx === 0) {
                  itemSpanStyle.gridColumn = '1 / 4';
                }

                const isVideo = item.mediaType === 'video' || /\.(mp4|webm|ogg)(\?.*)?$/i.test(item.url || '');

                return (
                  <div
                    key={item.id || idx}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '4px',
                      background: '#020617',
                      ...itemSpanStyle
                    }}
                  >
                    {isVideo ? (
                      <ContinuousCoverVideo
                        src={item.url}
                        controls={false}
                        autoPlay={true}
                        loop={true}
                        muted={studioMuted}
                        playsInline={true}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title || `Tile ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    )}

                    {item.tag && (
                      <span style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        background: 'rgba(0, 0, 0, 0.75)',
                        color: '#38bdf8',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}>
                        {item.tag}
                      </span>
                    )}

                    {item.title && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '4px 8px',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                        color: '#ffffff',
                        fontSize: '10.5px',
                        fontWeight: 700
                      }}>
                        {item.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '6px'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>
                  {ad.headline || 'Featured Multi-Media Showcase'}
                </div>
                {ad.description && (
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {ad.description}
                  </div>
                )}
              </div>
              <div style={{
                background: '#10b981',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                {ad.ctaText || 'Explore ↗'}
              </div>
            </div>
          </div>
        ) : ad.contentType === 'video' && ad.content ? (
          /* 1. EMBEDDED ONLINE VIDEO BANNER */
          <div style={{ borderRadius: '8px', overflow: 'hidden', background: '#000000', border: '1px solid rgba(255,255,255,0.1)' }}>
            {videoEmbed ? (
              <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
                <iframe
                  ref={studioIframeRef}
                  src={videoEmbed}
                  title={ad.label || 'Video Ad'}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '145%',
                    height: '145%',
                    transform: 'translate(-50%, -50%)',
                    border: 'none',
                    display: 'block',
                    pointerEvents: 'none'
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ) : (
              <div style={{ width: '100%', height: '240px' }}>
                <ContinuousCoverVideo
                  src={ad.content}
                  controls={false}
                  autoPlay={true}
                  loop={true}
                  muted={studioMuted}
                  playsInline={true}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>
            )}

            {/* Video Footer Banner with Info & Click Redirection Badge */}
            <div style={{
              padding: '10px 14px',
              background: 'rgba(15, 23, 42, 0.95)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>
                  {ad.headline || 'Sponsored Video Commercial'}
                </div>
                {ad.description && (
                  <div style={{ fontSize: '11px', color: '#94a3b8', maxWidth: '420px' }}>
                    {ad.description}
                  </div>
                )}
              </div>

              {targetLink && (
                <div style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                }}>
                  <Play size={11} fill="#fff" />
                  <span>{ad.ctaText || 'Visit Sponsor ↗'}</span>
                </div>
              )}
            </div>
          </div>
        ) : ad.contentType === 'image' && ad.content ? (
          /* 2. EMBEDDED ONLINE IMAGE BANNER */
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
          /* 3. CUSTOM HTML EMBED */
          <div
            dangerouslySetInnerHTML={{ __html: ad.content }}
            style={{ borderRadius: '6px', overflow: 'hidden', padding: '10px', background: 'rgba(0,0,0,0.4)' }}
          />
        ) : (
          /* 4. INTERACTIVE BANNER SLOT CONTAINER */
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

  // Sub-renderer: Droppable Insertion Target Line with 1-Click Placement
  function renderDropZoneSlot(zoneId, zone) {
    const isDragOver = dragOverZoneId === zoneId;
    const currentAdTarget = currentAd;
    const isCurrentAdHere = currentAdTarget && currentAdTarget.dropZoneId === zoneId;

    return (
      <div
        key={zoneId}
        onDragOver={(e) => handleDragOver(e, zoneId)}
        onDragLeave={(e) => handleDragLeave(e, zoneId)}
        onDrop={(e) => handleDrop(e, zone || { id: zoneId, type: 'after_paragraph', value: '2', order: 2 })}
        style={{
          margin: '10px 0',
          padding: isDragOver ? '16px 14px' : '8px 14px',
          border: isDragOver ? '2px dashed #a855f7' : '1.5px dashed rgba(168, 85, 247, 0.25)',
          borderRadius: '8px',
          background: isDragOver ? 'rgba(168, 85, 247, 0.22)' : 'rgba(168, 85, 247, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          transition: 'all 0.15s ease'
        }}
        title="Drop or place advertisement here"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '11.5px',
            fontWeight: isDragOver ? 800 : 700,
            color: isDragOver ? '#c084fc' : '#a855f7'
          }}>
            📍 {zone?.label || zoneId}
          </span>
        </div>

        {currentAdTarget && !isCurrentAdHere && (
          <button
            type="button"
            onClick={() => {
              const targetZone = zone || dropZones.find(z => z.id === zoneId);
              const updated = adPlacements.map(a => a.id === currentAdTarget.id ? {
                ...a,
                dropZoneId: zoneId,
                placementType: targetZone?.type || 'after_paragraph',
                placementValue: targetZone?.value || '2',
                sortOrder: targetZone?.order || 2
              } : a);
              updateAdPlacements(updated);
            }}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
            }}
          >
            <Plus size={12} />
            <span>Place "{currentAdTarget.label || 'Active Ad'}" Here</span>
          </button>
        )}
      </div>
    );
  }
}
