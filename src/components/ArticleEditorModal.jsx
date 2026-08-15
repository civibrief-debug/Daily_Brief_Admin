"use client";

import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { useAdmin } from '../context/AdminContext';
import { sanitizeArticleHtml } from '../lib/sanitizer';
import { parseVideoUrl, parseMediaUrl } from '../lib/videoUtils';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Table as TableIcon, 
  Quote, 
  Highlighter, 
  Palette, 
  Subscript as SubIcon, 
  Superscript as SuperIcon, 
  Type, 
  Minus, 
  RemoveFormatting, 
  Heading1, 
  Heading2, 
  Heading3,
  ChevronDown,
  Monitor,
  Search,
  Globe,
  MessageSquare,
  Edit3,
  Copy,
  Clipboard,
  Paintbrush,
  Eye,
  Video,
  Film,
  Play,
  Trash2
} from 'lucide-react';

import { categorySubSectionsMap } from './AdminUserModal';

export default function ArticleEditorModal({ isOpen, onClose, articleToEdit = null }) {
  const { 
    currentUser, 
    addArticle, 
    updateArticle, 
    submitArticleForReview, 
    requestChangesOnArticle, 
    addArticleComment,
    markArticleCommentsRead,
    fetchArticleComments,
    approveArticleByEditor 
  } = useAdmin();

  const allCategories = [
    'Tech & AI',
    'Global Affairs',
    'Markets & Economy',
    'Science & Climate',
    'Movies',
    'Lifestyle',
    'Sports',
    'Opinion & Essays',
    'Culture & Design',
    'Deep Dives 💎'
  ];

  const isSuperAdmin = currentUser?.roleId === 'super_admin';
  const isEditor = currentUser?.roleId === 'editor';
  const userScope = currentUser?.categoryScope || ['All Categories'];
  
  const allowedCategories = isSuperAdmin || userScope.includes('All Categories')
    ? allCategories
    : allCategories.filter(cat => userScope.includes(cat));

  const [selectedImageNode, setSelectedImageNode] = useState(null);
  const [imageBounds, setImageBounds] = useState(null);
  const [showLayoutOptions, setShowLayoutOptions] = useState(false);
  const [showPictureStylesDropdown, setShowPictureStylesDropdown] = useState(false);
  const [currentAppliedStyle, setCurrentAppliedStyle] = useState('none');
  const [hoveredStyleTitle, setHoveredStyleTitle] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackInputText, setFeedbackInputText] = useState('');
  const [commentInputText, setCommentInputText] = useState('');
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const commentsEndRef = useRef(null);

  // 28 MS Word Picture Styles (Exact Match to User Images 1 & 2!)
  const pictureStylesList = [
    // Row 1
    { id: 'simple_frame_white', name: 'Simple Frame, White — Thin white border.', row: 1, border: '2px solid #ffffff', radius: '1px' },
    { id: 'beveled_matte_white', name: 'Beveled Matte, White — Thick white border with a soft inner shadow.', row: 1, border: '3px solid #f8fafc', radius: '2px', shadow: '0 2px 4px rgba(0,0,0,0.5)' },
    { id: 'metal_frame', name: 'Metal Frame — Sleek grey metallic-looking frame.', row: 1, border: '2px solid #94a3b8', radius: '2px' },
    { id: 'drop_shadow_rect', name: 'Drop Shadow Rectangle — Standard shape with a distinct dark drop shadow.', row: 1, radius: '2px', shadow: '3px 3px 6px rgba(0,0,0,0.8)' },
    { id: 'reflected_rounded_rect', name: 'Reflected Rounded Rectangle — Smooth corners with a mirror reflection.', row: 1, radius: '4px', shadow: '0 4px 10px rgba(56,189,248,0.5)' },
    { id: 'soft_edge_rect', name: 'Soft Edge Rectangle — Faded, transparent outer edges.', row: 1, radius: '6px' },
    { id: 'double_frame_black', name: 'Double Frame, Black — Double-lined black thin border.', row: 1, border: '2px double #000000', radius: '1px' },

    // Row 2
    { id: 'thick_matte_black', name: 'Thick Matte, Black — Solid, thick matte black frame.', row: 2, border: '4px solid #000000', radius: '2px' },
    { id: 'simple_frame_black', name: 'Simple Frame, Black — Thin, simple black outline.', row: 2, border: '2px solid #000000', radius: '1px' },
    { id: 'beveled_oval_black', name: 'Beveled Oval, Black — Oval cut out with a raised 3D look in black border.', row: 2, border: '3px solid #000000', radius: '50%' },
    { id: 'compound_frame_black', name: 'Compound Frame, Black — Multi-layered heavy black border framework.', row: 2, border: '3px double #000000', radius: '1px', bg: '#ffffff' },
    { id: 'moderate_frame_black', name: 'Moderate Frame, Black — Clean, medium-thickness black border.', row: 2, border: '2.5px solid #000000', radius: '2px' },
    { id: 'center_shadow_rect', name: 'Center Shadow Rectangle — Standard shape with bottom soft shadow.', row: 2, radius: '2px', shadow: '0 4px 8px rgba(0,0,0,0.7)' },
    { id: 'rounded_diagonal_corner_white', name: 'Rounded Diagonal Corner, White — Diagonal corners rounded with white border.', row: 2, border: '2px solid #ffffff', radius: '8px 0px 8px 0px' },

    // Row 3
    { id: 'snip_diagonal_corner_white', name: 'Snip Diagonal Corner, White — Cut/snapped sharp diagonal corners.', row: 3, border: '2px solid #ffffff', clip: 'polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)' },
    { id: 'moderate_frame_white', name: 'Moderate Frame, White — Clean, medium-thickness white border.', row: 3, border: '3px solid #ffffff', radius: '2px' },
    { id: 'rotated_white', name: 'Rotated, White — Slightly tilted to left with prominent white frame.', row: 3, border: '2px solid #ffffff', transform: 'rotate(-4deg)' },
    { id: 'perspective_shadow_white', name: 'Perspective Shadow, White — Angled backward with deep perspective shadow.', row: 3, border: '2px solid #ffffff', shadow: '0 6px 12px rgba(0,0,0,0.7)', transform: 'perspective(200px) rotateX(10deg)' },
    { id: 'relaxed_perspective_shadow_white', name: 'Relaxed Perspective Shadow, White — Mildly tilted back with ground shadow.', row: 3, border: '2px solid #ffffff', shadow: '0 4px 8px rgba(0,0,0,0.5)', transform: 'perspective(200px) rotateX(5deg)' },
    { id: 'soft_edge_oval', name: 'Soft Edge Oval — Circular cut out with feathered edges.', row: 3, radius: '50%', shadow: '0 2px 6px rgba(0,0,0,0.4)' },
    { id: 'bevel_rectangle', name: 'Bevel Rectangle — Inward-sloping raised edges with 3D glass effect.', row: 3, border: '2px solid #94a3b8', shadow: 'inset 1px 1px 2px #fff, inset -1px -1px 2px #000' },

    // Row 4
    { id: 'bevel_perspective', name: 'Bevel Perspective — Tilted 3D canvas floating at an angle with raised bevels.', row: 4, radius: '5px', transform: 'perspective(200px) rotateX(15deg) rotateY(-5deg)', shadow: 'inset 0 1px 3px rgba(255,255,255,0.6), 4px 6px 12px rgba(0,0,0,0.8)' },
    { id: 'reflected_perspective_right', name: 'Reflected Perspective Right — Turned right with full mirror reflection.', row: 4, transform: 'perspective(200px) rotateY(10deg)', shadow: '-4px 4px 10px rgba(56,189,248,0.4)' },
    { id: 'bevel_perspective_left_white', name: 'Bevel Perspective Left, White — Turned left with white accent border.', row: 4, border: '2px solid #ffffff', transform: 'perspective(200px) rotateY(-10deg)' },
    { id: 'reflected_bevel_black', name: 'Reflected Bevel, Black — Subtle 3D look with black accent edge and reflection.', row: 4, border: '2px solid #000000', shadow: '0 4px 10px rgba(0,0,0,0.5)' },
    { id: 'reflected_bevel_white', name: 'Reflected Bevel, White — Subtle 3D look with white accent edge and reflection.', row: 4, border: '2px solid #ffffff', shadow: '0 4px 10px rgba(255,255,255,0.4)' },
    { id: 'metal_rounded_rect', name: 'Metal Rounded Rectangle — Smooth corners bound by dark metallic frame.', row: 4, border: '2.5px solid #64748b', radius: '4px' },
    { id: 'metal_oval', name: 'Metal Oval — Circular shape bound by dark metallic frame.', row: 4, border: '2.5px solid #64748b', radius: '50%' }
  ];

  // Update bounds of selected image / video relative to editor container
  const updateImageBounds = (node = selectedImageNode) => {
    if (!node || !editorRef.current) {
      setImageBounds(null);
      return;
    }
    const mediaEl = (['IMG', 'VIDEO', 'IFRAME'].includes(node.tagName))
      ? node
      : (node.querySelector?.('img, video, iframe, .video-fallback-card, .social-embed-card') || null);

    if (!mediaEl || !document.body.contains(mediaEl)) {
      setImageBounds(null);
      return;
    }
    const nodeRect = mediaEl.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    if (nodeRect.width === 0 || nodeRect.height === 0) {
      setImageBounds(null);
      return;
    }

    // Hide overlay if selected media is scrolled out of the visible editor container bounds
    if (nodeRect.bottom < editorRect.top || nodeRect.top > editorRect.bottom) {
      setImageBounds(null);
      return;
    }

    setImageBounds({
      top: nodeRect.top - editorRect.top,
      left: nodeRect.left - editorRect.left,
      width: nodeRect.width,
      height: nodeRect.height
    });
  };

  useEffect(() => {
    if (!selectedImageNode) return;
    const handleScrollOrResize = () => {
      updateImageBounds(selectedImageNode);
    };
    const ed = editorRef.current;
    if (ed) {
      ed.addEventListener('scroll', handleScrollOrResize, { passive: true });
    }
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    return () => {
      if (ed) ed.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [selectedImageNode]);

  // Dynamic Auto-Height listener for Twitter / X and social embeds
  useEffect(() => {
    const handleEmbedResizeMessage = (e) => {
      if (typeof e.data === 'string' && e.data.includes('twttr')) {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed && parsed['twttr.render']) {
            const tweetHeight = parsed['twttr.render'].height || parsed['twttr.render'].params?.[0]?.height;
            if (tweetHeight && editorRef.current) {
              const twitterIframes = editorRef.current.querySelectorAll('.twitter-card iframe, .twitter-embed-wrapper iframe');
              twitterIframes.forEach(iframe => {
                iframe.style.height = `${tweetHeight + 20}px`;
                iframe.style.minHeight = `${tweetHeight + 20}px`;
              });
              if (selectedImageNode) updateImageBounds(selectedImageNode);
            }
          }
        } catch (err) {}
      }
    };
    window.addEventListener('message', handleEmbedResizeMessage);
    return () => window.removeEventListener('message', handleEmbedResizeMessage);
  }, [selectedImageNode]);

  const handleEditorDragStart = (e) => {
    const target = e.target.closest('figure, img');
    if (target) {
      draggedImageRef.current = target;
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleEditorDragOver = (e) => {
    if (!draggedImageRef.current) return;
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';

    let range;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY);
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      }
    }

    if (range && editorRef.current?.contains(range.startContainer)) {
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      
      // If range rect is 0, fallback to standard offset
      let top = rect.top - editorRect.top + editorRef.current.scrollTop;
      let left = rect.left - editorRect.left + editorRef.current.scrollLeft;
      
      setDropIndicatorPos({ top, left });
    }
  };

  const handleEditorDrop = (e) => {
    if (!draggedImageRef.current) return;
    e.preventDefault();
    setDropIndicatorPos(null);

    let range;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY);
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      }
    }

    if (range && editorRef.current?.contains(range.startContainer)) {
      if (draggedImageRef.current.contains(range.startContainer)) {
        draggedImageRef.current = null;
        return;
      }

      range.insertNode(draggedImageRef.current);
      setSelectedImageNode(draggedImageRef.current);
      updateImageBounds(draggedImageRef.current);
      
      // Save changes after a brief timeout to let DOM settle
      setTimeout(() => {
        setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
      }, 50);
    }
    draggedImageRef.current = null;
  };

  // Helper: find parent block that is NOT the editor root
  const findParentBlock = (el) => {
    let p = el?.closest?.('p, div');
    if (!p || p === editorRef.current || p.classList?.contains('editor-body')) {
      return null;
    }
    return p;
  };


  const isInsidePocket = (targetNode) => {
    if (!targetNode || !editorRef.current) return null;
    let el = targetNode.nodeType === Node.TEXT_NODE ? targetNode.parentElement : targetNode;
    while (el && el !== editorRef.current) {
      if (el.classList?.contains('left-text-slot') || el.classList?.contains('right-text-slot')) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  };

  const placeCaretAt = (element, offset = null) => {
    if (!element || !editorRef.current) return;
    editorRef.current.focus({ preventScroll: true });

    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel) return;

      let targetNode = element;
      while (targetNode && targetNode.nodeType !== Node.TEXT_NODE && targetNode.lastChild) {
        targetNode = targetNode.lastChild;
      }

      if (!targetNode || targetNode.nodeType !== Node.TEXT_NODE) {
        targetNode = document.createTextNode('\u200B');
        element.appendChild(targetNode);
      }

      const range = document.createRange();
      const safeOffset = (offset !== null) ? Math.min(offset, targetNode.textContent?.length || 0) : (targetNode.textContent?.length || 0);
      range.setStart(targetNode, safeOffset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      saveSelection();
    }, 10);
  };

  const handleEditorMouseDown = (e) => {
    // Dismiss floating toolbar on single click only
    if (e.detail === 1) {
      setFloatingTool(prev => ({ ...prev, visible: false }));
      setShowFloatingColorPicker(false);
      setShowFloatingHighlightPicker(false);
      setShowFloatingPicturesMenu(false);
      setShowFloatingVideosMenu(false);
    }

    // 1. Select IMG, VIDEO, IFRAME, or media card ONLY if clicking actual media or figure containing media
    const isDirectMedia = ['IMG', 'VIDEO', 'IFRAME'].includes(e.target?.tagName);
    const mediaWrapper = e.target?.closest?.('figure, .img-wrapper, .video-wrapper, .social-embed-wrapper, .social-embed-card, .video-fallback-card');
    const isFigcaption = !!e.target?.closest?.('figcaption');
    const hasActualMedia = mediaWrapper && (mediaWrapper.querySelector('img, video, iframe, .video-fallback-card') || isDirectMedia);

    if (!isFigcaption && hasActualMedia && editorRef.current?.contains(mediaWrapper || e.target) && (mediaWrapper || e.target) !== editorRef.current) {
      const figTarget = mediaWrapper || e.target;
      setSelectedImageNode(figTarget);
      updateImageBounds(figTarget);
      dismissFloatingTool();

      const isVid = (figTarget.tagName === 'VIDEO' || 
                    figTarget.classList?.contains('video-wrapper') || 
                    figTarget.classList?.contains('youtube-video-wrapper') || 
                    figTarget.classList?.contains('vimeo-video-wrapper') || 
                    figTarget.classList?.contains('direct-video-wrapper')) &&
                    !figTarget.classList?.contains('social-embed-wrapper') &&
                    !figTarget.classList?.contains('social-embed-card');
      
      setActiveTab(isVid ? 'Video Format' : 'Picture Format');
      return;
    }

    // 2. Dismiss image/video resize/layout overlay if clicking canvas or text
    if (e.target && !e.target.closest('.image-layout-popover') && !e.target.closest('.image-resize-handle')) {
      setSelectedImageNode(null);
      setShowLayoutOptions(false);
      setImageBounds(null);
      if (activeTab === 'Video Format' || activeTab === 'Picture Format') {
        setActiveTab('Home');
      }
    }

    // 3. Detect click on <a> hyperlink inside editor
    const linkTarget = e.target?.closest?.('a');
    if (linkTarget && editorRef.current?.contains(linkTarget)) {
      const rect = linkTarget.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      setActiveLinkPopover({
        visible: true,
        top: Math.max(0, rect.top - editorRect.top - 42),
        left: Math.max(10, rect.left - editorRect.left),
        url: linkTarget.getAttribute('href') || '',
        node: linkTarget
      });
      if (e.ctrlKey || e.metaKey) {
        window.open(linkTarget.href, '_blank', 'noopener,noreferrer');
      }
    } else if (e.target && !e.target.closest('.link-action-popover')) {
      setActiveLinkPopover(null);
    }

    // 4. Caret placement for any click on text / paragraph / canvas / empty space
    if (!editorRef.current) return;

    // Helper to get caret range from mouse coordinates
    const getCaretRangeFromClick = (clientX, clientY) => {
      if (document.caretRangeFromPoint) {
        return document.caretRangeFromPoint(clientX, clientY);
      }
      if (document.caretPositionFromPoint) {
        const pos = document.caretPositionFromPoint(clientX, clientY);
        if (pos && pos.offsetNode) {
          const range = document.createRange();
          range.setStart(pos.offsetNode, pos.offset);
          range.collapse(true);
          return range;
        }
      }
      return null;
    };

    // Helper to focus and place caret inside an empty container
    const placeCaretAtEnd = (container) => {
      if (!container || !editorRef.current) return;
      editorRef.current.focus({ preventScroll: true });

      container.style.display = 'block';
      container.style.width = '100%';
      container.style.minHeight = '28px';
      container.style.outline = 'none';

      let targetTextNode = container.firstChild;
      if (!targetTextNode || targetTextNode.nodeType !== Node.TEXT_NODE) {
        container.innerHTML = '';
        targetTextNode = document.createTextNode('\u200B');
        container.appendChild(targetTextNode);
      }

      const sel = window.getSelection();
      if (sel) {
        const range = document.createRange();
        range.setStart(targetTextNode, targetTextNode.textContent.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        saveSelection();
      }
    };

    // If clicked on editor root (blank canvas around or below media)
    if (e.target === editorRef.current) {
      const pointRange = getCaretRangeFromClick(e.clientX, e.clientY);
      if (pointRange && editorRef.current.contains(pointRange.startContainer) && pointRange.startContainer !== editorRef.current) {
        const container = pointRange.startContainer;
        const insideMedia = container.nodeType === Node.ELEMENT_NODE 
          ? container.closest('figure, img, video, iframe') 
          : container.parentElement?.closest('figure, img, video, iframe');
        
        if (!insideMedia) {
          const sel = window.getSelection();
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(pointRange);
            saveSelection();
            return;
          }
        }
      }

      // If clicked below all children or empty canvas
      e.preventDefault();
      editorRef.current.focus({ preventScroll: true });
      const children = Array.from(editorRef.current.children);
      if (children.length === 0) {
        const newP = document.createElement('p');
        newP.className = 'article-continuation-p';
        newP.style.lineHeight = '1.7';
        newP.style.marginBottom = '16px';
        newP.style.minHeight = '28px';
        newP.style.display = 'block';
        newP.style.width = '100%';
        newP.innerHTML = '\u200B';
        editorRef.current.appendChild(newP);
        placeCaretAtEnd(newP);
        return;
      }

      const lastChild = children[children.length - 1];
      const lastRect = lastChild.getBoundingClientRect();
      if (e.clientY > lastRect.bottom) {
        let newP;
        if (lastChild.tagName === 'P' && (lastChild.textContent.trim() === '' || lastChild.textContent === '\u200B')) {
          newP = lastChild;
        } else {
          newP = document.createElement('p');
          newP.className = 'article-continuation-p';
          newP.style.lineHeight = '1.7';
          newP.style.marginTop = '16px';
          newP.style.marginBottom = '16px';
          newP.style.minHeight = '28px';
          newP.style.display = 'block';
          newP.style.width = '100%';
          newP.innerHTML = '\u200B';
          editorRef.current.appendChild(newP);
        }
        placeCaretAtEnd(newP);
        return;
      }
      return;
    }

    // If clicked on a paragraph/div/heading element
    const clickedBlock = e.target?.closest?.('p, div, h1, h2, h3, li, blockquote');
    if (clickedBlock && editorRef.current.contains(clickedBlock) && clickedBlock !== editorRef.current) {
      // If clicked on an empty or placeholder paragraph, focus and insert text caret
      if (clickedBlock.textContent.trim() === '' || clickedBlock.textContent === '\u200B' || clickedBlock.classList.contains('article-continuation-p')) {
        e.preventDefault();
        placeCaretAtEnd(clickedBlock);
        return;
      }

      // For standard clicks anywhere on text:
      // Allow browser native selection and caret placement to operate with exact precision
    }
  };

  // 8-Point Interactive Drag Resizing
  const handleResizeStart = (e, handleDirection) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImageNode) return;

    const media = (['IMG', 'VIDEO', 'IFRAME'].includes(selectedImageNode.tagName))
      ? selectedImageNode
      : (selectedImageNode.querySelector?.('img, video, iframe, .video-fallback-card, .social-embed-card') || selectedImageNode);

    const figure = selectedImageNode.closest('figure, .img-wrapper, .video-wrapper, .social-embed-wrapper') || (selectedImageNode.tagName === 'FIGURE' ? selectedImageNode : selectedImageNode.parentElement);

    // Temporarily disable pointer-events on all iframes so mousemove is NEVER captured or dropped by iframe when shrinking
    const allIframes = document.querySelectorAll('iframe');
    allIframes.forEach(iframe => {
      iframe.style.pointerEvents = 'none';
    });

    const isVideo = media?.tagName === 'IFRAME' || 
                    media?.tagName === 'VIDEO' || 
                    figure?.classList?.contains('video-wrapper') || 
                    figure?.classList?.contains('social-embed-wrapper') || 
                    selectedImageNode?.classList?.contains('video-wrapper');

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = media?.offsetWidth || figure?.offsetWidth || 320;
    const startHeight = media?.offsetHeight || figure?.offsetHeight || (startWidth / (16 / 9));
    const aspectRatio = isVideo ? (16 / 9) : ((startWidth && startHeight && startHeight > 0) ? (startWidth / startHeight) : 1);

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;

      if (handleDirection.includes('e')) {
        newWidth = startWidth + deltaX;
      } else if (handleDirection.includes('w')) {
        newWidth = startWidth - deltaX;
      } else if (handleDirection.includes('s')) {
        newWidth = (startHeight + deltaY) * aspectRatio;
      } else if (handleDirection.includes('n')) {
        newWidth = (startHeight - deltaY) * aspectRatio;
      }

      // Smoothly constrain width between 80px and 1400px
      newWidth = Math.max(80, Math.min(1400, newWidth));

      if (media) {
        media.style.width = '100%';
        media.style.maxWidth = '100%';
        media.style.height = 'auto';
        if (isVideo) {
          media.style.aspectRatio = '16 / 9';
        }
      }

      if (figure) {
        figure.style.width = `${Math.round(newWidth)}px`;
        figure.style.maxWidth = '100%';
        figure.style.height = 'auto';
        const card = figure.querySelector?.('.video-fallback-card, .social-embed-card');
        if (card) {
          card.style.width = '100%';
          card.style.maxWidth = '100%';
          card.style.height = 'auto';
        }
        if (figure.classList.contains('image-center') || figure.style.float === 'none') {
          figure.style.margin = '16px auto';
          figure.style.display = 'block';
        }
      }

      updateImageBounds(selectedImageNode);
    };

    const handleMouseUp = () => {
      // Re-enable pointer events on iframes so video controls and playback work natively
      allIframes.forEach(iframe => {
        iframe.style.pointerEvents = 'auto';
      });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const resizeImage = (sizePercent) => {
    if (!selectedImageNode) return;
    const media = (['IMG', 'VIDEO', 'IFRAME'].includes(selectedImageNode.tagName))
      ? selectedImageNode
      : (selectedImageNode.querySelector?.('img, video, iframe, .video-fallback-card, .social-embed-card') || selectedImageNode);

    const figure = selectedImageNode.closest('figure, .img-wrapper, .video-wrapper, .social-embed-wrapper') || (selectedImageNode.tagName === 'FIGURE' ? selectedImageNode : selectedImageNode.parentElement);

    if (media) {
      media.style.width = '100%';
      media.style.maxWidth = '100%';
      if (media.tagName === 'IFRAME') {
        media.style.aspectRatio = '16/9';
        media.style.height = 'auto';
      } else if (media.tagName !== 'IFRAME') {
        media.style.height = 'auto';
      }
    }

    if (figure) {
      figure.style.width = sizePercent;
      figure.style.maxWidth = '100%';
      const card = figure.querySelector?.('.video-fallback-card, .social-embed-card');
      if (card) {
        card.style.width = '100%';
        card.style.maxWidth = '100%';
      }
      if (figure.classList.contains('image-center') || figure.style.float === 'none') {
        figure.style.margin = '16px auto';
        figure.style.display = 'block';
      }
    }
    updateImageBounds(selectedImageNode);
    setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
  };

  const normalizeEditorMedia = (container = editorRef.current) => {
    if (!container) return;

    // 0. Unwrap any empty figure / img-wrapper / social-embed-wrapper that does NOT contain an actual img, video, or iframe
    const emptyWrappers = container.querySelectorAll('figure, .img-wrapper, .video-wrapper, .social-embed-wrapper, .center-wrap-anchor');
    emptyWrappers.forEach((wrap) => {
      const hasMedia = wrap.querySelector('img, video, iframe, .video-fallback-card, source');
      if (!hasMedia && !['IMG', 'VIDEO', 'IFRAME'].includes(wrap.tagName)) {
        const textContent = wrap.textContent?.trim();
        if (textContent) {
          const p = document.createElement('p');
          p.style.lineHeight = '1.7';
          p.style.marginBottom = '16px';
          while (wrap.firstChild) {
            p.appendChild(wrap.firstChild);
          }
          if (wrap.parentNode) {
            wrap.parentNode.insertBefore(p, wrap);
          }
        }
        wrap.remove();
      }
    });

    // 1. Dismantle all legacy .center-wrap-anchor wrappers
    const anchors = container.querySelectorAll('.center-wrap-anchor');
    anchors.forEach((anchor) => {
      const leftSlot = anchor.querySelector('.left-text-slot');
      const rightSlot = anchor.querySelector('.right-text-slot');
      const figure = anchor.querySelector('figure, .img-wrapper, img');

      let mergedText = '';
      if (leftSlot) {
        mergedText += leftSlot.innerHTML.replace(/\u200B/g, '').trim() + ' ';
        leftSlot.remove();
      }
      if (rightSlot) {
        mergedText += rightSlot.innerHTML.replace(/\u200B/g, '').trim() + ' ';
        rightSlot.remove();
      }

      if (figure && anchor.parentNode) {
        anchor.parentNode.insertBefore(figure, anchor);
        if (mergedText.trim()) {
          const textP = document.createElement('p');
          textP.style.lineHeight = '1.7';
          textP.style.textAlign = 'left';
          textP.style.width = '100%';
          textP.style.display = 'block';
          textP.style.marginTop = '16px';
          textP.innerHTML = mergedText.trim();
          if (figure.nextSibling) {
            anchor.parentNode.insertBefore(textP, figure.nextSibling);
          } else {
            anchor.parentNode.appendChild(textP);
          }
        }
      }
      anchor.remove();
    });

    // 1.5. Unwrap any nested <figure> inside another <figure> and deduplicate captions
    const doubleFigures = container.querySelectorAll('figure figure, .img-wrapper .img-wrapper, .video-wrapper .video-wrapper');
    doubleFigures.forEach((innerFig) => {
      const parentFig = innerFig.closest('figure, .img-wrapper, .video-wrapper');
      if (parentFig && parentFig !== innerFig && parentFig.parentNode) {
        parentFig.parentNode.insertBefore(innerFig, parentFig);
        parentFig.remove();
      }
    });

    // 2. Extract any <figure> nested inside <p> tags to preserve valid HTML5 structure
    const nestedFigures = container.querySelectorAll('p > figure, p > .img-wrapper, p > .video-wrapper');
    nestedFigures.forEach((fig) => {
      const parentP = fig.parentElement;
      if (parentP && parentP.tagName === 'P') {
        const grandParent = parentP.parentElement || container;
        grandParent.insertBefore(fig, parentP);
        if (!parentP.textContent?.trim() && !parentP.querySelector('img, video, iframe')) {
          parentP.remove();
        }
      }
    });

    // 3. Normalize all figures and deduplicate captions
    const figures = container.querySelectorAll('figure, .img-wrapper, .video-wrapper');
    figures.forEach((fig) => {
      // Deduplicate captions inside fig
      const caps = fig.querySelectorAll('figcaption');
      if (caps.length > 1) {
        for (let i = 1; i < caps.length; i++) {
          caps[i].remove();
        }
      }
      const singleCap = fig.querySelector('figcaption');
      if (singleCap) {
        singleCap.style.marginTop = '6px';
        singleCap.style.marginBottom = '0px';
        singleCap.style.padding = '2px 0 0 0';
        singleCap.style.lineHeight = '1.35';
      }

      const isFloatLeft = fig.style.float === 'left';
      const isFloatRight = fig.style.float === 'right';

      if (!isFloatLeft && !isFloatRight) {
        fig.classList.add('image-center');
        fig.style.float = 'none';
        fig.style.clear = 'both';
        fig.style.display = 'block';
        if (!fig.style.width) {
          fig.style.width = '100%';
        }
        fig.style.maxWidth = '100%';
        fig.style.margin = '16px auto';
        fig.style.textAlign = 'center';

        const innerMedia = fig.querySelector('img, video, iframe') || fig;
        if (innerMedia && innerMedia.style) {
          innerMedia.style.maxWidth = '100%';
          innerMedia.style.height = 'auto';
          innerMedia.style.display = 'block';
          innerMedia.style.margin = '0 auto';
          innerMedia.style.float = 'none';
        }

        const parentBlock = fig.parentElement;
        if (parentBlock && parentBlock !== container && parentBlock.tagName === 'P') {
          const nodesBefore = [];
          let curr = parentBlock.firstChild;
          while (curr && curr !== fig) {
            nodesBefore.push(curr);
            curr = curr.nextSibling;
          }

          const nodesAfter = [];
          if (curr === fig) {
            curr = fig.nextSibling;
            while (curr) {
              nodesAfter.push(curr);
              curr = curr.nextSibling;
            }
          }

          const rootTarget = parentBlock.parentNode || container;

          if (nodesBefore.length > 0) {
            const aboveP = document.createElement('p');
            aboveP.style.lineHeight = '1.7';
            aboveP.style.textAlign = 'left';
            aboveP.style.width = '100%';
            aboveP.style.display = 'block';
            aboveP.style.marginBottom = '16px';
            nodesBefore.forEach(n => aboveP.appendChild(n));
            rootTarget.insertBefore(aboveP, parentBlock);
          }

          if (nodesAfter.length > 0) {
            const belowP = document.createElement('p');
            belowP.style.lineHeight = '1.7';
            belowP.style.textAlign = 'left';
            belowP.style.width = '100%';
            belowP.style.display = 'block';
            belowP.style.marginTop = '16px';
            nodesAfter.forEach(n => belowP.appendChild(n));
            if (parentBlock.nextSibling) {
              rootTarget.insertBefore(belowP, parentBlock.nextSibling);
            } else {
              rootTarget.appendChild(belowP);
            }
          }

          rootTarget.insertBefore(fig, parentBlock);
          parentBlock.remove();
        }
      }
    });

    // 4. Guarantee an editable continuation paragraph after any trailing figure or figure sequence
    const allFigures = container.querySelectorAll('figure, .img-wrapper, .video-wrapper');
    allFigures.forEach((fig) => {
      let next = fig.nextElementSibling;
      if (!next || next.tagName === 'FIGURE' || next.classList.contains('img-wrapper') || next.classList.contains('video-wrapper')) {
        const continuationP = document.createElement('p');
        continuationP.className = 'article-continuation-p';
        continuationP.style.lineHeight = '1.7';
        continuationP.style.marginTop = '16px';
        continuationP.style.marginBottom = '16px';
        continuationP.style.textAlign = 'left';
        continuationP.style.width = '100%';
        continuationP.style.display = 'block';
        continuationP.style.minHeight = '28px';
        continuationP.style.outline = 'none';
        continuationP.innerHTML = '\u200B';
        if (fig.nextSibling) {
          fig.parentNode.insertBefore(continuationP, fig.nextSibling);
        } else {
          fig.parentNode.appendChild(continuationP);
        }
      }
    });

    normalizeEditorLinks(container);
  };

  const alignImage = (alignment) => {
    if (!selectedImageNode) return;
    const figure = selectedImageNode.closest('figure, .img-wrapper, .video-wrapper') || (selectedImageNode.tagName === 'FIGURE' ? selectedImageNode : selectedImageNode.parentElement);
    if (figure) {
      // If figure is nested inside a text slot of another image, safely extract figure out of the slot first
      const insideSlot = figure.closest('.left-text-slot, .right-text-slot');
      if (insideSlot) {
        const parentAnchor = insideSlot.closest('.center-wrap-anchor');
        if (parentAnchor && parentAnchor.parentElement) {
          parentAnchor.parentElement.insertBefore(figure, parentAnchor.nextSibling);
        }
      }

      let parentBlock = figure.parentElement;
      const anchor = figure.closest('.center-wrap-anchor');
      const isCenteredAnchor = anchor !== null && figure.parentElement === anchor;
      
      if (isCenteredAnchor) {
        // Collect text content from the slots
        const oldLeft = anchor.querySelector('.left-text-slot');
        const oldRight = anchor.querySelector('.right-text-slot');
        let mergedHTML = '';
        if (oldLeft) { mergedHTML += oldLeft.innerHTML.replace(/\u200B/g, ''); }
        if (oldRight) { mergedHTML += oldRight.innerHTML.replace(/\u200B/g, ''); }
        
        // Remove spacers/slots
        anchor.querySelectorAll('.center-float-spacer-left, .center-float-spacer-right, .left-text-slot, .right-text-slot').forEach(s => s.remove());
        
        // Move figure out of anchor
        if (anchor.parentElement) {
          anchor.parentElement.insertBefore(figure, anchor);
        }
        
        // Insert merged text back into the document before the figure
        if (mergedHTML.trim() && figure.parentElement) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = mergedHTML.trim();
          while (tempDiv.firstChild) {
            figure.parentElement.insertBefore(tempDiv.firstChild, figure);
          }
        }
        
        anchor.remove();
        
        // Reset figure positioning
        figure.style.position = 'static';
        figure.style.transform = 'none';
        figure.style.top = 'auto';
        figure.style.left = 'auto';
        figure.style.margin = '0';
        figure.style.zIndex = '';
        figure.style.pointerEvents = 'auto';
        
        parentBlock = figure.parentElement;
      }

      const setupFloatBlock = (fig, align) => {
        fig.classList.remove('image-center');
        fig.style.setProperty('float', align, 'important');
        fig.style.setProperty('clear', 'none', 'important');
        fig.style.display = 'block';
        fig.style.margin = align === 'left' ? '12px 24px 12px 0' : '12px 0 12px 24px';
        fig.style.height = 'auto';
        fig.style.minHeight = '0';

        if (!fig.style.width || fig.style.width === '100%') {
          fig.style.width = '50%';
        }
        fig.style.maxWidth = '100%';

        const innerMedia = fig.querySelector('img, video, iframe, .video-fallback-card, .social-embed-card') || fig;
        if (innerMedia && innerMedia.style) {
          innerMedia.style.width = '100%';
          innerMedia.style.maxWidth = '100%';
          innerMedia.style.height = 'auto';
          innerMedia.style.minHeight = '0';
          if (innerMedia.tagName === 'IFRAME' || innerMedia.tagName === 'VIDEO') {
            innerMedia.style.aspectRatio = '16 / 9';
          }
          innerMedia.style.display = 'block';
          innerMedia.style.margin = '0';
          innerMedia.style.float = 'none';
        }

        const figcap = fig.querySelector('figcaption');
        if (figcap) {
          figcap.style.marginTop = '6px';
          figcap.style.marginBottom = '0px';
          figcap.style.padding = '2px 0 0 0';
          figcap.style.display = 'block';
          figcap.style.width = '100%';
          figcap.style.lineHeight = '1.35';
          figcap.style.textAlign = 'center';
        }

        // Ensure figure is extracted from inside any <p> tag to prevent invalid HTML nesting
        let parentBlockNode = fig.parentElement;
        if (parentBlockNode && parentBlockNode.tagName === 'P') {
          const grandParent = parentBlockNode.parentElement || editorRef.current;
          if (grandParent) {
            grandParent.insertBefore(fig, parentBlockNode);
          }
        }
      };

      // Detect and Dismantle Flex Layout if transitioning from center with side text pockets
      if (parentBlock && parentBlock.style.display === 'flex' && (parentBlock.querySelector('.left-text-slot') || parentBlock.querySelector('.right-text-slot'))) {
        let mergedHTML = '';

        // Extract left pocket text
        const leftSlot = parentBlock.querySelector('.left-text-slot');
        if (leftSlot) {
          const content = leftSlot.innerHTML.replace(/\u200B/g, '').trim();
          if (content && content !== '<br>') mergedHTML += content + ' ';
          leftSlot.remove();
        }

        // Extract right pocket text
        const rightSlot = parentBlock.querySelector('.right-text-slot');
        if (rightSlot) {
          const content = rightSlot.innerHTML.replace(/\u200B/g, '').trim();
          if (content && content !== '<br>') mergedHTML += content + ' ';
          rightSlot.remove();
        }

        // Reset Parent Styles
        parentBlock.style.display = 'block';
        parentBlock.style.alignItems = '';
        parentBlock.style.justifyContent = '';
        parentBlock.style.width = '';
        parentBlock.style.textAlign = 'left';

        // Reset Figure Flex Styles
        figure.style.flex = '';

        // Merge text nodes sequentially after figure
        let lastNode = null;
        if (mergedHTML.trim()) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = mergedHTML.trim();
          
          let insertRef = figure.nextSibling;
          while (tempDiv.firstChild) {
             const node = tempDiv.firstChild;
             parentBlock.insertBefore(node, insertRef);
             lastNode = node;
          }
        }
        
        // Caret restoration
        setTimeout(() => {
          try {
            if (lastNode && editorRef.current && lastNode.parentNode && document.body.contains(lastNode)) {
              editorRef.current.focus({ preventScroll: true });
              const sel = window.getSelection();
              if (sel) {
                const range = document.createRange();
                let targetNode = lastNode;
                while (targetNode && targetNode.lastChild) {
                    targetNode = targetNode.lastChild;
                }
                if (targetNode && targetNode.parentNode) {
                  if (targetNode.nodeType === Node.TEXT_NODE) {
                      range.setStart(targetNode, targetNode.length);
                  } else {
                      range.setStartAfter(targetNode);
                  }
                  range.collapse(true);
                  sel.removeAllRanges();
                  sel.addRange(range);
                  if (typeof saveSelection === 'function') {
                    saveSelection();
                  }
                }
              }
            }
          } catch (e) {
            console.warn('Caret restoration skipped:', e);
          }
        }, 10);
      }



      if (alignment === 'left') {
        setupFloatBlock(figure, 'left');
      } else if (alignment === 'right') {
        setupFloatBlock(figure, 'right');
      } else if (alignment === 'center' || alignment === 'center_wrap') {
        // ── Block-Level Centered Image Layout (Dedicated Row with clear: both & DOM Normalization) ──
        
        let containerBlock = figure.parentElement;

        // Clean up any old flex/pocket layout elements
        if (containerBlock) {
          const oldLeft = containerBlock.querySelector('.left-text-slot');
          const oldRight = containerBlock.querySelector('.right-text-slot');
          let mergedHTML = '';
          if (oldLeft) { mergedHTML += oldLeft.innerHTML.replace(/\u200B/g, '').trim() + ' '; oldLeft.remove(); }
          if (oldRight) { mergedHTML += oldRight.innerHTML.replace(/\u200B/g, '').trim() + ' '; oldRight.remove(); }

          containerBlock.classList.remove('center-wrap-anchor');
          containerBlock.removeAttribute('contenteditable');

          if (mergedHTML.trim()) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = mergedHTML.trim();
            let insertRef = figure.nextSibling;
            while (tempDiv.firstChild) {
              containerBlock.insertBefore(tempDiv.firstChild, insertRef);
            }
          }
        }

        // DOM Normalization: Extract text before figure into aboveP and text after figure into belowP
        if (containerBlock && containerBlock !== editorRef.current) {
          const nodesBefore = [];
          let curr = containerBlock.firstChild;
          while (curr && curr !== figure) {
            nodesBefore.push(curr);
            curr = curr.nextSibling;
          }

          const nodesAfter = [];
          if (curr === figure) {
            curr = figure.nextSibling;
            while (curr) {
              nodesAfter.push(curr);
              curr = curr.nextSibling;
            }
          }

          const rootTarget = containerBlock.parentNode || editorRef.current;

          // Insert text before figure as its own paragraph
          if (nodesBefore.length > 0) {
            const aboveP = document.createElement('p');
            aboveP.style.lineHeight = '1.7';
            aboveP.style.textAlign = 'left';
            aboveP.style.width = '100%';
            aboveP.style.display = 'block';
            aboveP.style.marginBottom = '16px';
            nodesBefore.forEach(n => aboveP.appendChild(n));
            rootTarget.insertBefore(aboveP, containerBlock);
          }

          // Insert text after figure as its own paragraph
          if (nodesAfter.length > 0) {
            const belowP = document.createElement('p');
            belowP.style.lineHeight = '1.7';
            belowP.style.textAlign = 'left';
            belowP.style.width = '100%';
            belowP.style.display = 'block';
            belowP.style.marginTop = '16px';
            nodesAfter.forEach(n => belowP.appendChild(n));
            if (containerBlock.nextSibling) {
              rootTarget.insertBefore(belowP, containerBlock.nextSibling);
            } else {
              rootTarget.appendChild(belowP);
            }
          }

          // Move figure out of containerBlock to root level
          rootTarget.insertBefore(figure, containerBlock);
          containerBlock.remove();
        }

        // Apply strict block-level styles and image-center class to figure wrapper
        figure.classList.add('image-center');
        figure.style.float = 'none';
        figure.style.clear = 'both';
        figure.style.display = 'block';
        if (!figure.style.width) {
          figure.style.width = '100%';
        }
        figure.style.maxWidth = '100%';
        figure.style.margin = '16px auto';
        figure.style.textAlign = 'center';
        figure.style.position = 'relative';
        figure.style.flex = '';
        figure.style.order = '';

        const innerImg = figure.querySelector('img, video, iframe') || figure;
        if (innerImg && innerImg.style) {
          innerImg.style.maxWidth = '100%';
          innerImg.style.width = '100%';
          if (innerImg.tagName !== 'IFRAME') {
            innerImg.style.height = 'auto';
          }
          innerImg.style.display = 'block';
          innerImg.style.margin = '0 auto';
          innerImg.style.float = 'none';
        }

        if (figure.parentElement && figure.parentElement !== editorRef.current) {
          figure.parentElement.style.textAlign = 'center';
        }

        // Ensure clean paragraph ABOVE figure if needed
        let prevSibling = figure.previousElementSibling;
        if (!prevSibling || prevSibling.querySelector?.('img, video, iframe')) {
          const aboveP = document.createElement('p');
          aboveP.style.lineHeight = '1.7';
          aboveP.style.textAlign = 'left';
          aboveP.style.maxWidth = '100%';
          aboveP.style.display = 'block';
          aboveP.style.minHeight = '28px';
          aboveP.style.outline = 'none';
          aboveP.style.marginBottom = '16px';
          aboveP.innerHTML = '\u200B';
          if (figure.parentNode) {
            figure.parentNode.insertBefore(aboveP, figure);
          }
        }

        // Ensure clean paragraph BELOW figure if needed
        let nextSibling = figure.nextElementSibling;
        if (!nextSibling || nextSibling.querySelector?.('img, video, iframe')) {
          const belowP = document.createElement('p');
          belowP.style.lineHeight = '1.7';
          belowP.style.textAlign = 'left';
          belowP.style.maxWidth = '100%';
          belowP.style.display = 'block';
          belowP.style.minHeight = '28px';
          belowP.style.outline = 'none';
          belowP.style.marginTop = '16px';
          belowP.innerHTML = '\u200B';
          if (figure.nextSibling) {
            figure.parentNode.insertBefore(belowP, figure.nextSibling);
          } else if (figure.parentNode) {
            figure.parentNode.appendChild(belowP);
          }
        }
      }
    }
    updateImageBounds(selectedImageNode);
  };

  const addOrEditCaption = () => {
    if (!selectedImageNode) return;
    const figure = selectedImageNode.closest('figure, .img-wrapper, .video-wrapper, .social-embed-wrapper') || (selectedImageNode.tagName === 'FIGURE' ? selectedImageNode : selectedImageNode.parentElement);
    if (!figure) return;

    figure.style.height = 'auto';
    figure.style.minHeight = '0';

    let figcaption = figure.querySelector('figcaption');
    let isNew = false;
    if (!figcaption) {
      isNew = true;
      figcaption = document.createElement('figcaption');
      figcaption.style.fontSize = '13px';
      figcaption.style.color = '#94a3b8';
      figcaption.style.fontStyle = 'italic';
      figcaption.style.textAlign = 'center';
      figcaption.style.marginTop = '6px';
      figcaption.style.marginBottom = '0px';
      figcaption.style.padding = '2px 0 0 0';
      figcaption.style.lineHeight = '1.35';
      figcaption.style.display = 'block';
      figcaption.style.width = '100%';
      figcaption.contentEditable = 'true';
      figcaption.textContent = 'Type caption here...';
      figure.appendChild(figcaption);
    } else {
      figcaption.contentEditable = 'true';
      figcaption.style.marginTop = '6px';
      figcaption.style.marginBottom = '0px';
      figcaption.style.padding = '2px 0 0 0';
      figcaption.style.lineHeight = '1.35';
      figcaption.style.display = 'block';
      figcaption.style.width = '100%';
    }
    
    setTimeout(() => {
      figcaption.focus({ preventScroll: true });
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(figcaption);
        if (!isNew) {
          range.collapse(false); // Place cursor at the end if editing existing caption
        }
        selection.removeAllRanges();
        selection.addRange(range);
      }
      updateImageBounds(selectedImageNode);
    }, 10);
  };

  const applyImageStyle = (id) => {
    if (!selectedImageNode) return;

    // Reset baseline properties
    selectedImageNode.style.transform = 'none';
    selectedImageNode.style.filter = 'none';
    selectedImageNode.style.objectFit = 'initial';
    selectedImageNode.style.padding = '0';
    selectedImageNode.style.background = 'transparent';
    selectedImageNode.style.borderRadius = '0px';
    selectedImageNode.style.border = 'none';
    selectedImageNode.style.boxShadow = 'none';
    selectedImageNode.style.clipPath = 'none';

    switch (id) {
      // Row 1
      case 'simple_frame_white':
        selectedImageNode.style.border = '6px solid #ffffff';
        selectedImageNode.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        break;
      case 'beveled_matte_white':
        selectedImageNode.style.border = '10px solid #ffffff';
        selectedImageNode.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.5), 0 10px 24px rgba(0,0,0,0.6)';
        break;
      case 'metal_frame':
        selectedImageNode.style.border = '6px solid #94a3b8';
        selectedImageNode.style.boxShadow = '0 6px 18px rgba(0,0,0,0.5)';
        break;
      case 'drop_shadow_rect':
        selectedImageNode.style.boxShadow = '14px 16px 28px rgba(0,0,0,0.7)';
        break;
      case 'reflected_rounded_rect':
        selectedImageNode.style.borderRadius = '12px';
        selectedImageNode.style.boxShadow = '0 12px 24px rgba(0,0,0,0.5), 0 26px 36px -8px rgba(56,189,248,0.4)';
        break;
      case 'soft_edge_rect':
        selectedImageNode.style.borderRadius = '16px';
        selectedImageNode.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
        break;
      case 'double_frame_black':
        selectedImageNode.style.border = '4px double #0f172a';
        selectedImageNode.style.padding = '4px';
        selectedImageNode.style.background = '#ffffff';
        break;

      // Row 2
      case 'thick_matte_black':
        selectedImageNode.style.border = '12px solid #090d16';
        selectedImageNode.style.boxShadow = '0 10px 25px rgba(0,0,0,0.7)';
        break;
      case 'simple_frame_black':
        selectedImageNode.style.border = '4px solid #0f172a';
        selectedImageNode.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        break;
      case 'beveled_oval_black':
        selectedImageNode.style.borderRadius = '50%';
        selectedImageNode.style.objectFit = 'cover';
        selectedImageNode.style.border = '8px solid #0f172a';
        selectedImageNode.style.boxShadow = 'inset 0 0 10px rgba(255,255,255,0.4), 0 10px 24px rgba(0,0,0,0.6)';
        break;
      case 'compound_frame_black':
        selectedImageNode.style.border = '8px double #000000';
        selectedImageNode.style.padding = '6px';
        selectedImageNode.style.background = '#ffffff';
        break;
      case 'moderate_frame_black':
        selectedImageNode.style.border = '6px solid #1e293b';
        selectedImageNode.style.boxShadow = '0 6px 16px rgba(0,0,0,0.5)';
        break;
      case 'center_shadow_rect':
        selectedImageNode.style.boxShadow = '0 16px 28px -4px rgba(0,0,0,0.85)';
        break;
      case 'rounded_diagonal_corner_white':
        selectedImageNode.style.border = '6px solid #ffffff';
        selectedImageNode.style.borderRadius = '28px 0px 28px 0px';
        selectedImageNode.style.boxShadow = '0 6px 18px rgba(0,0,0,0.4)';
        break;

      // Row 3
      case 'snip_diagonal_corner_white':
        selectedImageNode.style.border = '6px solid #ffffff';
        selectedImageNode.style.clipPath = 'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)';
        selectedImageNode.style.boxShadow = '0 6px 18px rgba(0,0,0,0.4)';
        break;
      case 'moderate_frame_white':
        selectedImageNode.style.border = '6px solid #ffffff';
        selectedImageNode.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        break;
      case 'rotated_white':
        selectedImageNode.style.transform = 'rotate(-3.5deg)';
        selectedImageNode.style.border = '8px solid #ffffff';
        selectedImageNode.style.boxShadow = '0 12px 28px rgba(0,0,0,0.6)';
        break;
      case 'perspective_shadow_white':
        selectedImageNode.style.transform = 'perspective(500px) rotateX(15deg)';
        selectedImageNode.style.border = '6px solid #ffffff';
        selectedImageNode.style.boxShadow = '0 20px 30px rgba(0,0,0,0.7)';
        break;
      case 'relaxed_perspective_shadow_white':
        selectedImageNode.style.transform = 'perspective(600px) rotateX(8deg)';
        selectedImageNode.style.border = '5px solid #ffffff';
        selectedImageNode.style.boxShadow = '0 14px 20px rgba(0,0,0,0.5)';
        break;
      case 'soft_edge_oval':
        selectedImageNode.style.borderRadius = '50%';
        selectedImageNode.style.objectFit = 'cover';
        selectedImageNode.style.boxShadow = '0 10px 24px rgba(0,0,0,0.5)';
        break;
      case 'bevel_rectangle':
        selectedImageNode.style.border = '5px solid #cbd5e1';
        selectedImageNode.style.boxShadow = 'inset 2px 2px 5px #ffffff, inset -2px -2px 5px #000000, 0 8px 18px rgba(0,0,0,0.4)';
        break;

      // Row 4
      case 'bevel_perspective':
        selectedImageNode.style.borderRadius = '24px';
        selectedImageNode.style.transform = 'perspective(900px) rotateX(22deg) rotateY(-6deg) scale(0.96)';
        selectedImageNode.style.border = '1px solid rgba(255,255,255,0.3)';
        selectedImageNode.style.boxShadow = 'inset 0 3px 8px rgba(255,255,255,0.5), inset 0 -6px 14px rgba(0,0,0,0.85), 0 24px 45px rgba(0,0,0,0.9)';
        break;
      case 'reflected_perspective_right':
        selectedImageNode.style.transform = 'perspective(600px) rotateY(14deg)';
        selectedImageNode.style.boxShadow = '-16px 16px 32px rgba(0,0,0,0.7), 0 25px 25px -10px rgba(56,189,248,0.4)';
        break;
      case 'bevel_perspective_left_white':
        selectedImageNode.style.transform = 'perspective(600px) rotateY(-14deg)';
        selectedImageNode.style.border = '6px solid #ffffff';
        selectedImageNode.style.boxShadow = '16px 16px 32px rgba(0,0,0,0.7)';
        break;
      case 'reflected_bevel_black':
        selectedImageNode.style.border = '3px solid #0f172a';
        selectedImageNode.style.boxShadow = '0 12px 24px rgba(0,0,0,0.6), 0 24px 28px -10px rgba(15,23,42,0.5)';
        break;
      case 'reflected_bevel_white':
        selectedImageNode.style.border = '3px solid #ffffff';
        selectedImageNode.style.boxShadow = '0 12px 24px rgba(0,0,0,0.5), 0 24px 28px -10px rgba(255,255,255,0.4)';
        break;
      case 'metal_rounded_rect':
        selectedImageNode.style.borderRadius = '14px';
        selectedImageNode.style.border = '6px solid #475569';
        selectedImageNode.style.boxShadow = '0 8px 20px rgba(0,0,0,0.5)';
        break;
      case 'metal_oval':
        selectedImageNode.style.borderRadius = '50%';
        selectedImageNode.style.objectFit = 'cover';
        selectedImageNode.style.border = '6px solid #475569';
        selectedImageNode.style.boxShadow = '0 8px 20px rgba(0,0,0,0.5)';
        break;
      default:
        break;
    }
    updateImageBounds(selectedImageNode);
  };

  const removeSelectedMedia = () => {
    if (!selectedImageNode) return;
    const figure = selectedImageNode.closest('figure, .img-wrapper, .video-wrapper, .video-fallback-card, .center-wrap-anchor') || 
                   (selectedImageNode.tagName === 'FIGURE' ? selectedImageNode : selectedImageNode.parentElement);
    
    // Find adjacent element to restore cursor placement
    let restoreTarget = figure?.nextElementSibling || figure?.previousElementSibling || editorRef.current?.firstElementChild;

    if (figure && figure !== editorRef.current) {
      figure.remove();
    } else if (selectedImageNode && selectedImageNode !== editorRef.current) {
      selectedImageNode.remove();
    }

    setSelectedImageNode(null);
    setShowLayoutOptions(false);
    setImageBounds(null);
    setActiveTab('Home');

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus({ preventScroll: true });
        if (restoreTarget && document.body.contains(restoreTarget)) {
          const sel = window.getSelection();
          if (sel) {
            const range = document.createRange();
            range.setStart(restoreTarget, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            saveSelection();
          }
        }
        setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
      }
    }, 20);
  };

  const applyVideoStyle = (styleObj) => {
    if (!selectedImageNode) return;
    const mediaEl = selectedImageNode.tagName === 'VIDEO' || selectedImageNode.tagName === 'IFRAME'
      ? selectedImageNode
      : (selectedImageNode.querySelector?.('video, iframe') || selectedImageNode);

    if (mediaEl && styleObj) {
      Object.assign(mediaEl.style, styleObj);
    }
    setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
  };

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    author: 'Staff Reporter',
    status: 'Published',
    summary: '',
    content: '',
    imageUrl: '',
    featured: false
  });

  const [activeTab, setActiveTab] = useState('Home'); // 'Home' | 'Insert' | 'Picture Format'
  const [dropIndicatorPos, setDropIndicatorPos] = useState(null);
  const draggedImageRef = useRef(null);
  const [fontFamily, setFontFamily] = useState('Aptos, sans-serif');
  const [fontSize, setFontSize] = useState('16px');
  const [isFormatPainterActive, setIsFormatPainterActive] = useState(false);
  const [savedStyle, setSavedStyle] = useState(null);
  
  // Pictures, Text Box & Font Family Dropdown & Pickers
  const [showPicturesMenu, setShowPicturesMenu] = useState(false);
  const [showTextBoxMenu, setShowTextBoxMenu] = useState(false);
  const [showFontFamilyMenu, setShowFontFamilyMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  
  // Image Insert Sub-Modals
  const [showStockModal, setShowStockModal] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageCaptionInput, setImageCaptionInput] = useState('');
  const [imageAlignInput, setImageAlignInput] = useState('center');

  // Video Insert Sub-Modals & Dropdown State
  const [showVideosMenu, setShowVideosMenu] = useState(false);
  const [showStockVideoModal, setShowStockVideoModal] = useState(false);
  const [showOnlineVideoModal, setShowOnlineVideoModal] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoCaptionInput, setVideoCaptionInput] = useState('');

  // Link Sub-Modal & Floating Popover State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState('');
  const [linkTextInput, setLinkTextInput] = useState('');
  const [selectedLinkNode, setSelectedLinkNode] = useState(null);
  const [activeLinkPopover, setActiveLinkPopover] = useState(null);
  const [isImageLinkEditing, setIsImageLinkEditing] = useState(false);

  // Selection Floating Toolbar State
  const [floatingTool, setFloatingTool] = useState({ visible: false, top: 0, left: 0 });
  const [showFloatingColorPicker, setShowFloatingColorPicker] = useState(false);
  const [showFloatingHighlightPicker, setShowFloatingHighlightPicker] = useState(false);
  const [showFloatingPicturesMenu, setShowFloatingPicturesMenu] = useState(false);
  const [showFloatingVideosMenu, setShowFloatingVideosMenu] = useState(false);
  const [showFloatingFontFamilyMenu, setShowFloatingFontFamilyMenu] = useState(false);
  const [showFloatingFontSizeMenu, setShowFloatingFontSizeMenu] = useState(false);
  const [showFloatingStylesMenu, setShowFloatingStylesMenu] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const blobUrlsRef = useRef([]);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const headerBannerInputRef = useRef(null);
  const picturesMenuRef = useRef(null);
  const videosMenuRef = useRef(null);
  const textBoxMenuRef = useRef(null);
  const fontFamilyMenuRef = useRef(null);
  const colorPickerRef = useRef(null);
  const highlightPickerRef = useRef(null);
  const selectionTimeoutRef = useRef(null);
  const savedRangeRef = useRef(null);
  const commentsContainerRef = useRef(null);
  const prevCommentsLengthRef = useRef(0);

  // Helper to reliably dismiss the floating text formatting toolbox
  const dismissFloatingTool = () => {
    setFloatingTool(prev => ({ ...prev, visible: false }));
    setShowFloatingColorPicker(false);
    setShowFloatingHighlightPicker(false);
    setShowFloatingPicturesMenu(false);
    setShowFloatingVideosMenu(false);
    setShowFloatingFontFamilyMenu(false);
    setShowFloatingFontSizeMenu(false);
    setShowFloatingStylesMenu(false);
  };

  useEffect(() => {
    setSelectedImageNode(null);
    setImageBounds(null);
    setShowLayoutOptions(false);
    setActiveTab('Home');
    dismissFloatingTool();

    const initialAuthor = isSuperAdmin 
      ? (articleToEdit?.author || currentUser?.name || 'Staff Reporter') 
      : (currentUser?.name || 'Content Admin');

    const initialCategory = articleToEdit?.category && allowedCategories.includes(articleToEdit.category) 
      ? articleToEdit.category 
      : (allowedCategories[0] || 'Technology');

    if (articleToEdit) {
      setFormData({
        id: articleToEdit.id,
        kicker: articleToEdit.kicker || '',
        title: articleToEdit.title || '',
        category: initialCategory,
        subSection: articleToEdit.subSection || '',
        author: initialAuthor,
        status: articleToEdit.status || 'Published',
        summary: articleToEdit.summary || '',
        content: articleToEdit.content || '',
        imageUrl: articleToEdit.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        featured: !!articleToEdit.featured
      });
      if (editorRef.current) {
        editorRef.current.innerHTML = articleToEdit.content || '';
        normalizeEditorMedia(editorRef.current);
      }
    } else {
      setFormData({
        kicker: '',
        title: '',
        category: initialCategory,
        subSection: '',
        author: initialAuthor,
        status: 'Published',
        summary: '',
        content: '',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        featured: false
      });
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    }
  }, [articleToEdit, isOpen, currentUser]);

  // Auto-switch ribbon tab to 'Video Format' or 'Picture Format' when media is selected
  useEffect(() => {
    if (selectedImageNode) {
      // Dismiss floating text toolbox whenever an image, video, or embed is selected
      dismissFloatingTool();

      const isVideo = (selectedImageNode.tagName === 'VIDEO' ||
        selectedImageNode.classList?.contains('video-wrapper') ||
        selectedImageNode.classList?.contains('youtube-video-wrapper') ||
        selectedImageNode.classList?.contains('vimeo-video-wrapper') ||
        selectedImageNode.classList?.contains('direct-video-wrapper')) &&
        !selectedImageNode.classList?.contains('social-embed-wrapper') &&
        !selectedImageNode.classList?.contains('social-embed-card');

      if (isVideo) {
        setActiveTab('Video Format');
      } else {
        setActiveTab('Picture Format');
      }
    } else {
      if (activeTab === 'Picture Format' || activeTab === 'Video Format') {
        setActiveTab('Home');
      }
    }
  }, [selectedImageNode]);

  // Persistent 2-way comments auto-fetch & 8-second polling for real-time discussion thread
  useEffect(() => {
    if (!isOpen || !articleToEdit?.id) return;
    let isMounted = true;

    const loadComments = async () => {
      try {
        if (fetchArticleComments) {
          const comments = await fetchArticleComments(articleToEdit.id);
          if (isMounted && Array.isArray(comments)) {
            setFormData(prev => {
              const prevComments = prev.comments || [];
              if (prevComments.length === comments.length &&
                  JSON.stringify(prevComments.map(c => c.id)) === JSON.stringify(comments.map(c => c.id))) {
                return prev;
              }
              return { ...prev, comments };
            });
          }
        }
        if (markArticleCommentsRead) {
          await markArticleCommentsRead(articleToEdit.id);
        }
      } catch (err) {
        console.warn("Failed to load comments (suppressed):", err?.message || err);
      }
    };

    loadComments().catch(() => {});

    const interval = setInterval(async () => {
      try {
        if (fetchArticleComments && isMounted) {
          const freshComments = await fetchArticleComments(articleToEdit.id);
          if (isMounted && Array.isArray(freshComments)) {
            setFormData(prev => {
              const prevComments = prev.comments || [];
              if (prevComments.length === freshComments.length &&
                  JSON.stringify(prevComments.map(c => c.id)) === JSON.stringify(freshComments.map(c => c.id))) {
                return prev;
              }
              return { ...prev, comments: freshComments };
            });
          }
        }
      } catch (err) {
        console.warn("Failed to poll comments (suppressed):", err?.message || err);
      }
    }, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, articleToEdit?.id]);

  // Helper to scroll ONLY the internal comments container (and NEVER the full page/modal)
  const scrollToCommentsBottom = () => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  };

  // Scroll discussion timeline container ONLY when a new comment is added by the user
  useEffect(() => {
    const currentLen = formData.comments?.length || 0;
    if (currentLen > prevCommentsLengthRef.current) {
      scrollToCommentsBottom();
    }
    prevCommentsLengthRef.current = currentLen;
  }, [formData.comments]);

  const handleSendComment = async () => {
    if (!commentInputText.trim() || isSendingComment) return;
    const text = commentInputText.trim();
    setIsSendingComment(true);
    setCommentError('');

    try {
      if (articleToEdit?.id && addArticleComment) {
        const updatedComments = await addArticleComment(articleToEdit.id, text);
        if (Array.isArray(updatedComments)) {
          setFormData(prev => ({ ...prev, comments: updatedComments }));
          setCommentInputText('');
        } else {
          setCommentError('Unable to send message. Please try again.');
        }
      } else {
        const newCmt = {
          id: `cmt-${Date.now()}`,
          senderName: currentUser?.name || currentUser?.username || 'User',
          senderRole: currentUser?.roleId === 'super_admin' ? 'Super Admin' : (currentUser?.roleId === 'editor' ? 'Editor' : 'Author'),
          text,
          content: text,
          createdAt: new Date().toISOString(),
          isRead: false
        };
        setFormData(prev => ({ ...prev, comments: [...(Array.isArray(prev.comments) ? prev.comments : []), newCmt] }));
        setCommentInputText('');
      }
    } catch (err) {
      console.error("Comment send error", err);
      setCommentError('Unable to send message. Please try again.');
    } finally {
      setIsSendingComment(false);
    }
  };

  // Click outside listener for dropdown menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (picturesMenuRef.current && !picturesMenuRef.current.contains(e.target)) setShowPicturesMenu(false);
      if (videosMenuRef.current && !videosMenuRef.current.contains(e.target)) setShowVideosMenu(false);
      if (textBoxMenuRef.current && !textBoxMenuRef.current.contains(e.target)) setShowTextBoxMenu(false);
      if (fontFamilyMenuRef.current && !fontFamilyMenuRef.current.contains(e.target)) setShowFontFamilyMenu(false);
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) setShowColorPicker(false);
      if (highlightPickerRef.current && !highlightPickerRef.current.contains(e.target)) setShowHighlightPicker(false);
      if (!e.target.closest('.floating-format-toolbar')) {
        setShowFloatingPicturesMenu(false);
        setShowFloatingVideosMenu(false);
        setShowFloatingColorPicker(false);
        setShowFloatingHighlightPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save current caret / selection range
  const saveSelection = () => {
    if (typeof window === 'undefined') return;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  };

  // Restore caret / selection range so writing cursor NEVER jumps to start
  const restoreSelection = () => {
    if (typeof window === 'undefined' || !editorRef.current) return;
    editorRef.current.focus({ preventScroll: true });

    const selection = window.getSelection();
    if (savedRangeRef.current && selection) {
      selection.removeAllRanges();
      selection.addRange(savedRangeRef.current);
    } else if (selection && (selection.rangeCount === 0 || !editorRef.current.contains(selection.anchorNode))) {
      // Move caret to end of editor text instead of starting at index 0
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Zero-Lag ExecCommand with Caret Preservation
  const execCmd = (command, value = null) => {
    restoreSelection();
    if (typeof document !== 'undefined') {
      document.execCommand(command, false, value);
      saveSelection();
    }
  };

  // Prevent focus loss when clicking toolbar buttons
  const preventFocusLoss = (e) => {
    e.preventDefault();
  };

  // Align Left Handler (Forces paragraph to extreme left margin by clearing floats)
  const handleAlignLeft = () => {
    execCmd('justifyLeft');
    restoreSelection();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let node = selection.anchorNode;
      if (node?.nodeType === 3) node = node.parentNode;
      const target = node?.closest('p, div, h1, h2, h3, blockquote');
      if (target) {
        target.style.clear = 'both';
        target.style.textAlign = 'left';
        target.style.marginLeft = '0';
      }
    }
  };

  // Handle Paste Event: Strips external white background boxes & dark text colors, preserving clean text & sky-blue links matching Image 2
  const handlePaste = (e) => {
    e.preventDefault();

    const htmlText = e.clipboardData?.getData('text/html');
    const plainText = e.clipboardData?.getData('text/plain');

    if (htmlText) {
      try {
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        
        // Strip inline background-color, color, font-family, background, class, and id from external DOM elements
        const allElements = doc.body.querySelectorAll('*');
        allElements.forEach(el => {
          el.removeAttribute('class');
          el.removeAttribute('id');
          el.removeAttribute('bgcolor');
          
          if (el.style) {
            el.style.backgroundColor = '';
            el.style.background = '';
            el.style.color = '';
            el.style.fontFamily = '';
            if (!el.getAttribute('style')) {
              el.removeAttribute('style');
            }
          }
        });

        const cleanHtml = doc.body.innerHTML.trim();
        if (cleanHtml && document.queryCommandSupported && document.queryCommandSupported('insertHTML')) {
          document.execCommand('insertHTML', false, cleanHtml);
          if (editorRef.current) {
            setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
          }
          return;
        }
      } catch (err) {
        console.warn("HTML paste parse warning, falling back to plain text:", err);
      }
    }

    // Fallback or Plain Text Paste
    if (plainText) {
      // If author pasted a standalone image or social media link, auto-extract and insert picture!
      const singleUrl = plainText.trim();
      if (/^https?:\/\/[^\s]+$/i.test(singleUrl)) {
        const isSocialOrImg = /(?:twitter\.com|x\.com|youtube\.com|youtu\.be|instagram\.com|facebook\.com|reddit\.com|pinterest\.com|pbs\.twimg\.com|\.(jpg|jpeg|png|webp|gif|svg|avif))/i.test(singleUrl);
        if (isSocialOrImg) {
          insertImageHtml(singleUrl);
          return;
        }
      }

      if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, plainText);
      } else {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(plainText);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      if (editorRef.current) {
        setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
      }
    }
  };


  const handlePasteButtonClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          if (editorRef.current) editorRef.current.focus({ preventScroll: true });
          document.execCommand('insertText', false, text);
          if (editorRef.current) {
            setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
          }
          return;
        }
      }
    } catch (err) {
      // Fallback
    }
    execCmd('paste');
  };

  // Keyboard shortcut & Enter key listener
  const handleKeyDown = (e) => {
    // Dismiss floating toolbar when typing regular characters so it doesn't obstruct writing
    if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
      setFloatingTool(prev => ({ ...prev, visible: false }));
      setShowFloatingColorPicker(false);
      setShowFloatingHighlightPicker(false);
      setShowFloatingPicturesMenu(false);
      setShowFloatingVideosMenu(false);
    }

    if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) {
      e.preventDefault();
      execCmd('justifyFull');
      return;
    }

    if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      handleAlignLeft();
      return;
    }

    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let anchorNode = selection.anchorNode;
        const activeSlot = isInsidePocket(anchorNode);
        const figure = editorRef.current?.querySelector('figure, .img-wrapper');
        const isFigureSelected = selectedImageNode || (anchorNode && (anchorNode.tagName === 'IMG' || anchorNode.classList?.contains('img-wrapper')));

        // CASE 1: Pressing Enter while editing inside a Left/Right text slot of a centered 3-region image
        if (activeSlot) {
          e.preventDefault();
          e.stopPropagation();

          // Insert a clean line break inside the active slot so author can write multiple lines in the pocket
          document.execCommand('insertHTML', false, '<br><span style="display:none">&#8203;</span>');
          return;
        }

        // CASE 2: Pressing Enter while an image/video element itself is selected
        if (isFigureSelected) {
          e.preventDefault();
          e.stopPropagation();

          const targetFigure = selectedImageNode?.closest?.('figure, .img-wrapper, .video-wrapper') || selectedImageNode || figure;
          let targetRow = targetFigure;
          while (targetRow && targetRow.parentNode && targetRow.parentNode !== editorRef.current) {
            targetRow = targetRow.parentNode;
          }

          let belowP = targetRow?.nextElementSibling;
          if (!belowP || belowP.tagName !== 'P' || !editorRef.current.contains(belowP)) {
            belowP = document.createElement('p');
            belowP.style.marginTop = '16px';
            belowP.style.marginBottom = '16px';
            belowP.style.lineHeight = '1.7';
            belowP.style.textAlign = 'left';
            belowP.style.width = '100%';
            belowP.style.display = 'block';
            belowP.style.minHeight = '28px';
            belowP.style.outline = 'none';
            belowP.innerHTML = '\u200B';

            if (targetRow && targetRow.parentNode === editorRef.current) {
              targetRow.after(belowP);
            } else {
              editorRef.current.appendChild(belowP);
            }
          }

          let targetTextNode = belowP.firstChild;
          if (!targetTextNode || targetTextNode.nodeType !== Node.TEXT_NODE) {
            targetTextNode = document.createTextNode('\u200B');
            belowP.innerHTML = '';
            belowP.appendChild(targetTextNode);
          }

          if (editorRef.current) editorRef.current.focus({ preventScroll: true });

          const sel = window.getSelection();
          if (sel) {
            const newRange = document.createRange();
            newRange.setStart(targetTextNode, 0);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
            saveSelection();
          }
          return;
        }

        // Standard text: allow browser native Enter key paragraph split
      }
    }
  };

  const handleEditorInput = () => {
    saveSelection();
  };

  // Selection change listener for text drag-selection
  const handleSelectionChange = () => {
    handleEditorInput();
    saveSelection();

    // Format Painter logic
    if (isFormatPainterActive && savedStyle) {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        if (savedStyle.bold) document.execCommand('bold', false, null);
        if (savedStyle.italic) document.execCommand('italic', false, null);
        if (savedStyle.color) document.execCommand('foreColor', false, savedStyle.color);
        setIsFormatPainterActive(false);
      }
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString() || !selection.toString().trim() || !editorRef.current) {
      return;
    }

    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    let containerNode = range.commonAncestorContainer;
    if (containerNode.nodeType === Node.TEXT_NODE) containerNode = containerNode.parentNode;
    if (!containerNode || !editorRef.current.contains(containerNode)) {
      return;
    }

    // Clean up any stale media selection
    setSelectedImageNode(null);
    setImageBounds(null);
    if (activeTab === 'Picture Format' || activeTab === 'Video Format') {
      setActiveTab('Home');
    }

    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    let calculatedTop = rect.top - editorRect.top - 82;
    if (calculatedTop < 10) {
      calculatedTop = rect.bottom - editorRect.top + 16;
    }
    
    // Center above selected word / highlighted text
    const calculatedLeft = Math.min(
      Math.max(10, rect.left - editorRect.left + (rect.width / 2) - 180),
      editorRect.width - 440
    );

    setFloatingTool({
      visible: true,
      top: calculatedTop,
      left: calculatedLeft
    });
  };

  const handleEditorDoubleClick = (e) => {
    // If double clicking on an image, video, or media wrapper, DO NOT open the text floating toolbar
    const isDirectMedia = ['IMG', 'VIDEO', 'IFRAME'].includes(e.target?.tagName);
    const mediaWrapper = e.target?.closest?.('figure, .img-wrapper, .video-wrapper, .social-embed-wrapper, .social-embed-card, .video-fallback-card');
    const isFigcaption = !!e.target?.closest?.('figcaption');
    if (!isFigcaption && (isDirectMedia || mediaWrapper)) {
      dismissFloatingTool();
      return;
    }

    saveSelection();

    const selection = window.getSelection();
    let rect = null;
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      rect = range.getBoundingClientRect();
    }

    const editorRect = editorRef.current?.getBoundingClientRect();
    if (!editorRect) return;

    let clickX = e.clientX;
    let clickY = e.clientY;

    if (rect && (rect.width > 0 || rect.height > 0)) {
      clickX = rect.left + (rect.width / 2);
      clickY = rect.top;
    }

    let calculatedTop = clickY - editorRect.top - 82;
    if (calculatedTop < 10) {
      calculatedTop = (rect && rect.bottom ? rect.bottom : clickY) - editorRect.top + 16;
    }

    const calculatedLeft = Math.min(
      Math.max(10, clickX - editorRect.left - 180),
      editorRect.width - 440
    );

    setFloatingTool({
      visible: true,
      top: calculatedTop,
      left: calculatedLeft
    });
  };

  // Format Painter trigger
  const handleFormatPainterClick = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const parentNode = selection.anchorNode.parentNode;
      const computed = window.getComputedStyle(parentNode);
      setSavedStyle({
        bold: computed.fontWeight === '700' || computed.fontWeight === 'bold',
        italic: computed.fontStyle === 'italic',
        color: computed.color
      });
      setIsFormatPainterActive(true);
    }
  };

  // Device File Selector (Compressed to prevent memory crashes)
  const handleDeviceFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dismissFloatingTool();
    setShowPicturesMenu(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawBase64 = event.target?.result;
      if (!rawBase64) return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * (MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedUrl = canvas.toDataURL('image/jpeg', 0.82);
        insertImageHtml(compressedUrl, file.name.replace(/\.[^/.]+$/, ""), 'center');
      };
      img.src = rawBase64;
    };
    reader.readAsDataURL(file);
    setShowPicturesMenu(false);
  };

  // Universal Insert Image / Media / Social Embed Helper into editor
  const insertImageHtml = async (src, caption = '', align = 'center') => {
    dismissFloatingTool();
    setShowPicturesMenu(false);
    setShowUrlModal(false);
    setShowStockModal(false);
    restoreSelection();
    if (!editorRef.current) return;

    let targetImageUrl = src;
    let targetCaption = caption;

    // If it's a social media or webpage link, extract the clean direct image photo!
    const isSocialOrWebLink = /^https?:\/\//i.test(src) &&
                              !/\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(src);

    if (isSocialOrWebLink) {
      try {
        const res = await fetch('/api/extract-media-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: src })
        });
        const json = await res.json();
        if (json.success && json.imageUrl) {
          targetImageUrl = json.imageUrl;
          if (!targetCaption && json.caption) {
            targetCaption = json.caption;
          }
        } else {
          targetImageUrl = `https://api.microlink.io?url=${encodeURIComponent(src)}&embed=image.url`;
        }
      } catch (err) {
        console.warn('Extract image fetch error:', err);
        targetImageUrl = `https://api.microlink.io?url=${encodeURIComponent(src)}&embed=image.url`;
      }
    }

    // Ensure targetImageUrl is never an HTML webpage URL
    if (targetImageUrl === src && !/\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(targetImageUrl) && /^https?:\/\//i.test(targetImageUrl)) {
      targetImageUrl = `https://api.microlink.io?url=${encodeURIComponent(src)}&embed=image.url`;
    }

    restoreSelection();
    if (!editorRef.current) return;

    // Check if cursor is currently inside a text slot, figure, or center wrap anchor
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const container = range.startContainer;
      const el = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
      const nestedContainer = el?.closest?.('.left-text-slot, .right-text-slot, figure, .img-wrapper, .social-embed-wrapper, .video-wrapper, .center-wrap-anchor');
      
      if (nestedContainer) {
        const topAnchor = nestedContainer.closest('.center-wrap-anchor') || nestedContainer.closest('figure, .img-wrapper, .social-embed-wrapper, .video-wrapper') || nestedContainer;
        if (topAnchor && topAnchor.parentElement) {
          const newP = document.createElement('p');
          newP.style.lineHeight = '1.7';
          newP.style.marginBottom = '12px';
          newP.innerHTML = '\u200B';
          if (topAnchor.nextSibling) {
            topAnchor.parentElement.insertBefore(newP, topAnchor.nextSibling);
          } else {
            topAnchor.parentElement.appendChild(newP);
          }
          const newRange = document.createRange();
          newRange.setStart(newP, 0);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
          if (typeof saveSelection === 'function') {
            saveSelection();
          }
        }
      }
    }

    let wrapperStyles;
    if (align === 'left') {
      wrapperStyles = 'margin: 12px 24px 12px 0; float: left; clear: none; max-width: 50%; display: block;';
    } else if (align === 'right') {
      wrapperStyles = 'margin: 12px 0 12px 24px; float: right; clear: none; max-width: 50%; display: block;';
    } else {
      wrapperStyles = 'margin: 16px auto; display: block; clear: both; text-align: center; max-width: 100%;';
    }

    const captionHtml = targetCaption ? `<figcaption contenteditable="true" style="font-size: 13px; color: #94a3b8; font-style: italic; text-align: center; margin-top: 6px; margin-bottom: 0; line-height: 1.35; display: block; width: 100%;">${targetCaption}</figcaption>` : '';
    const imgStyles = 'max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.3); display: block; margin: 0 auto; cursor: pointer;';

    const originalSourceUrl = (isSocialOrWebLink || /^https?:\/\//i.test(src)) ? src : targetImageUrl;

    let imageContentHtml;
    if (originalSourceUrl && /^https?:\/\//i.test(originalSourceUrl)) {
      imageContentHtml = `<a href="${originalSourceUrl}" target="_blank" rel="noopener noreferrer" class="image-source-link" style="display: block; cursor: pointer; text-decoration: none;" title="Open original post on web: ${originalSourceUrl}"><img src="${targetImageUrl}" alt="Article Photo" data-source-url="${originalSourceUrl}" style="${imgStyles}" onerror="if(!this.dataset.retry){this.dataset.retry='1';this.src='https://api.microlink.io?url=' + encodeURIComponent('${encodeURIComponent(originalSourceUrl)}') + '&embed=image.url';}" /></a>`;
    } else {
      imageContentHtml = `<img src="${targetImageUrl}" alt="Article Photo" style="${imgStyles}" />`;
    }

    const mediaHtml = `<figure class="img-wrapper image-center" contenteditable="false" style="${wrapperStyles}">${imageContentHtml}${captionHtml}</figure><p style="display: block; width: 100%; line-height: 1.7; text-align: left; margin-top: 16px;">\u200B</p>`;

    const savedEditorScroll = editorRef.current ? editorRef.current.scrollTop : 0;
    const modalScrollParent = editorRef.current?.closest('.modal-content') || (typeof document !== 'undefined' ? document.querySelector('.modal-content') : null);
    const savedModalScroll = modalScrollParent ? modalScrollParent.scrollTop : 0;

    document.execCommand('insertHTML', false, mediaHtml);

    setTimeout(() => {
      if (editorRef.current) {
        normalizeEditorMedia(editorRef.current);
        const allImgs = editorRef.current.querySelectorAll('figure, img');
        const newlyInserted = allImgs ? allImgs[allImgs.length - 1] : null;
        if (newlyInserted) {
          const fig = newlyInserted.closest('figure') || newlyInserted;
          setSelectedImageNode(fig);
          updateImageBounds(fig);
          setActiveTab('Picture Format');
          try {
            fig.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (err) {
            editorRef.current.scrollTop = savedEditorScroll;
            if (modalScrollParent) modalScrollParent.scrollTop = savedModalScroll;
          }
        } else {
          editorRef.current.scrollTop = savedEditorScroll;
          if (modalScrollParent) modalScrollParent.scrollTop = savedModalScroll;
        }
        setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
      }
    }, 50);
  };

  // ── VIDEO INSERTION HANDLERS (Instant Device Preview + Server Sync) ──
  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dismissFloatingTool();
    setShowVideosMenu(false);

    try {
      // 1. Instantly create local Blob URL so video is 100% visible and playable in editor immediately
      const tempBlobUrl = URL.createObjectURL(file);
      blobUrlsRef.current.push(tempBlobUrl);
      const uniqueId = 'vid-' + Date.now();
      
      insertVideoHtml(tempBlobUrl, file.name.replace(/\.[^/.]+$/, ''), 'video', uniqueId);

      // 2. Upload file in background to /api/upload to generate persistent server URL
      const uploadData = new FormData();
      uploadData.append('file', file);

      fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      }).then(res => res.json()).then(json => {
        if (json.success && json.url && editorRef.current) {
          const fig = editorRef.current.querySelector(`#${uniqueId}`);
          if (fig) {
            const vidEl = fig.querySelector('video');
            const sourceEl = fig.querySelector('source');
            if (vidEl) {
              vidEl.setAttribute('data-server-src', json.url);
            }
            if (sourceEl) {
              sourceEl.setAttribute('data-server-src', json.url);
            }
          }
        }
      }).catch(err => console.warn('Background upload warning:', err));

    } catch (err) {
      console.error("Video File Handling Error:", err);
    }
  };

  const insertStockVideo = (videoUrl, title) => {
    dismissFloatingTool();
    insertVideoHtml(videoUrl, title || 'Stock Video Clip', 'video');
    setShowStockVideoModal(false);
  };

  const insertOnlineVideo = () => {
    if (!videoUrlInput.trim()) return;
    dismissFloatingTool();
    const captionText = videoCaptionInput.trim();
    const parsed = parseVideoUrl(videoUrlInput.trim(), captionText, 'center');
    if (!parsed.html) return;

    restoreSelection();
    if (!editorRef.current) return;
    const uniqueId = 'vid-' + Date.now();

    const savedEditorScroll = editorRef.current ? editorRef.current.scrollTop : 0;
    const modalScrollParent = editorRef.current?.closest('.modal-content') || (typeof document !== 'undefined' ? document.querySelector('.modal-content') : null);
    const savedModalScroll = modalScrollParent ? modalScrollParent.scrollTop : 0;

    // Inject uniqueId into the parsed single figure
    const videoHtml = parsed.html.replace('<figure ', `<figure id="${uniqueId}" `) + `<p style="display: block; width: 100%; line-height: 1.7; text-align: left; margin-top: 16px;">\u200B</p>`;

    execCmd('insertHTML', videoHtml);
    setShowVideosMenu(false);
    setShowOnlineVideoModal(false);
    setVideoUrlInput('');
    setVideoCaptionInput('');

    setTimeout(() => {
      if (editorRef.current) {
        normalizeEditorMedia(editorRef.current);
        const newFig = editorRef.current.querySelector(`#${uniqueId}`) || editorRef.current.querySelector('.video-wrapper:last-of-type');
        if (newFig) {
          setSelectedImageNode(newFig);
          updateImageBounds(newFig);
          setActiveTab('Video Format');
          try {
            newFig.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (err) {
            editorRef.current.scrollTop = savedEditorScroll;
            if (modalScrollParent) modalScrollParent.scrollTop = savedModalScroll;
          }
        } else {
          editorRef.current.scrollTop = savedEditorScroll;
          if (modalScrollParent) modalScrollParent.scrollTop = savedModalScroll;
        }
        setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
      }
    }, 50);
  };

  const insertVideoHtml = (src, captionText = '', type = 'video', customId = null) => {
    dismissFloatingTool();
    setShowVideosMenu(false);
    setShowStockVideoModal(false);
    setShowOnlineVideoModal(false);
    restoreSelection();
    if (!editorRef.current) return;
    const uniqueId = customId || ('vid-' + Date.now());

    const savedEditorScroll = editorRef.current ? editorRef.current.scrollTop : 0;
    const modalScrollParent = editorRef.current?.closest('.modal-content') || (typeof document !== 'undefined' ? document.querySelector('.modal-content') : null);
    const savedModalScroll = modalScrollParent ? modalScrollParent.scrollTop : 0;

    const parsed = parseVideoUrl(src, captionText, 'center');
    let videoHtml;
    if (parsed.html) {
      videoHtml = parsed.html.replace('<figure ', `<figure id="${uniqueId}" `) + `<p style="display: block; width: 100%; line-height: 1.7; text-align: left; margin-top: 16px;">\u200B</p>`;
    } else {
      const captionHtml = captionText ? `<figcaption contenteditable="true" style="font-size: 13px; color: #94a3b8; font-style: italic; text-align: center; margin-top: 6px; margin-bottom: 0; line-height: 1.35; display: block; width: 100%;">${captionText}</figcaption>` : '';
      videoHtml = `
        <figure id="${uniqueId}" class="video-wrapper img-wrapper image-center" style="display: block; width: 100%; max-width: 100%; clear: both; float: none; margin: 16px auto; text-align: center;">
          <video controls preload="metadata" src="${src}" style="width: 100%; max-width: 100%; aspect-ratio: 16/9; height: auto; display: block; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);"><source src="${src}" type="video/mp4" /></video>
          ${captionHtml}
        </figure><p style="display: block; width: 100%; line-height: 1.7; text-align: left; margin-top: 16px;">\u200B</p>`;
    }

    execCmd('insertHTML', videoHtml);
    setShowVideosMenu(false);

    setTimeout(() => {
      if (editorRef.current) {
        normalizeEditorMedia(editorRef.current);
        const newFig = editorRef.current.querySelector(`#${uniqueId}`) || editorRef.current.querySelector('.video-wrapper:last-of-type');
        if (newFig) {
          setSelectedImageNode(newFig);
          updateImageBounds(newFig);
          setActiveTab('Video Format');
          try {
            newFig.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (err) {
            editorRef.current.scrollTop = savedEditorScroll;
            if (modalScrollParent) modalScrollParent.scrollTop = savedModalScroll;
          }
        } else {
          editorRef.current.scrollTop = savedEditorScroll;
          if (modalScrollParent) modalScrollParent.scrollTop = savedModalScroll;
        }
        setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
      }
    }, 50);
  };

  // ── LINK INSERTION & NORMALIZATION HANDLERS ──
  const normalizeEditorLinks = (container = editorRef.current) => {
    if (!container) return;

    // 1. Ensure all existing <a> tags have target="_blank" and rel="noopener noreferrer"
    const existingLinks = container.querySelectorAll('a');
    existingLinks.forEach(a => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      if (!a.classList.contains('article-link')) {
        a.classList.add('article-link');
      }
      a.style.color = '#38bdf8';
      a.style.textDecoration = 'underline';
      a.style.cursor = 'pointer';
    });

    // 2. Auto-convert plain text URLs (e.g. https://instagram.com/...) into <a> tags
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    const textNodesToProcess = [];
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      if (currentNode.parentElement?.tagName === 'A' || currentNode.parentElement?.tagName === 'STYLE' || currentNode.parentElement?.tagName === 'SCRIPT') {
        continue;
      }
      if (/https?:\/\/[^\s<]+/i.test(currentNode.nodeValue)) {
        textNodesToProcess.push(currentNode);
      }
    }

    textNodesToProcess.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent) return;

      const text = textNode.nodeValue;
      const urlRegex = /(https?:\/\/[^\s()<]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/)))/gi;
      let lastIndex = 0;
      let match;
      const frag = document.createDocumentFragment();

      while ((match = urlRegex.exec(text)) !== null) {
        const matchText = match[0];
        const matchIndex = match.index;

        if (matchIndex > lastIndex) {
          frag.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)));
        }

        const linkEl = document.createElement('a');
        linkEl.href = matchText;
        linkEl.target = '_blank';
        linkEl.rel = 'noopener noreferrer';
        linkEl.className = 'article-link';
        linkEl.style.color = '#38bdf8';
        linkEl.style.textDecoration = 'underline';
        linkEl.style.cursor = 'pointer';
        linkEl.textContent = matchText;
        frag.appendChild(linkEl);

        lastIndex = matchIndex + matchText.length;
      }

      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.substring(lastIndex)));
      }

      parent.replaceChild(frag, textNode);
    });
  };

  const openImageLinkModal = () => {
    if (!selectedImageNode) return;
    const imgEl = selectedImageNode.tagName === 'IMG'
      ? selectedImageNode
      : selectedImageNode.querySelector?.('img');

    if (!imgEl) return;

    const parentLink = imgEl.closest('a');
    setSelectedLinkNode(parentLink || null);
    setLinkUrlInput(parentLink ? (parentLink.getAttribute('href') || '') : '');
    setLinkTextInput('');
    setIsImageLinkEditing(true);
    setShowLinkModal(true);
  };

  const openLinkModal = () => {
    dismissFloatingTool();
    restoreSelection();
    setIsImageLinkEditing(false);
    const sel = window.getSelection();
    let linkEl = null;

    if (sel && sel.rangeCount > 0) {
      const container = sel.getRangeAt(0).startContainer;
      linkEl = container.nodeType === Node.TEXT_NODE ? container.parentElement?.closest('a') : container.closest('a');
    }

    if (linkEl && editorRef.current?.contains(linkEl)) {
      setSelectedLinkNode(linkEl);
      setLinkUrlInput(linkEl.getAttribute('href') || '');
      setLinkTextInput(linkEl.textContent || '');
    } else {
      setSelectedLinkNode(null);
      setLinkUrlInput('');
      setLinkTextInput(sel?.toString() || '');
    }

    setShowLinkModal(true);
  };

  const openLinkModalForEdit = (linkEl) => {
    if (!linkEl) return;
    if (linkEl.querySelector('img')) {
      setIsImageLinkEditing(true);
    } else {
      setIsImageLinkEditing(false);
    }
    setSelectedLinkNode(linkEl);
    setLinkUrlInput(linkEl.getAttribute('href') || '');
    setLinkTextInput(linkEl.querySelector('img') ? '' : (linkEl.textContent || ''));
    setActiveLinkPopover(null);
    setShowLinkModal(true);
  };

  const handleInsertOrUpdateLink = (e) => {
    e?.preventDefault();
    if (!linkUrlInput.trim()) return;

    let validUrl = linkUrlInput.trim();
    if (!/^https?:\/\//i.test(validUrl) && !validUrl.startsWith('mailto:') && !validUrl.startsWith('tel:')) {
      validUrl = 'https://' + validUrl;
    }

    if (isImageLinkEditing && selectedImageNode) {
      const imgEl = selectedImageNode.tagName === 'IMG'
        ? selectedImageNode
        : selectedImageNode.querySelector?.('img');

      if (imgEl) {
        const existingLink = imgEl.closest('a');
        if (existingLink) {
          existingLink.setAttribute('href', validUrl);
          existingLink.setAttribute('target', '_blank');
          existingLink.setAttribute('rel', 'noopener noreferrer');
        } else {
          const newLink = document.createElement('a');
          newLink.href = validUrl;
          newLink.target = '_blank';
          newLink.rel = 'noopener noreferrer';
          newLink.className = 'article-image-link';
          newLink.style.display = 'block';
          newLink.style.width = '100%';
          imgEl.parentNode.insertBefore(newLink, imgEl);
          newLink.appendChild(imgEl);
        }
      }

      setIsImageLinkEditing(false);
      setShowLinkModal(false);
      setLinkUrlInput('');
      setLinkTextInput('');
      setSelectedLinkNode(null);
      setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
      return;
    }

    restoreSelection();

    if (selectedLinkNode) {
      selectedLinkNode.setAttribute('href', validUrl);
      selectedLinkNode.setAttribute('target', '_blank');
      selectedLinkNode.setAttribute('rel', 'noopener noreferrer');
      selectedLinkNode.classList.add('article-link');
      selectedLinkNode.style.color = '#38bdf8';
      selectedLinkNode.style.textDecoration = 'underline';
      selectedLinkNode.style.cursor = 'pointer';
      if (linkTextInput.trim()) {
        selectedLinkNode.textContent = linkTextInput.trim();
      }
    } else {
      const displayText = linkTextInput.trim() || validUrl;
      const sel = window.getSelection();

      if (sel && !sel.isCollapsed) {
        execCmd('createLink', validUrl);
        if (editorRef.current) {
          const links = editorRef.current.querySelectorAll('a');
          links.forEach(a => {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
            a.classList.add('article-link');
            a.style.color = '#38bdf8';
            a.style.textDecoration = 'underline';
            a.style.cursor = 'pointer';
          });
        }
      } else {
        const linkHtml = `<a href="${validUrl}" target="_blank" rel="noopener noreferrer" class="article-link" style="color: #38bdf8; text-decoration: underline; cursor: pointer;">${displayText}</a>\u200B`;
        execCmd('insertHTML', linkHtml);
      }
    }

    setShowLinkModal(false);
    setLinkUrlInput('');
    setLinkTextInput('');
    setSelectedLinkNode(null);
    if (editorRef.current) {
      normalizeEditorLinks(editorRef.current);
    }
    setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
  };

  const removeLinkNode = (linkEl = selectedLinkNode) => {
    if (!linkEl) return;
    const imgChild = linkEl.querySelector('img');
    if (imgChild) {
      linkEl.parentNode?.replaceChild(imgChild, linkEl);
    } else {
      const text = linkEl.textContent || '';
      const textNode = document.createTextNode(text);
      linkEl.parentNode?.replaceChild(textNode, linkEl);
    }
    setActiveLinkPopover(null);
    setShowLinkModal(false);
    setSelectedLinkNode(null);
    setIsImageLinkEditing(false);
    setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
  };

  const textBoxCardStyle = {
    background: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  };

  // MS Word Built-in Text Box Gallery Insert Helper
  const insertTextBoxTemplate = (templateType) => {
    dismissFloatingTool();
    restoreSelection();
    if (!editorRef.current) return;

    let boxHtml = '';
    const uniqueId = 'tb_' + Date.now();

    switch (templateType) {
      case 'simple':
        boxHtml = `
          <div id="${uniqueId}" contenteditable="true" style="margin: 16px 0; padding: 16px; border: 1.5px solid var(--brand-red, #c91818); border-radius: 8px; background: rgba(201, 24, 24, 0.06); max-width: 480px; clear: both;">
            <p style="margin: 0; font-weight: 600; color: #f8fafc;">[Type your text box content here. This is an interactive callout text box.]</p>
          </div><p><br/></p>`;
        break;

      case 'austin_quote':
        boxHtml = `
          <div id="${uniqueId}" contenteditable="true" style="margin: 20px auto; padding: 14px 20px; border-top: 2px solid #d4af37; border-bottom: 2px solid #d4af37; text-align: center; max-width: 520px; background: rgba(212, 175, 55, 0.05); clear: both;">
            <p style="margin: 0; font-family: Georgia, serif; font-style: italic; font-size: 1.1rem; color: #f1f5f9;">"A reader's attention is drawn with a great quote or callout text from the story."</p>
            <p style="margin-top: 6px; font-size: 0.8rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">— Author Name</p>
          </div><p><br/></p>`;
        break;

      case 'austin_sidebar':
        boxHtml = `
          <div id="${uniqueId}" contenteditable="true" style="float: right; margin: 6px 0 16px 20px; padding: 16px; border-left: 4px solid #38bdf8; background: rgba(56, 189, 248, 0.08); max-width: 240px; border-radius: 4px; clear: none;">
            <h5 style="margin: 0 0 8px 0; color: #38bdf8; font-weight: 800; text-transform: uppercase; font-size: 0.85rem;">[Sidebar Title]</h5>
            <p style="margin: 0; font-size: 0.875rem; color: #cbd5e1; line-height: 1.5;">Sidebars highlight extra details, background info, or quick stats related to the article.</p>
          </div><p><br/></p>`;
        break;

      case 'banded_quote':
        boxHtml = `
          <div id="${uniqueId}" contenteditable="true" style="margin: 20px 0; padding: 16px 24px; border-left: 5px solid #c91818; background: rgba(255,255,255,0.04); border-radius: 0 8px 8px 0; clear: both;">
            <p style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #f8fafc; text-transform: uppercase; tracking: 0.5px;">[BOLD BANDED QUOTE OR KEY HIGHLIGHT ATTRACTING READER ATTENTION]</p>
          </div><p><br/></p>`;
        break;

      case 'banded_sidebar':
        boxHtml = `
          <div id="${uniqueId}" contenteditable="true" style="float: left; margin: 6px 20px 16px 0; padding: 16px; border-top: 3px solid #34d399; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); max-width: 240px; border-radius: 6px; clear: none;">
            <h5 style="margin: 0 0 6px 0; color: #34d399; font-weight: 800; font-size: 0.85rem;">[KEY TAKEAWAY]</h5>
            <p style="margin: 0; font-size: 0.85rem; color: #94a3b8; line-height: 1.5;">Key points placed on the left side of the page grab reader attention first.</p>
          </div><p><br/></p>`;
        break;

      case 'facet_quote':
        boxHtml = `
          <div id="${uniqueId}" contenteditable="true" style="margin: 20px auto; padding: 16px; background: linear-gradient(135deg, rgba(201,24,24,0.15) 0%, rgba(212,175,55,0.15) 100%); border-radius: 8px; text-align: center; max-width: 440px; border: 1px solid rgba(255,255,255,0.15); clear: both;">
            <p style="margin: 0; font-weight: 700; color: #ffffff; font-size: 0.95rem;">[Facet Quote: Important text statement styled with glowing gradient background.]</p>
          </div><p><br/></p>`;
        break;

      case 'facet_sidebar_left':
        boxHtml = `
          <div id="${uniqueId}" contenteditable="true" style="float: left; margin: 6px 20px 16px 0; padding: 14px 18px; border-left: 4px solid #a855f7; background: rgba(168, 85, 247, 0.08); max-width: 250px; border-radius: 6px; clear: none;">
            <h5 style="margin: 0 0 6px 0; color: #c084fc; font-weight: 800; font-size: 0.85rem;">[Left Facet Sidebar]</h5>
            <p style="margin: 0; font-size: 0.85rem; color: #e2e8f0;">Sidebars are great for key quotes, additional context, or related links.</p>
          </div><p><br/></p>`;
        break;

      case 'facet_sidebar_right':
        boxHtml = `
          <div id="${uniqueId}" contenteditable="true" style="float: right; margin: 6px 0 16px 20px; padding: 14px 18px; border-right: 4px solid #f59e0b; background: rgba(245, 158, 11, 0.08); max-width: 250px; border-radius: 6px; clear: none;">
            <h5 style="margin: 0 0 6px 0; color: #fbbf24; font-weight: 800; font-size: 0.85rem;">[Right Facet Sidebar]</h5>
            <p style="margin: 0; font-size: 0.85rem; color: #e2e8f0;">Positioned on the right margin of the article layout.</p>
          </div><p><br/></p>`;
        break;

      case 'filigree_quote':
        boxHtml = `
          <div id="${uniqueId}" contenteditable="true" style="margin: 24px auto; padding: 20px; border: 1px dashed #d4af37; background: rgba(212, 175, 55, 0.04); text-align: center; max-width: 500px; border-radius: 12px; clear: both;">
            <span style="display: block; font-size: 1.2rem; color: #d4af37; margin-bottom: 6px;">❖ ❖ ❖</span>
            <p style="margin: 0; font-family: Georgia, serif; font-style: italic; font-size: 1.05rem; color: #f8fafc;">"Draw your reader's attention with a classy filigree callout text box."</p>
            <span style="display: block; font-size: 1.2rem; color: #d4af37; margin-top: 6px;">❖ ❖ ❖</span>
          </div><p><br/></p>`;
        break;

      case 'draw_textbox':
      default:
        boxHtml = `
          <div id="${uniqueId}" contenteditable="true" style="margin: 16px 0; padding: 14px 18px; border: 1px dashed #38bdf8; background: rgba(56, 189, 248, 0.05); border-radius: 6px; min-width: 220px; max-width: 400px; clear: both;">
            <p style="margin: 0; color: #f8fafc;">[Custom Drawn Text Box: Type your custom text here...]</p>
          </div><p><br/></p>`;
        break;
    }

    document.execCommand('insertHTML', false, boxHtml);
    setShowTextBoxMenu(false);
  };

  const fontSizesList = ['9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '36px', '48px', '72px'];

  // Font family change
  const applyFontFamilyToSelection = (font) => {
    setFontFamily(font);
    restoreSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    if (selection.isCollapsed) {
      let node = selection.anchorNode;
      if (node?.nodeType === Node.TEXT_NODE) node = node.parentNode;
      if (node && editorRef.current?.contains(node) && node !== editorRef.current) {
        node.style.fontFamily = font;
      }
    } else {
      document.execCommand('styleWithCSS', false, true);
      document.execCommand('fontName', false, font);
      document.execCommand('styleWithCSS', false, false);
    }
    saveSelection();
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
    }
  };

  const handleFontFamilyChange = (font) => {
    applyFontFamilyToSelection(font);
  };

  // Font size change
  const applyFontSizeToSelection = (size) => {
    setFontSize(size);
    restoreSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    if (selection.isCollapsed) {
      let node = selection.anchorNode;
      if (node?.nodeType === Node.TEXT_NODE) node = node.parentNode;
      if (node && editorRef.current?.contains(node) && node !== editorRef.current) {
        node.style.fontSize = size;
      }
    } else {
      document.execCommand('styleWithCSS', false, true);
      document.execCommand('fontSize', false, '7');
      if (editorRef.current) {
        const fonts = editorRef.current.querySelectorAll('font[size="7"], span[style*="font-size: -webkit-xxx-large"], span[style*="font-size: xx-large"]');
        fonts.forEach(el => {
          el.removeAttribute('size');
          el.style.fontSize = size;
        });
      }
      document.execCommand('styleWithCSS', false, false);
    }
    saveSelection();
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
    }
  };

  const handleFontSizeChange = (size) => {
    applyFontSizeToSelection(size);
  };

  const handleGrowFont = () => {
    const currentIndex = fontSizesList.indexOf(fontSize);
    const nextSize = (currentIndex >= 0 && currentIndex < fontSizesList.length - 1)
      ? fontSizesList[currentIndex + 1]
      : (currentIndex === -1 ? '18px' : fontSizesList[fontSizesList.length - 1]);
    applyFontSizeToSelection(nextSize);
  };

  const handleShrinkFont = () => {
    const currentIndex = fontSizesList.indexOf(fontSize);
    const prevSize = (currentIndex > 0)
      ? fontSizesList[currentIndex - 1]
      : (currentIndex === -1 ? '14px' : fontSizesList[0]);
    applyFontSizeToSelection(prevSize);
  };

  const applyStyleBlock = (tag) => {
    restoreSelection();
    if (tag === 'p') {
      execCmd('formatBlock', '<p>');
    } else if (tag === 'h1') {
      execCmd('formatBlock', '<h1>');
    } else if (tag === 'h2') {
      execCmd('formatBlock', '<h2>');
    } else if (tag === 'h3') {
      execCmd('formatBlock', '<h3>');
    } else if (tag === 'quote') {
      execCmd('formatBlock', '<blockquote>');
    }
  };

  // Change Case (UPPERCASE, lowercase, Title Case)
  const handleChangeCase = (mode) => {
    restoreSelection();
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const selectedText = selection.toString();
      let transformed = selectedText;
      if (mode === 'upper') transformed = selectedText.toUpperCase();
      if (mode === 'lower') transformed = selectedText.toLowerCase();
      if (mode === 'title') transformed = selectedText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

      execCmd('insertText', transformed);
    }
  };

  // Apply Highlight Color
  const applyHighlight = (color) => {
    restoreSelection();
    execCmd('hiliteColor', color);
    setShowHighlightPicker(false);
    setShowFloatingHighlightPicker(false);
  };

  // Apply Text Color
  const applyTextColor = (color) => {
    restoreSelection();
    execCmd('foreColor', color);
    setShowColorPicker(false);
    setShowFloatingColorPicker(false);
  };


  // Insert Table
  const insertTable = () => {
    dismissFloatingTool();
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.2);">
            <th style="padding: 10px 14px; text-align: left;">Indicator Metric</th>
            <th style="padding: 10px 14px; text-align: left;">Q2 2026 Forecast</th>
            <th style="padding: 10px 14px; text-align: left;">Variance %</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 10px 14px;">Capital Expenditure ($B)</td>
            <td style="padding: 10px 14px;">$14.2B</td>
            <td style="padding: 10px 14px; color: #34d399; font-weight: 700;">+12.4%</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px;">Active Deployments</td>
            <td style="padding: 10px 14px;">1,240 Units</td>
            <td style="padding: 10px 14px; color: #34d399; font-weight: 700;">+8.1%</td>
          </tr>
        </tbody>
      </table>
      <p><br/></p>
    `;
    execCmd('insertHTML', tableHtml);
  };

  // Insert Callout Box
  const insertCallout = () => {
    dismissFloatingTool();
    const calloutHtml = `
      <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%); border-left: 4px solid #3b82f6; border-radius: 8px; padding: 14px 18px; margin: 18px 0; color: #f8fafc;">
        <strong style="color: #60a5fa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">KEY TAKEAWAY REPORT</strong>
        <p style="margin: 0; font-size: 14.5px; font-style: italic;">Insert key executive summary bullet or highlighted takeaway note here...</p>
      </div>
      <p><br/></p>
    `;
    execCmd('insertHTML', calloutHtml);
  };

  // ── SINGLE-FLIGHT SAFE SAVE ACTION ──
  const executeSaveAction = async (e, targetStatus) => {
    if (e) e.preventDefault();
    if (isSaving) return;

    if (!formData.title?.trim()) {
      alert("Please enter a headline before saving.");
      return;
    }

    setIsSaving(true);
    try {
      // Ensure all videos have valid, non-blob persistent src URLs before saving!
      if (editorRef.current) {
        const videos = editorRef.current.querySelectorAll('video');
        videos.forEach(vid => {
          const serverSrc = vid.getAttribute('data-server-src');
          const currentSrc = vid.getAttribute('src') || '';
          const sourceEl = vid.querySelector('source');
          const finalSrc = (serverSrc && !serverSrc.startsWith('blob:')) 
            ? serverSrc 
            : (currentSrc && !currentSrc.startsWith('blob:') ? currentSrc : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');

          vid.setAttribute('src', finalSrc);
          vid.src = finalSrc;
          if (sourceEl) {
            sourceEl.setAttribute('src', finalSrc);
            sourceEl.src = finalSrc;
          }
        });
      }

      const rawBody = editorRef.current ? editorRef.current.innerHTML : (formData.content || '');
      
      // Guard against pathological oversized content (> 4MB HTML string)
      let bodyToSave = rawBody;
      if (bodyToSave.length > 4 * 1024 * 1024) {
        console.warn("Payload size threshold exceeded. Stripping inline raw data URLs...");
        bodyToSave = bodyToSave.replace(/src=["']data:video\/[^"']+["']/gi, 'src=""');
      }

      const sanitizedBody = sanitizeArticleHtml(bodyToSave || '');

      const payload = {
        ...formData,
        authorId: formData.authorId || currentUser?.id || 'adm-author',
        author: isSuperAdmin ? formData.author : (currentUser?.name || formData.author || 'Staff Reporter'),
        content: sanitizedBody,
        status: targetStatus || formData.status || 'Draft'
      };

      if (articleToEdit?.id) {
        await updateArticle(payload);
      } else {
        await addArticle(payload);
      }
      onClose();
    } catch (err) {
      console.error("Save Action Error:", err);
      alert("An error occurred while saving article draft.");
    } finally {
      setIsSaving(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    executeSaveAction(e, formData.status || 'Draft');
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={articleToEdit ? "Edit Article" : "Create New Article"} maxWidth="1350px">
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div className="modal-body" style={{ maxHeight: '84vh', overflowY: 'auto' }}>
          
          {/* Kicker / Supertitle (Overline) */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Kicker / Supertitle (Overline — Appears Above Headline)</span>
              <span style={{ color: '#38bdf8', fontSize: '10px', textTransform: 'none', fontWeight: 600 }}>Optional: Category context, Location, or Theme</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. SPECIAL REPORT • PARIS 2026 • EXCLUSIVE"
              value={formData.kicker || ''}
              onChange={(e) => setFormData({ ...formData, kicker: e.target.value })}
            />
          </div>

          {/* Headline Title */}
          <div className="form-group">
            <label style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Headline Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Breaking News: Economic Forum Update..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Metadata Row: Category, Sub-Section, Author, Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Category {!isSuperAdmin && <span style={{ color: '#ef4444', fontSize: '10px', fontWeight: 800 }}>🔒 (Super Admin Only)</span>}
              </label>
              <select
                className="form-control"
                value={formData.category || (allowedCategories[0] || 'Tech & AI')}
                onChange={(e) => {
                  if (!isSuperAdmin) return;
                  const newCategory = e.target.value;
                  const newSubs = categorySubSectionsMap[newCategory] || ['General'];
                  const newScopedSubs = isSuperAdmin || !currentUser?.sectionScope?.[newCategory] || currentUser?.sectionScope?.[newCategory]?.includes('All Sections')
                    ? newSubs
                    : newSubs.filter(sec => currentUser?.sectionScope?.[newCategory]?.includes(sec));
                  setFormData({
                    ...formData,
                    category: newCategory,
                    subSection: newScopedSubs[0] || newSubs[0] || 'General'
                  });
                }}
                disabled={!isSuperAdmin}
                style={{
                  background: !isSuperAdmin ? 'rgba(255, 255, 255, 0.05)' : undefined,
                  cursor: !isSuperAdmin ? 'not-allowed' : 'pointer',
                  borderColor: !isSuperAdmin ? 'rgba(255, 255, 255, 0.1)' : undefined,
                  opacity: !isSuperAdmin ? 0.7 : 1
                }}
                title={!isSuperAdmin ? "Category section is locked. Only Super Admin can change categories." : "Select Category"}
              >
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sub-Section Field */}
            {(() => {
              const currentCategoryName = formData.category || (allowedCategories[0] || 'Tech & AI');
              const allSubSections = categorySubSectionsMap[currentCategoryName] || ['General'];
              const userSectionScope = currentUser?.sectionScope?.[currentCategoryName];
              
              let allowedSubSections = allSubSections;
              if (!isSuperAdmin) {
                if (userSectionScope && Array.isArray(userSectionScope) && userSectionScope.length > 0 && !userSectionScope.includes('All Sections')) {
                  allowedSubSections = allSubSections.filter(sec => userSectionScope.includes(sec));
                } else if (!userSectionScope || userSectionScope.length === 0) {
                  allowedSubSections = [allSubSections[0]];
                }
              }

              return (
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Sub-Section {!isSuperAdmin && <span style={{ color: '#facc15', fontSize: '10px' }}>🔒 (Assigned Scope)</span>}
                  </label>
                  <select
                    className="form-control"
                    value={formData.subSection || (allowedSubSections[0] || '')}
                    onChange={(e) => setFormData({ ...formData, subSection: e.target.value })}
                    disabled={allowedSubSections.length <= 1}
                  >
                    {allowedSubSections.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
              );
            })()}

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Author Name {!isSuperAdmin && <span style={{ color: '#ef4444', fontSize: '10px' }}>🔒 (Assigned Profile)</span>}
              </label>
              <input
                type="text"
                className="form-control"
                value={isSuperAdmin ? formData.author : (currentUser?.name || formData.author)}
                onChange={(e) => isSuperAdmin && setFormData({ ...formData, author: e.target.value })}
                readOnly={!isSuperAdmin}
                style={{
                  background: !isSuperAdmin ? 'rgba(255, 255, 255, 0.05)' : undefined,
                  cursor: !isSuperAdmin ? 'not-allowed' : 'text',
                  borderColor: !isSuperAdmin ? 'rgba(255, 255, 255, 0.1)' : undefined
                }}
                title={!isSuperAdmin ? "Author name is locked to assigned admin profile" : "Author name"}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Status {isEditor && <span style={{ color: '#c084fc', fontSize: '10px', fontWeight: 800 }}>⚡ (Editor Managed)</span>}
              </label>
              <select
                className="form-control"
                value={formData.status || 'Under Editorial Review'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{
                  background: isEditor ? 'rgba(192, 132, 252, 0.1)' : undefined,
                  borderColor: isEditor ? 'rgba(192, 132, 252, 0.4)' : undefined,
                  color: isEditor ? '#c084fc' : undefined,
                  fontWeight: 700
                }}
              >
                {isEditor ? (
                  <>
                    <option value="Under Editorial Review">⏳ Under Editorial Review</option>
                    <option value="Approved by Editor">✓ Completed (Approved Quality)</option>
                    <option value="Changes Requested">❌ Rejected (Request Revision)</option>
                  </>
                ) : (
                  <>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Pending Editor Assignment">Pending Assignment</option>
                    <option value="Under Editorial Review">Under Editorial Review</option>
                    <option value="Approved by Editor">Approved by Editor</option>
                    <option value="Changes Requested">Changes Requested</option>
                    <option value="Archived">Archived</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Lead Summary */}
          <div className="form-group">
            <label style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Article Lead Summary</label>
            <textarea
              className="form-control"
              placeholder="Short summary for RSS & preview feeds..."
              style={{ minHeight: '50px' }}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          </div>

          {/* FEATURED COVER IMAGE DUAL-OPTION SELECTION & LIVE PREVIEW */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>
              Featured Article Cover Image (Local File Upload OR Web Image URL)
            </label>
            
            <div style={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {/* Option 1: Prominent Device File Upload Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => headerBannerInputRef.current?.click()}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <span>📁 Upload Image from Computer / Device</span>
                </button>

                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>OR paste web image URL:</span>
              </div>

              {/* Option 2: Image URL Input Field */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/... or paste social post link (Twitter, Instagram, YouTube, etc.)"
                  value={formData.imageUrl || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, imageUrl: val }));
                  }}
                  onPaste={async (e) => {
                    const pasted = e.clipboardData?.getData('text');
                    if (pasted && /(?:twitter\.com|x\.com|youtube\.com|youtu\.be|instagram\.com|facebook\.com|reddit\.com|pinterest\.com)/i.test(pasted) && !/\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(pasted)) {
                      setTimeout(async () => {
                        try {
                          const res = await fetch('/api/extract-media-image', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: pasted.trim() })
                          });
                          const json = await res.json();
                          if (json.success && json.imageUrl) {
                            setFormData(prev => ({ ...prev, imageUrl: json.imageUrl }));
                          }
                        } catch (err) {
                          console.warn('Cover image paste extract error:', err);
                        }
                      }, 20);
                    }
                  }}
                  style={{ flex: 1, background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)' }}
                />
                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '0 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Hidden Native File Input for Cover Image */}
              <input
                ref={headerBannerInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const raw = ev.target?.result;
                      if (!raw) return;
                      const img = new Image();
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 1400;
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
                        setFormData(prev => ({ ...prev, imageUrl: compressed }));
                      };
                      img.src = raw;
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />

              {/* Live Image Preview */}
              {formData.imageUrl && (
                <div style={{ position: 'relative', marginTop: '4px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', maxHeight: '160px', background: '#020617' }}>
                  <img
                    src={formData.imageUrl}
                    alt="Article Cover Preview"
                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(4px)', color: '#38bdf8', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                    ✓ Cover Image Active
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hidden File Input for Device Pictures Selection */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleDeviceFileSelect}
          />

          {/* Hidden File Input for Device Video Selection */}
          <input
            ref={videoFileInputRef}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={handleVideoFileUpload}
          />

          {/* MS WORD STYLE DOCUMENT FORMATTING CONTAINER (Matches Image 2) */}
          <div style={{
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#0b1120',
            marginBottom: '1.25rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}>

            {/* Authentic MS Word Top Menu Bar (Image 2) */}
            <div style={{
              background: '#0f172a',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 8px'
            }}>
              {['Home', 'Insert', ...(selectedImageNode ? [(selectedImageNode.tagName === 'VIDEO' || selectedImageNode.tagName === 'IFRAME' || selectedImageNode.classList?.contains('video-wrapper') || selectedImageNode.querySelector?.('video, iframe')) ? 'Video Format' : 'Picture Format'] : [])].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onMouseDown={preventFocusLoss}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: activeTab === tab ? 800 : 600,
                    color: tab === 'Video Format' ? '#c084fc' : (tab === 'Picture Format' ? '#38bdf8' : (activeTab === tab ? '#ffffff' : '#94a3b8')),
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: activeTab === tab ? (tab === 'Video Format' ? '2.5px solid #c084fc' : '2.5px solid #38bdf8') : '2.5px solid transparent',
                    background: (tab === 'Video Format' && activeTab === 'Video Format') ? 'rgba(192, 132, 252, 0.15)' : ((tab === 'Picture Format' && activeTab === 'Picture Format') ? 'rgba(56, 189, 248, 0.15)' : 'none'),
                    cursor: 'pointer',
                    borderRadius: (tab === 'Video Format' || tab === 'Picture Format') ? '4px 4px 0 0' : '0'
                  }}
                >
                  {tab === 'Video Format' ? '🎥 Video Format' : (tab === 'Picture Format' ? '🖼️ Picture Format' : tab)}
                </button>
              ))}
            </div>

            {/* TAB: HOME RIBBON TOOLBAR (Image 2 Exact Section Division: Clipboard | Font | Paragraph) */}
            {activeTab === 'Home' && (
              <div style={{
                background: '#161e2e',
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap'
              }}>
                {/* SECTION 1: CLIPBOARD */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={handlePasteButtonClick} style={btnStyle} title="Paste Plain Text"><Clipboard size={14} /> Paste</button>

                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('copy')} style={btnStyle} title="Copy"><Copy size={14} /></button>
                  <button 
                    type="button" 
                    onMouseDown={preventFocusLoss} 
                    onClick={handleFormatPainterClick} 
                    style={{ ...btnStyle, background: isFormatPainterActive ? '#3b82f6' : 'rgba(255,255,255,0.08)' }} 
                    title="Format Painter (Copy style & paint onto text)"
                  >
                    <Paintbrush size={14} color={isFormatPainterActive ? '#fff' : '#facc15'} />
                  </button>
                </div>

                <div style={sectionDividerStyle} />

                {/* SECTION 2: FONT */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* Custom MS Word Font Family Dropdown */}
                  <div style={{ position: 'relative' }} ref={fontFamilyMenuRef}>
                    <button
                      type="button"
                      onClick={() => setShowFontFamilyMenu(prev => !prev)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        minWidth: '150px',
                        maxWidth: '210px',
                        cursor: 'pointer',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                      title="Select Font Family"
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: fontFamily }}>
                        {fontFamily.includes('Aptos Display') ? 'Aptos Display' : fontFamily.split(',')[0].replace(/'/g, '')}
                      </span>
                      <ChevronDown size={14} color="#94a3b8" />
                    </button>

                    {showFontFamilyMenu && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '4px',
                        width: '260px',
                        maxHeight: '340px',
                        overflowY: 'auto',
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.75)',
                        padding: '6px 0',
                        zIndex: 9999
                      }}>
                        {/* Section 1: Theme Fonts */}
                        <div style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Theme Fonts
                        </div>
                        <button
                          type="button"
                          onClick={() => { handleFontFamilyChange("'Aptos Display', sans-serif"); setShowFontFamilyMenu(false); }}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px', background: fontFamily.includes('Aptos Display') ? 'rgba(56,189,248,0.15)' : 'transparent', border: 'none', color: '#fff', fontSize: '13px', cursor: 'pointer', fontFamily: "'Aptos Display', sans-serif", textAlign: 'left' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = fontFamily.includes('Aptos Display') ? 'rgba(56,189,248,0.15)' : 'transparent'}
                        >
                          <span>Aptos Display</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>(Headings)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { handleFontFamilyChange("Aptos, sans-serif"); setShowFontFamilyMenu(false); }}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px', background: fontFamily === 'Aptos, sans-serif' ? 'rgba(56,189,248,0.15)' : 'transparent', border: 'none', color: '#fff', fontSize: '13px', cursor: 'pointer', fontFamily: "Aptos, sans-serif", textAlign: 'left' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = fontFamily === 'Aptos, sans-serif' ? 'rgba(56,189,248,0.15)' : 'transparent'}
                        >
                          <span>Aptos</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>(Body)</span>
                        </button>

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '6px 0' }} />

                        {/* Section 2: All Fonts */}
                        <div style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          All Fonts
                        </div>
                        {[
                          { name: 'Agency FB', val: "'Agency FB', sans-serif" },
                          { name: 'ALGERIAN', val: "Algerian, display" },
                          { name: 'Aptos', val: "Aptos, sans-serif" },
                          { name: 'Aptos Display', val: "'Aptos Display', sans-serif" },
                          { name: 'Aptos Narrow', val: "'Aptos Narrow', sans-serif" },
                          { name: 'Aptos Mono', val: "'Aptos Mono', monospace" },
                          { name: 'Aptos Serif', val: "'Aptos Serif', serif" },
                          { name: 'Arial', val: "Arial, sans-serif" },
                          { name: 'Arial Black', val: "'Arial Black', sans-serif" },
                          { name: 'Arial Narrow', val: "'Arial Narrow', sans-serif" },
                          { name: 'Arial Rounded MT Bold', val: "'Arial Rounded MT Bold', sans-serif" },
                          { name: 'Bahnschrift', val: "Bahnschrift, sans-serif" },
                          { name: 'Bahnschrift Condensed', val: "'Bahnschrift Condensed', sans-serif" },
                          { name: 'Bahnschrift Light', val: "'Bahnschrift Light', sans-serif" },
                          { name: 'Baskerville Old Face', val: "'Baskerville Old Face', serif" },
                          { name: 'Bell MT', val: "'Bell MT', serif" },
                          { name: 'Bodoni MT', val: "'Bodoni MT', serif" },
                          { name: 'Bodoni MT Black', val: "'Bodoni MT Black', serif" },
                          { name: 'Book Antiqua', val: "'Book Antiqua', serif" },
                          { name: 'Bookman Old Style', val: "'Bookman Old Style', serif" },
                          { name: 'Bradley Hand ITC', val: "'Bradley Hand ITC', cursive" },
                          { name: 'Brush Script MT', val: "'Brush Script MT', cursive" },
                          { name: 'Calibri', val: "Calibri, sans-serif" },
                          { name: 'Calibri Light', val: "'Calibri Light', sans-serif" },
                          { name: 'Calisto MT', val: "'Calisto MT', serif" },
                          { name: 'Cambria', val: "Cambria, serif" },
                          { name: 'Candara', val: "Candara, sans-serif" },
                          { name: 'Cascadia Code', val: "'Cascadia Code', monospace" },
                          { name: 'Centaur', val: "Centaur, serif" },
                          { name: 'Century', val: "Century, serif" },
                          { name: 'Century Gothic', val: "'Century Gothic', sans-serif" },
                          { name: 'Century Schoolbook', val: "'Century Schoolbook', serif" },
                          { name: 'Chiller', val: "Chiller, display" },
                          { name: 'Colonna MT', val: "'Colonna MT', display" },
                          { name: 'Comic Sans MS', val: "'Comic Sans MS', cursive" },
                          { name: 'Consolas', val: "Consolas, monospace" },
                          { name: 'Constantia', val: "Constantia, serif" },
                          { name: 'Copperplate Gothic', val: "'Copperplate Gothic', serif" },
                          { name: 'Corbel', val: "Corbel, sans-serif" },
                          { name: 'Courier New', val: "'Courier New', monospace" },
                          { name: 'Curlz MT', val: "'Curlz MT', display" },
                          { name: 'Edwardian Script ITC', val: "'Edwardian Script ITC', display" },
                          { name: 'Elephant', val: "Elephant, serif" },
                          { name: 'Engravers MT', val: "'Engravers MT', display" },
                          { name: 'Footlight MT Light', val: "'Footlight MT Light', serif" },
                          { name: 'Forte', val: "Forte, display" },
                          { name: 'Franklin Gothic', val: "'Franklin Gothic', sans-serif" },
                          { name: 'Freestyle Script', val: "'Freestyle Script', cursive" },
                          { name: 'French Script MT', val: "'French Script MT', cursive" },
                          { name: 'Gabriola', val: "Gabriola, cursive" },
                          { name: 'Garamond', val: "Garamond, serif" },
                          { name: 'Georgia', val: "Georgia, serif" },
                          { name: 'Gigi', val: "Gigi, display" },
                          { name: 'Gill Sans MT', val: "'Gill Sans MT', sans-serif" },
                          { name: 'Goudy Old Style', val: "'Goudy Old Style', serif" },
                          { name: 'Harrington', val: "Harrington, display" },
                          { name: 'High Tower Text', val: "'High Tower Text', serif" },
                          { name: 'Impact', val: "Impact, sans-serif" },
                          { name: 'Jokerman', val: "Jokerman, display" },
                          { name: 'Juice ITC', val: "'Juice ITC', display" },
                          { name: 'Kunstler Script', val: "'Kunstler Script', cursive" },
                          { name: 'Leelawadee UI', val: "'Leelawadee UI', sans-serif" },
                          { name: 'Lucida Bright', val: "'Lucida Bright', serif" },
                          { name: 'Lucida Console', val: "'Lucida Console', monospace" },
                          { name: 'Lucida Handwriting', val: "'Lucida Handwriting', cursive" },
                          { name: 'Lucida Sans Unicode', val: "'Lucida Sans Unicode', sans-serif" },
                          { name: 'Magneto', val: "Magneto, display" },
                          { name: 'Malgun Gothic', val: "'Malgun Gothic', sans-serif" },
                          { name: 'Meiryo', val: "Meiryo, sans-serif" },
                          { name: 'Microsoft JhengHei', val: "'Microsoft JhengHei', sans-serif" },
                          { name: 'Microsoft Sans Serif', val: "'Microsoft Sans Serif', sans-serif" },
                          { name: 'Microsoft YaHei', val: "'Microsoft YaHei', sans-serif" },
                          { name: 'MingLiU', val: "MingLiU, sans-serif" },
                          { name: 'Mistral', val: "Mistral, cursive" },
                          { name: 'Modern No. 20', val: "'Modern No. 20', serif" },
                          { name: 'Monotype Corsiva', val: "'Monotype Corsiva', cursive" },
                          { name: 'MS Gothic', val: "'MS Gothic', sans-serif" },
                          { name: 'Old English Text MT', val: "'Old English Text MT', display" },
                          { name: 'Onyx', val: "Onyx, display" },
                          { name: 'Palatino Linotype', val: "'Palatino Linotype', serif" },
                          { name: 'Papyrus', val: "Papyrus, display" },
                          { name: 'Perpetua', val: "Perpetua, serif" },
                          { name: 'Playbill', val: "Playbill, display" },
                          { name: 'PMingLiU', val: "PMingLiU, sans-serif" },
                          { name: 'Poor Richard', val: "'Poor Richard', display" },
                          { name: 'Pristina', val: "Pristina, cursive" },
                          { name: 'Ravie', val: "Ravie, display" },
                          { name: 'Rockwell', val: "Rockwell, serif" },
                          { name: 'Rockwell Condensed', val: "'Rockwell Condensed', serif" },
                          { name: 'Segoe Script', val: "'Segoe Script', cursive" },
                          { name: 'Segoe UI', val: "'Segoe UI', sans-serif" },
                          { name: 'Showcard Gothic', val: "'Showcard Gothic', display" },
                          { name: 'SimHei', val: "SimHei, sans-serif" },
                          { name: 'SimSun', val: "SimSun, sans-serif" },
                          { name: 'Sitka', val: "Sitka, serif" },
                          { name: 'Snap ITC', val: "'Snap ITC', display" },
                          { name: 'Stencil', val: "Stencil, display" },
                          { name: 'Sylfaen', val: "Sylfaen, serif" },
                          { name: 'Symbol', val: "Symbol" },
                          { name: 'Tahoma', val: "Tahoma, sans-serif" },
                          { name: 'Tempus Sans ITC', val: "'Tempus Sans ITC', display" },
                          { name: 'Times New Roman', val: "'Times New Roman', serif" },
                          { name: 'Trebuchet MS', val: "'Trebuchet MS', sans-serif" },
                          { name: 'Tw Cen MT', val: "'Tw Cen MT', serif" },
                          { name: 'Verdana', val: "Verdana, sans-serif" },
                          { name: 'Viner Hand ITC', val: "'Viner Hand ITC', cursive" },
                          { name: 'Vladimir Script', val: "'Vladimir Script', cursive" },
                          { name: 'Webdings', val: "Webdings" },
                          { name: 'Wide Latin', val: "'Wide Latin', display" },
                          { name: 'Wingdings', val: "Wingdings" },
                          { name: 'Wingdings 2', val: "'Wingdings 2'" },
                          { name: 'Wingdings 3', val: "'Wingdings 3'" },
                          { name: 'Yu Gothic', val: "'Yu Gothic', sans-serif" }
                        ].map(item => (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => { handleFontFamilyChange(item.val); setShowFontFamilyMenu(false); }}
                            style={{
                              width: '100%',
                              padding: '6px 14px',
                              background: fontFamily === item.val ? 'rgba(56,189,248,0.15)' : 'transparent',
                              border: 'none',
                              color: '#fff',
                              fontSize: '13px',
                              cursor: 'pointer',
                              fontFamily: item.val,
                              textAlign: 'left',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = fontFamily === item.val ? 'rgba(56,189,248,0.15)' : 'transparent'}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <select
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                    style={{ ...selectStyle, minWidth: '60px' }}
                    title="Font Size"
                  >
                    {['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '36px', '48px', '72px'].map(sz => (
                      <option key={sz} value={sz}>{sz.replace('px', '')}</option>
                    ))}
                  </select>

                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('increaseFontSize')} style={btnStyle} title="Increase Font Size (A^)">A^</button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('decreaseFontSize')} style={btnStyle} title="Decrease Font Size (Av)">Av</button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => handleChangeCase('upper')} style={btnStyle} title="UPPERCASE">AA</button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => handleChangeCase('lower')} style={btnStyle} title="lowercase">aa</button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('removeFormat')} style={btnStyle} title="Clear Formatting"><RemoveFormatting size={14} /></button>

                  {/* Font Format Group */}
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('bold')} style={btnStyle} title="Bold (Ctrl+B)"><Bold size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('italic')} style={btnStyle} title="Italic (Ctrl+I)"><Italic size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('underline')} style={btnStyle} title="Underline (Ctrl+U)"><Underline size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('strikeThrough')} style={btnStyle} title="Strikethrough"><Strikethrough size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('subscript')} style={btnStyle} title="Subscript"><SubIcon size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('superscript')} style={btnStyle} title="Superscript"><SuperIcon size={14} /></button>

                  {/* Highlight & Color */}
                  <div style={{ position: 'relative' }}>
                    <button type="button" onMouseDown={preventFocusLoss} onClick={() => setShowHighlightPicker(!showHighlightPicker)} style={btnStyle} title="Text Highlight Color">
                      <Highlighter size={14} color="#fef08a" />
                    </button>
                    {showHighlightPicker && (
                      <div ref={highlightPickerRef} style={pickerDropdownStyle}>
                        {['#fef08a', '#a7f3d0', '#a5f3fc', '#fbcfe8', '#fed7aa', '#cbd5e1'].map(c => (
                          <div key={c} onMouseDown={preventFocusLoss} onClick={() => applyHighlight(c)} style={{ width: '22px', height: '22px', background: c, borderRadius: '4px', cursor: 'pointer', border: '1px solid #fff' }} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ position: 'relative' }}>
                    <button type="button" onMouseDown={preventFocusLoss} onClick={() => setShowColorPicker(!showColorPicker)} style={btnStyle} title="Font Color">
                      <Palette size={14} color="#ef4444" />
                    </button>
                    {showColorPicker && (
                      <div ref={colorPickerRef} style={pickerDropdownStyle}>
                        {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ffffff', '#94a3b8'].map(c => (
                          <div key={c} onMouseDown={preventFocusLoss} onClick={() => applyTextColor(c)} style={{ width: '22px', height: '22px', background: c, borderRadius: '4px', cursor: 'pointer', border: '1px solid #fff' }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={sectionDividerStyle} />

                {/* SECTION 3: PARAGRAPH */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={handleAlignLeft} style={btnStyle} title="Align Left (Ctrl+L) - Move text to extreme left margin"><AlignLeft size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('justifyCenter')} style={btnStyle} title="Align Center"><AlignCenter size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('justifyRight')} style={btnStyle} title="Align Right"><AlignRight size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('justifyFull')} style={btnStyle} title="Justify (Ctrl+J) - Distribute text evenly between margins"><AlignJustify size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('insertUnorderedList')} style={btnStyle} title="Bulleted List"><List size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('insertOrderedList')} style={btnStyle} title="Numbered List"><ListOrdered size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('formatBlock', '<h1>')} style={btnStyle} title="Heading 1"><Heading1 size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('formatBlock', '<h2>')} style={btnStyle} title="Heading 2"><Heading2 size={14} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('formatBlock', '<h3>')} style={btnStyle} title="Heading 3"><Heading3 size={14} /></button>
                </div>
              </div>
            )}

            {/* TAB: INSERT RIBBON TOOLBAR (Matches User Image 1 Pictures Dropdown Menu) */}
            {activeTab === 'Insert' && (
              <div style={{
                background: '#161e2e',
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap'
              }}>
                {/* MS WORD PICTURES DROPDOWN CONTAINER */}
                <div style={{ position: 'relative' }} ref={picturesMenuRef}>
                  <button 
                    type="button" 
                    onMouseDown={preventFocusLoss}
                    onClick={() => setShowPicturesMenu(!showPicturesMenu)} 
                    style={{ ...btnStyle, padding: '6px 14px', background: '#3b82f6', color: '#fff', gap: '6px', fontSize: '13px', fontWeight: 800 }}
                    title="Insert Picture Menu (Word Style)"
                  >
                    <ImageIcon size={16} />
                    <span>Pictures</span>
                    <ChevronDown size={14} />
                  </button>

                  {/* Pictures Dropdown Menu (Image 1 Exact Layout) */}
                  {showPicturesMenu && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      width: '240px',
                      background: '#182030',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      padding: '8px 0',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.8)',
                      zIndex: 99999
                    }}>
                      <div style={{ padding: '6px 14px 8px 14px', fontSize: '12px', fontWeight: 800, color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Insert Picture From
                      </div>

                      {/* 1. This Device... (File Picker) */}
                      <button
                        type="button"
                        onMouseDown={preventFocusLoss}
                        onClick={() => {
                          setShowPicturesMenu(false);
                          fileInputRef.current?.click();
                        }}
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Monitor size={16} color="#60a5fa" />
                        <span>This <u>D</u>evice...</span>
                      </button>

                      {/* 2. Stock Images... */}
                      <button
                        type="button"
                        onMouseDown={preventFocusLoss}
                        onClick={() => {
                          setShowPicturesMenu(false);
                          setShowStockModal(true);
                        }}
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Search size={16} color="#facc15" />
                        <span><u>S</u>tock Images...</span>
                      </button>

                      {/* 3. Online Pictures... */}
                      <button
                        type="button"
                        onMouseDown={preventFocusLoss}
                        onClick={() => {
                          setShowPicturesMenu(false);
                          setShowUrlModal(true);
                        }}
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Globe size={16} color="#34d399" />
                        <span><u>O</u>nline Pictures...</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* MS WORD VIDEO DROPDOWN CONTAINER */}
                <div style={{ position: 'relative' }} ref={videosMenuRef}>
                  <button 
                    type="button" 
                    onMouseDown={preventFocusLoss}
                    onClick={() => setShowVideosMenu(!showVideosMenu)} 
                    style={{ ...btnStyle, padding: '6px 14px', background: '#8b5cf6', color: '#fff', gap: '6px', fontSize: '13px', fontWeight: 800 }}
                    title="Insert Video Menu (Word Style)"
                  >
                    <Video size={16} />
                    <span>Video</span>
                    <ChevronDown size={14} />
                  </button>

                  {/* Video Dropdown Menu */}
                  {showVideosMenu && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      width: '240px',
                      background: '#182030',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      padding: '8px 0',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.8)',
                      zIndex: 99999
                    }}>
                      <div style={{ padding: '6px 14px 8px 14px', fontSize: '12px', fontWeight: 800, color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Insert Video From
                      </div>

                      {/* 1. This Device... (Video File Picker) */}
                      <button
                        type="button"
                        onMouseDown={preventFocusLoss}
                        onClick={() => {
                          setShowVideosMenu(false);
                          videoFileInputRef.current?.click();
                        }}
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Monitor size={16} color="#60a5fa" />
                        <span>This <u>D</u>evice...</span>
                      </button>

                      {/* 2. Stock Videos... */}
                      <button
                        type="button"
                        onMouseDown={preventFocusLoss}
                        onClick={() => {
                          setShowVideosMenu(false);
                          setShowStockVideoModal(true);
                        }}
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Film size={16} color="#facc15" />
                        <span><u>S</u>tock Videos...</span>
                      </button>

                      {/* 3. Online Video / Embed... */}
                      <button
                        type="button"
                        onMouseDown={preventFocusLoss}
                        onClick={() => {
                          setShowVideosMenu(false);
                          setShowOnlineVideoModal(true);
                        }}
                        style={dropdownItemStyle}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Globe size={16} color="#34d399" />
                        <span><u>O</u>nline Video / Embed...</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* MS WORD TEXT BOX DROPDOWN CONTAINER (Matches User Screenshot!) */}
                <div style={{ position: 'relative' }} ref={textBoxMenuRef}>
                  <button 
                    type="button" 
                    onMouseDown={preventFocusLoss}
                    onClick={() => setShowTextBoxMenu(!showTextBoxMenu)} 
                    style={{ ...btnStyle, padding: '6px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', gap: '6px', fontSize: '13px', fontWeight: 700 }}
                    title="Insert Text Box Gallery (MS Word Style)"
                  >
                    <MessageSquare size={16} color="#38bdf8" />
                    <span>Text Box</span>
                    <ChevronDown size={14} />
                  </button>

                  {/* Text Box Gallery Dropdown Popup (Matches User MS Word Screenshot!) */}
                  {showTextBoxMenu && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      width: '380px',
                      maxHeight: '440px',
                      overflowY: 'auto',
                      background: '#182030',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      padding: '12px',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.95)',
                      zIndex: 99999
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Built-in Text Box Gallery
                      </div>

                      {/* 3x3 Grid of MS Word Templates */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                        {/* 1. Simple Text Box */}
                        <div 
                          onClick={() => insertTextBoxTemplate('simple')}
                          style={textBoxCardStyle}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                        >
                          <div style={{ height: '70px', background: '#0a0d14', borderRadius: '4px', border: '1.5px solid #c91818', padding: '6px', fontSize: '7px', color: '#cbd5e1', overflow: 'hidden' }}>
                            [Text box callout...]
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#f1f5f9', marginTop: '6px', textAlign: 'center' }}>Simple Text Box</span>
                        </div>

                        {/* 2. Austin Quote */}
                        <div 
                          onClick={() => insertTextBoxTemplate('austin_quote')}
                          style={textBoxCardStyle}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                        >
                          <div style={{ height: '70px', background: '#0a0d14', borderRadius: '4px', borderTop: '2px solid #d4af37', borderBottom: '2px solid #d4af37', padding: '6px', fontSize: '7px', color: '#d4af37', fontStyle: 'italic', textAlign: 'center' }}>
                            "A great quote..."
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#f1f5f9', marginTop: '6px', textAlign: 'center' }}>Austin Quote</span>
                        </div>

                        {/* 3. Austin Sidebar */}
                        <div 
                          onClick={() => insertTextBoxTemplate('austin_sidebar')}
                          style={textBoxCardStyle}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                        >
                          <div style={{ height: '70px', background: '#0a0d14', borderRadius: '4px', borderLeft: '3px solid #38bdf8', padding: '6px', fontSize: '7px', color: '#cbd5e1' }}>
                            <div style={{ fontWeight: 800, color: '#38bdf8' }}>[Sidebar]</div>
                            Sidebars highlight...
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#f1f5f9', marginTop: '6px', textAlign: 'center' }}>Austin Sidebar</span>
                        </div>

                        {/* 4. Banded Quote */}
                        <div 
                          onClick={() => insertTextBoxTemplate('banded_quote')}
                          style={textBoxCardStyle}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                        >
                          <div style={{ height: '70px', background: '#0a0d14', borderRadius: '4px', borderLeft: '4px solid #c91818', padding: '6px', fontSize: '7px', color: '#f8fafc', fontWeight: 700 }}>
                            BANDED QUOTE
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#f1f5f9', marginTop: '6px', textAlign: 'center' }}>Banded Quote</span>
                        </div>

                        {/* 5. Banded Sidebar */}
                        <div 
                          onClick={() => insertTextBoxTemplate('banded_sidebar')}
                          style={textBoxCardStyle}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                        >
                          <div style={{ height: '70px', background: '#0a0d14', borderRadius: '4px', borderTop: '3px solid #34d399', padding: '6px', fontSize: '7px', color: '#34d399' }}>
                            <div style={{ fontWeight: 800 }}>TAKEAWAY</div>
                            Key points...
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#f1f5f9', marginTop: '6px', textAlign: 'center' }}>Banded Sidebar</span>
                        </div>

                        {/* 6. Facet Quote */}
                        <div 
                          onClick={() => insertTextBoxTemplate('facet_quote')}
                          style={textBoxCardStyle}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                        >
                          <div style={{ height: '70px', background: 'linear-gradient(135deg, rgba(201,24,24,0.3), rgba(212,175,55,0.3))', borderRadius: '4px', padding: '6px', fontSize: '7px', color: '#fff', textAlign: 'center' }}>
                            Facet Quote Box
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#f1f5f9', marginTop: '6px', textAlign: 'center' }}>Facet Quote</span>
                        </div>

                        {/* 7. Facet Sidebar (Left) */}
                        <div 
                          onClick={() => insertTextBoxTemplate('facet_sidebar_left')}
                          style={textBoxCardStyle}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                        >
                          <div style={{ height: '70px', background: '#0a0d14', borderRadius: '4px', borderLeft: '3px solid #a855f7', padding: '6px', fontSize: '7px', color: '#c084fc' }}>
                            Left Facet Sidebar
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#f1f5f9', marginTop: '6px', textAlign: 'center' }}>Facet Sidebar (L)</span>
                        </div>

                        {/* 8. Facet Sidebar (Right) */}
                        <div 
                          onClick={() => insertTextBoxTemplate('facet_sidebar_right')}
                          style={textBoxCardStyle}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                        >
                          <div style={{ height: '70px', background: '#0a0d14', borderRadius: '4px', borderRight: '3px solid #f59e0b', padding: '6px', fontSize: '7px', color: '#fbbf24' }}>
                            Right Facet Sidebar
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#f1f5f9', marginTop: '6px', textAlign: 'center' }}>Facet Sidebar (R)</span>
                        </div>

                        {/* 9. Filigree Quote */}
                        <div 
                          onClick={() => insertTextBoxTemplate('filigree_quote')}
                          style={textBoxCardStyle}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                        >
                          <div style={{ height: '70px', background: '#0a0d14', borderRadius: '4px', border: '1px dashed #d4af37', padding: '4px', fontSize: '7px', color: '#d4af37', textAlign: 'center' }}>
                            ❖ Filigree ❖
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#f1f5f9', marginTop: '6px', textAlign: 'center' }}>Filigree Quote</span>
                        </div>
                      </div>

                      {/* Bottom Options (Draw Custom Text Box - Matches User Screenshot!) */}
                      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button
                          type="button"
                          onMouseDown={preventFocusLoss}
                          onClick={() => insertTextBoxTemplate('draw_textbox')}
                          style={dropdownItemStyle}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <Edit3 size={16} color="#38bdf8" />
                          <span><u>D</u>raw Custom Text Box</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Insert Link */}
                <button 
                  type="button" 
                  onMouseDown={preventFocusLoss}
                  onClick={openLinkModal} 
                  style={btnStyle} 
                  title="Insert Hyperlink (Ctrl+K)"
                >
                  <LinkIcon size={14} color="#38bdf8" /> Link
                </button>

                {/* Insert Data Table */}
                <button type="button" onMouseDown={preventFocusLoss} onClick={insertTable} style={btnStyle} title="Insert Styled News Data Table">
                  <TableIcon size={14} /> Data Table
                </button>

                {/* Insert Pull Quote */}
                <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('formatBlock', '<blockquote>')} style={btnStyle} title="Insert Pull Quote">
                  <Quote size={14} /> Pull Quote
                </button>

                {/* Insert Callout Box */}
                <button type="button" onMouseDown={preventFocusLoss} onClick={insertCallout} style={btnStyle} title="Insert Highlight Note Box">
                  <MessageSquare size={14} /> Callout Box
                </button>

                {/* Horizontal Divider */}
                <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('insertHorizontalRule')} style={btnStyle} title="Insert Divider Line">
                  <Minus size={14} /> Horizontal Divider
                </button>
              </div>
            )}

              {/* TAB: PICTURE FORMAT RIBBON TOOLBAR (Matches MS Word Picture Format Image) */}
              {activeTab === 'Picture Format' && selectedImageNode && (
                <div style={{
                  background: '#161e2e',
                  padding: '10px 14px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  flexWrap: 'wrap'
                }}>
                  {/* SECTION 1: PICTURE SIZE PRESETS */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginRight: '4px' }}>Picture Size:</span>
                    {(() => {
                      const fig = selectedImageNode?.closest?.('figure, .img-wrapper, .video-wrapper, .social-embed-wrapper') || selectedImageNode;
                      const currentW = fig?.style?.width || selectedImageNode?.style?.width;
                      return (
                        <>
                          <button 
                            type="button" 
                            onMouseDown={preventFocusLoss} 
                            onClick={() => resizeImage('25%')} 
                            style={{ ...btnStyle, background: currentW === '25%' ? '#2563eb' : 'rgba(255,255,255,0.08)', fontWeight: currentW === '25%' ? 800 : 500 }}
                          >
                            25% (Small)
                          </button>
                          <button 
                            type="button" 
                            onMouseDown={preventFocusLoss} 
                            onClick={() => resizeImage('50%')} 
                            style={{ ...btnStyle, background: currentW === '50%' ? '#2563eb' : 'rgba(255,255,255,0.08)', fontWeight: currentW === '50%' ? 800 : 500 }}
                          >
                            50% (Medium)
                          </button>
                          <button 
                            type="button" 
                            onMouseDown={preventFocusLoss} 
                            onClick={() => resizeImage('75%')} 
                            style={{ ...btnStyle, background: currentW === '75%' ? '#2563eb' : 'rgba(255,255,255,0.08)', fontWeight: currentW === '75%' ? 800 : 500 }}
                          >
                            75% (Large)
                          </button>
                          <button 
                            type="button" 
                            onMouseDown={preventFocusLoss} 
                            onClick={() => resizeImage('100%')} 
                            style={{ ...btnStyle, background: currentW === '100%' ? '#2563eb' : 'rgba(255,255,255,0.08)', fontWeight: currentW === '100%' ? 800 : 500 }}
                          >
                            100% (Full Width)
                          </button>
                        </>
                      );
                    })()}
                  </div>

                  <div style={sectionDividerStyle} />

                  {/* SECTION 2: WRAP TEXT & ALIGNMENT */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#facc15', textTransform: 'uppercase', marginRight: '4px' }}>Wrap Text:</span>
                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={() => alignImage('left')} 
                      style={btnStyle}
                      title="Float Left (Text Wraps Right & Below)"
                    >
                      Float Left
                    </button>
                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={() => alignImage('center_wrap')} 
                      style={btnStyle}
                      title="Center (Text Wraps Both Left & Right Sides)"
                    >
                      Center (Both Sides)
                    </button>

                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={() => alignImage('right')} 
                      style={btnStyle}
                      title="Float Right (Text Wraps Left & Below)"
                    >
                      Float Right
                    </button>
                    
                    <span style={{ margin: '0 4px', color: 'rgba(255,255,255,0.2)' }}>|</span>
                    
                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={addOrEditCaption} 
                      style={{ ...btnStyle, color: '#e2e8f0', borderColor: 'rgba(255,255,255,0.3)' }}
                      title="Add or Edit Image Caption"
                    >
                      ✎ Edit Caption
                    </button>

                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={openImageLinkModal} 
                      style={{ 
                        ...btnStyle, 
                        color: (selectedImageNode.querySelector?.('a') || selectedImageNode.tagName === 'A') ? '#38bdf8' : '#e2e8f0', 
                        borderColor: (selectedImageNode.querySelector?.('a') || selectedImageNode.tagName === 'A') ? '#38bdf8' : 'rgba(255,255,255,0.3)',
                        background: (selectedImageNode.querySelector?.('a') || selectedImageNode.tagName === 'A') ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.06)'
                      }}
                      title="Attach or Edit Web Link on Image"
                    >
                      🔗 {(selectedImageNode.querySelector?.('a') || selectedImageNode.tagName === 'A') ? 'Edit Image Link' : 'Attach Link'}
                    </button>

                    <span style={{ margin: '0 4px', color: 'rgba(255,255,255,0.2)' }}>|</span>

                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={removeSelectedMedia} 
                      style={{ 
                        ...btnStyle, 
                        color: '#f87171', 
                        borderColor: 'rgba(239, 68, 68, 0.4)',
                        background: 'rgba(239, 68, 68, 0.15)',
                        fontWeight: 700
                      }}
                      title="Remove / Delete Picture from Article"
                    >
                      <Trash2 size={13} color="#f87171" /> Remove Image
                    </button>
                  </div>

                  <div style={sectionDividerStyle} />

                  {/* SECTION 3: MS WORD PICTURE STYLES GALLERY (Matches User Images 1 & 2!) */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginRight: '2px' }}>Picture Styles:</span>

                    {/* MS Word Hover Tooltip Badge (Matches User Screenshot!) */}
                    {hoveredStyleTitle && (
                      <div style={{
                        position: 'absolute',
                        top: '-32px',
                        left: '110px',
                        background: '#ffffff',
                        color: '#0f172a',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '4px',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.6)',
                        zIndex: 999999,
                        border: '1px solid #cbd5e1',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap'
                      }}>
                        {hoveredStyleTitle}
                      </div>
                    )}

                    {/* Quick Strip Container Box matching Image 2 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#111827',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '4px',
                      padding: '3px 4px'
                    }}>
                      {/* First 7 Thumbnails from Row 1 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '6px', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                        {pictureStylesList.slice(0, 7).map((styleItem) => (
                          <button
                            key={styleItem.id}
                            type="button"
                            onMouseDown={preventFocusLoss}
                            onMouseEnter={() => {
                              setHoveredStyleTitle(styleItem.name.split(' — ')[0]);
                              applyImageStyle(styleItem.id);
                            }}
                            onMouseLeave={() => {
                              setHoveredStyleTitle('');
                              applyImageStyle(currentAppliedStyle);
                            }}
                            onClick={() => {
                              setCurrentAppliedStyle(styleItem.id);
                              applyImageStyle(styleItem.id);
                            }}
                            style={{
                              background: currentAppliedStyle === styleItem.id ? '#2563eb' : 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '3px',
                              padding: '4px 6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease'
                            }}
                            title={styleItem.name}
                          >
                            <div style={{
                              width: '22px',
                              height: '15px',
                              background: '#38bdf8',
                              border: styleItem.border || 'none',
                              borderRadius: styleItem.radius || '0px',
                              boxShadow: styleItem.shadow || 'none',
                              transform: styleItem.transform || 'none',
                              clipPath: styleItem.clip || 'none'
                            }} />
                          </button>
                        ))}
                      </div>

                      {/* Down Arrow Dropdown Toggle Button (`⌄`) */}
                      <button
                        type="button"
                        onMouseDown={preventFocusLoss}
                        onClick={() => setShowPictureStylesDropdown(prev => !prev)}
                        style={{
                          background: showPictureStylesDropdown ? '#2563eb' : 'transparent',
                          border: 'none',
                          color: '#ffffff',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px'
                        }}
                        title="More Picture Styles (Show All 28 Styles)"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>

                    {/* FLOATING FULL GALLERY GRID POPOVER (Matching Image 1: 4 Rows x 7 Columns = 28 Items!) */}
                    {showPictureStylesDropdown && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '42px',
                          left: '95px',
                          width: '430px',
                          background: '#0f172a',
                          border: '1.5.px solid rgba(255, 255, 255, 0.25)',
                          borderRadius: '8px',
                          padding: '12px',
                          boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
                          zIndex: 999999,
                          color: '#f8fafc'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8' }}>Picture Styles Gallery (28 Styles)</span>
                          <button
                            type="button"
                            onClick={() => setShowPictureStylesDropdown(false)}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', fontWeight: 800 }}
                          >
                            ✕
                          </button>
                        </div>

                        {/* 4 Rows x 7 Columns Grid */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {[1, 2, 3, 4].map(rowNum => (
                            <div key={rowNum} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                              {pictureStylesList.filter(s => s.row === rowNum).map(styleItem => (
                                <button
                                  key={styleItem.id}
                                  type="button"
                                  onMouseDown={preventFocusLoss}
                                  onMouseEnter={() => {
                                    setHoveredStyleTitle(styleItem.name.split(' — ')[0]);
                                    applyImageStyle(styleItem.id);
                                  }}
                                  onMouseLeave={() => {
                                    setHoveredStyleTitle('');
                                    applyImageStyle(currentAppliedStyle);
                                  }}
                                  onClick={() => {
                                    setCurrentAppliedStyle(styleItem.id);
                                    applyImageStyle(styleItem.id);
                                    setShowPictureStylesDropdown(false);
                                  }}
                                  style={{
                                    background: currentAppliedStyle === styleItem.id ? '#2563eb' : 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '4px',
                                    padding: '6px 4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                    height: '42px',
                                    transition: 'transform 0.15s ease, background 0.15s ease'
                                  }}
                                  title={styleItem.name}
                                >
                                  <div style={{
                                    width: '26px',
                                    height: '18px',
                                    background: '#38bdf8',
                                    border: styleItem.border || 'none',
                                    borderRadius: styleItem.radius || '0px',
                                    boxShadow: styleItem.shadow || 'none',
                                    transform: styleItem.transform || 'none',
                                    clipPath: styleItem.clip || 'none'
                                  }} />
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>


                </div>
              )}

              {/* TAB: VIDEO FORMAT RIBBON TOOLBAR */}
              {activeTab === 'Video Format' && selectedImageNode && (
                <div style={{
                  background: '#161e2e',
                  padding: '10px 14px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  flexWrap: 'wrap'
                }}>
                  {/* SECTION 1: VIDEO SIZE PRESETS */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginRight: '4px' }}>Video Size:</span>
                    {(() => {
                      const fig = selectedImageNode?.closest?.('figure, .img-wrapper, .video-wrapper, .social-embed-wrapper') || selectedImageNode;
                      const currentW = fig?.style?.width || selectedImageNode?.style?.width;
                      return (
                        <>
                          <button 
                            type="button" 
                            onMouseDown={preventFocusLoss} 
                            onClick={() => resizeImage('25%')} 
                            style={{ ...btnStyle, background: currentW === '25%' ? '#8b5cf6' : 'rgba(255,255,255,0.08)', fontWeight: currentW === '25%' ? 800 : 500 }}
                          >
                            25% (Small)
                          </button>
                          <button 
                            type="button" 
                            onMouseDown={preventFocusLoss} 
                            onClick={() => resizeImage('50%')} 
                            style={{ ...btnStyle, background: currentW === '50%' ? '#8b5cf6' : 'rgba(255,255,255,0.08)', fontWeight: currentW === '50%' ? 800 : 500 }}
                          >
                            50% (Medium)
                          </button>
                          <button 
                            type="button" 
                            onMouseDown={preventFocusLoss} 
                            onClick={() => resizeImage('75%')} 
                            style={{ ...btnStyle, background: currentW === '75%' ? '#8b5cf6' : 'rgba(255,255,255,0.08)', fontWeight: currentW === '75%' ? 800 : 500 }}
                          >
                            75% (Large)
                          </button>
                          <button 
                            type="button" 
                            onMouseDown={preventFocusLoss} 
                            onClick={() => resizeImage('100%')} 
                            style={{ ...btnStyle, background: currentW === '100%' ? '#8b5cf6' : 'rgba(255,255,255,0.08)', fontWeight: currentW === '100%' ? 800 : 500 }}
                          >
                            100% (Full Width)
                          </button>
                        </>
                      );
                    })()}
                  </div>

                  <div style={sectionDividerStyle} />

                  {/* SECTION 2: WRAP TEXT & ALIGNMENT */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#facc15', textTransform: 'uppercase', marginRight: '4px' }}>Wrap Text:</span>
                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={() => alignImage('left')} 
                      style={btnStyle}
                      title="Float Left (Text Wraps Right & Below)"
                    >
                      Float Left
                    </button>
                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={() => alignImage('center')} 
                      style={{ ...btnStyle, background: '#7c3aed', color: '#fff', fontWeight: 700 }}
                      title="Center Standalone Block (Zero Text Wrapping on Sides)"
                    >
                      Center (Block Row)
                    </button>
                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={() => alignImage('center_wrap')} 
                      style={btnStyle}
                      title="Center (Text Wraps Both Left & Right Sides)"
                    >
                      Center (Both Sides)
                    </button>
                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={() => alignImage('right')} 
                      style={btnStyle}
                      title="Float Right (Text Wraps Left & Below)"
                    >
                      Float Right
                    </button>
                    
                    <span style={{ margin: '0 4px', color: 'rgba(255,255,255,0.2)' }}>|</span>
                    
                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={addOrEditCaption} 
                      style={{ ...btnStyle, color: '#e2e8f0', borderColor: 'rgba(255,255,255,0.3)' }}
                      title="Add or Edit Video Caption"
                    >
                      ✎ Edit Caption
                    </button>
                  </div>

                  <div style={sectionDividerStyle} />

                  {/* SECTION 3: VIDEO FRAME STYLES */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginRight: '2px' }}>Video Frame:</span>
                    {[
                      { id: 'cinema', label: 'Dark Cinema', style: { borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', border: '1.5px solid rgba(255,255,255,0.2)' } },
                      { id: 'glow', label: 'Purple Glow', style: { borderRadius: '12px', boxShadow: '0 0 25px rgba(168, 85, 247, 0.6)', border: '2px solid #a855f7' } },
                      { id: 'glass', label: 'Glass Frame', style: { borderRadius: '16px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '6px', border: '1px solid rgba(255,255,255,0.2)' } },
                      { id: 'rounded', label: 'Rounded Soft', style: { borderRadius: '20px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.4)' } }
                    ].map((frame) => (
                      <button
                        key={frame.id}
                        type="button"
                        onMouseDown={preventFocusLoss}
                        onClick={() => applyVideoStyle(frame.style)}
                        style={{
                          ...btnStyle,
                          fontSize: '11px',
                          padding: '4px 10px',
                          background: 'rgba(255,255,255,0.06)',
                          borderColor: 'rgba(255,255,255,0.15)',
                          color: '#cbd5e1'
                        }}
                      >
                        {frame.label}
                      </button>
                    ))}
                  </div>

                  <div style={sectionDividerStyle} />

                  {/* SECTION 4: DELETE VIDEO */}
                  <div>
                    <button
                      type="button"
                      onMouseDown={preventFocusLoss}
                      onClick={removeSelectedMedia}
                      style={{ ...btnStyle, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                      title="Delete Selected Video"
                    >
                      🗑 Delete Video
                    </button>
                  </div>
                </div>
              )}



              {/* EDITOR VIEWPORT CONTAINER: Strictly clips selection overlay & prevents leaking into toolbar */}
              <div 
                className="editor-viewport-container" 
                style={{ 
                  position: 'relative', 
                  overflow: 'hidden', 
                  borderRadius: '0 0 12px 12px',
                  background: '#04070d',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* IMAGE / VIDEO SELECTION BOUNDING BOX & 8 RESIZE HANDLES OVERLAY */}
                {selectedImageNode && imageBounds && (
                  <div
                    style={{
                      position: 'absolute',
                      top: `${imageBounds.top}px`,
                      left: `${imageBounds.left}px`,
                      width: `${imageBounds.width}px`,
                      height: `${imageBounds.height}px`,
                      border: '2px solid #ffffff',
                      pointerEvents: 'none',
                      zIndex: 100,
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Floating Quick Action Badge */}
                    {(() => {
                      const isVid = (selectedImageNode.tagName === 'VIDEO' || 
                                     selectedImageNode.classList?.contains('video-wrapper') || 
                                     selectedImageNode.classList?.contains('youtube-video-wrapper') || 
                                     selectedImageNode.classList?.contains('vimeo-video-wrapper') || 
                                     selectedImageNode.classList?.contains('direct-video-wrapper')) &&
                                     !selectedImageNode.classList?.contains('social-embed-wrapper') &&
                                     !selectedImageNode.classList?.contains('social-embed-card');

                      const sourceLink = selectedImageNode.getAttribute?.('data-source-url') ||
                                         selectedImageNode.querySelector?.('img')?.getAttribute('data-source-url') ||
                                         selectedImageNode.querySelector?.('a')?.getAttribute('href') ||
                                         selectedImageNode.closest?.('a')?.getAttribute('href');

                      return (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-32px',
                            right: '0px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            zIndex: 101
                          }}
                        >
                          {sourceLink && /^https?:\/\//i.test(sourceLink) && (
                            <a
                              href={sourceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onMouseDown={preventFocusLoss}
                              style={{
                                background: 'rgba(16, 185, 129, 0.9)',
                                color: '#ffffff',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 800,
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                                pointerEvents: 'auto',
                                cursor: 'pointer'
                              }}
                              title={`View Original Source: ${sourceLink}`}
                            >
                              <span>🔗 Open Source ↗</span>
                            </a>
                          )}

                          <div
                            style={{
                              background: isVid ? '#8b5cf6' : '#2563eb',
                              color: '#ffffff',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                              pointerEvents: 'auto',
                              cursor: 'pointer'
                            }}
                            onMouseDown={preventFocusLoss}
                            onClick={() => {
                              setActiveTab(isVid ? 'Video Format' : 'Picture Format');
                            }}
                          >
                            <span>{isVid ? '🎥 Video Format ▾' : '🖼️ Picture Format ▾'}</span>
                          </div>

                          <button
                            type="button"
                            style={{
                              background: '#ef4444',
                              color: '#ffffff',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                              pointerEvents: 'auto',
                              cursor: 'pointer'
                            }}
                            onMouseDown={preventFocusLoss}
                            onClick={removeSelectedMedia}
                            title={isVid ? 'Remove Video' : 'Remove Image'}
                          >
                            <Trash2 size={12} color="#ffffff" /> Remove
                          </button>
                        </div>
                      );
                    })()}

                    {/* 8 WHITE RESIZE HANDLE CIRCLES */}
                    {[
                      { dir: 'nw', top: '-5px', left: '-5px', cursor: 'nwse-resize' },
                      { dir: 'n', top: '-5px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
                      { dir: 'ne', top: '-5px', right: '-5px', cursor: 'nesw-resize' },
                      { dir: 'w', top: '50%', left: '-5px', transform: 'translateY(-50%)', cursor: 'ew-resize' },
                      { dir: 'e', top: '50%', right: '-5px', transform: 'translateY(-50%)', cursor: 'ew-resize' },
                      { dir: 'sw', bottom: '-5px', left: '-5px', cursor: 'nesw-resize' },
                      { dir: 's', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
                      { dir: 'se', bottom: '-5px', right: '-5px', cursor: 'nwse-resize' }
                    ].map((handle, idx) => (
                      <div
                        key={idx}
                        className="image-resize-handle"
                        onMouseDown={(e) => handleResizeStart(e, handle.dir)}
                        style={{
                          position: 'absolute',
                          top: handle.top,
                          left: handle.left,
                          right: handle.right,
                          bottom: handle.bottom,
                          transform: handle.transform,
                          width: '10px',
                          height: '10px',
                          background: '#ffffff',
                          border: '1.5px solid #0f172a',
                          borderRadius: '50%',
                          cursor: handle.cursor,
                          pointerEvents: 'auto',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* FLOATING QUICK FORMATTING & INSERTION TOOLBAR (MICROSOFT WORD 2-ROW DESIGN) */}
                {floatingTool.visible && !selectedImageNode && (
                  <div 
                    className="floating-format-toolbar"
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: `${floatingTool.top}px`,
                      left: `${floatingTool.left}px`,
                      background: '#0f172a',
                      border: '1.5px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '10px',
                      padding: '6px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      boxShadow: '0 16px 36px rgba(0,0,0,0.85)',
                      zIndex: 9999,
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    {/* ROW 1: Font Family, Font Size, Grow/Shrink Font, Format Painter, Styles */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {/* Custom Font Family Dropdown */}
                      <div style={{ position: 'relative' }}>
                        <button
                          type="button"
                          onMouseDown={preventFocusLoss}
                          onClick={() => {
                            setShowFloatingFontFamilyMenu(!showFloatingFontFamilyMenu);
                            setShowFloatingFontSizeMenu(false);
                            setShowFloatingStylesMenu(false);
                            setShowFloatingColorPicker(false);
                            setShowFloatingHighlightPicker(false);
                            setShowFloatingPicturesMenu(false);
                            setShowFloatingVideosMenu(false);
                          }}
                          style={{
                            ...miniBtnStyle,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            minWidth: '100px',
                            maxWidth: '125px',
                            justifyContent: 'space-between',
                            background: showFloatingFontFamilyMenu ? 'rgba(56, 189, 248, 0.25)' : miniBtnStyle.background
                          }}
                          title="Font Family"
                        >
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {fontFamily.includes('Aptos Display') ? 'Aptos Display' : fontFamily.split(',')[0].replace(/'/g, '')}
                          </span>
                          <ChevronDown size={11} color="#94a3b8" />
                        </button>

                        {showFloatingFontFamilyMenu && (
                          <div
                            onMouseDown={preventFocusLoss}
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 6px)',
                              left: '0',
                              width: '160px',
                              maxHeight: '220px',
                              overflowY: 'auto',
                              background: '#0f172a',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              borderRadius: '8px',
                              padding: '4px 0',
                              boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
                              zIndex: 10001
                            }}
                          >
                            {[
                              { name: 'Aptos (Body)', val: 'Aptos, sans-serif' },
                              { name: 'Aptos Display', val: "'Aptos Display', sans-serif" },
                              { name: 'Arial', val: 'Arial, sans-serif' },
                              { name: 'Georgia', val: 'Georgia, serif' },
                              { name: 'Times New Roman', val: "'Times New Roman', serif" },
                              { name: 'Segoe UI', val: "'Segoe UI', sans-serif" },
                              { name: 'Calibri', val: 'Calibri, sans-serif' },
                              { name: 'Verdana', val: 'Verdana, sans-serif' },
                              { name: 'Courier New', val: "'Courier New', monospace" }
                            ].map(item => (
                              <button
                                key={item.name}
                                type="button"
                                onMouseDown={preventFocusLoss}
                                onClick={() => {
                                  applyFontFamilyToSelection(item.val);
                                  setShowFloatingFontFamilyMenu(false);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '5px 10px',
                                  background: fontFamily === item.val ? 'rgba(56,189,248,0.2)' : 'transparent',
                                  border: 'none',
                                  color: '#fff',
                                  fontSize: '11px',
                                  fontFamily: item.val,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  display: 'block'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = fontFamily === item.val ? 'rgba(56,189,248,0.2)' : 'transparent'}
                              >
                                {item.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Custom Font Size Dropdown */}
                      <div style={{ position: 'relative' }}>
                        <button
                          type="button"
                          onMouseDown={preventFocusLoss}
                          onClick={() => {
                            setShowFloatingFontSizeMenu(!showFloatingFontSizeMenu);
                            setShowFloatingFontFamilyMenu(false);
                            setShowFloatingStylesMenu(false);
                            setShowFloatingColorPicker(false);
                            setShowFloatingHighlightPicker(false);
                            setShowFloatingPicturesMenu(false);
                            setShowFloatingVideosMenu(false);
                          }}
                          style={{
                            ...miniBtnStyle,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            padding: '3px 6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            minWidth: '48px',
                            justifyContent: 'space-between',
                            background: showFloatingFontSizeMenu ? 'rgba(56, 189, 248, 0.25)' : miniBtnStyle.background
                          }}
                          title="Font Size"
                        >
                          <span>{fontSize.replace('px', '')}</span>
                          <ChevronDown size={11} color="#94a3b8" />
                        </button>

                        {showFloatingFontSizeMenu && (
                          <div
                            onMouseDown={preventFocusLoss}
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 6px)',
                              left: '0',
                              width: '70px',
                              maxHeight: '200px',
                              overflowY: 'auto',
                              background: '#0f172a',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              borderRadius: '8px',
                              padding: '4px 0',
                              boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
                              zIndex: 10001
                            }}
                          >
                            {['9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '36px', '48px', '72px'].map(sz => (
                              <button
                                key={sz}
                                type="button"
                                onMouseDown={preventFocusLoss}
                                onClick={() => {
                                  applyFontSizeToSelection(sz);
                                  setShowFloatingFontSizeMenu(false);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '4px 8px',
                                  background: fontSize === sz ? 'rgba(56,189,248,0.2)' : 'transparent',
                                  border: 'none',
                                  color: '#fff',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textAlign: 'center',
                                  display: 'block'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = fontSize === sz ? 'rgba(56,189,248,0.2)' : 'transparent'}
                              >
                                {sz.replace('px', '')}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Increase & Decrease Font Size */}
                      <button type="button" onMouseDown={preventFocusLoss} onClick={handleGrowFont} style={miniBtnStyle} title="Increase Font Size (A^)">A^</button>
                      <button type="button" onMouseDown={preventFocusLoss} onClick={handleShrinkFont} style={miniBtnStyle} title="Decrease Font Size (Av)">Av</button>

                      {/* Format Painter */}
                      <button 
                        type="button" 
                        onMouseDown={preventFocusLoss} 
                        onClick={handleFormatPainterClick} 
                        style={{ ...miniBtnStyle, background: isFormatPainterActive ? '#3b82f6' : miniBtnStyle.background }} 
                        title="Format Painter"
                      >
                        <Paintbrush size={12} color={isFormatPainterActive ? '#fff' : '#facc15'} />
                      </button>

                      {/* Quick Styles / Heading Dropdown */}
                      <div style={{ position: 'relative' }}>
                        <button
                          type="button"
                          onMouseDown={preventFocusLoss}
                          onClick={() => {
                            setShowFloatingStylesMenu(!showFloatingStylesMenu);
                            setShowFloatingFontFamilyMenu(false);
                            setShowFloatingFontSizeMenu(false);
                            setShowFloatingColorPicker(false);
                            setShowFloatingHighlightPicker(false);
                            setShowFloatingPicturesMenu(false);
                            setShowFloatingVideosMenu(false);
                          }}
                          style={{
                            ...miniBtnStyle,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#38bdf8',
                            background: showFloatingStylesMenu ? 'rgba(56, 189, 248, 0.25)' : miniBtnStyle.background
                          }}
                          title="Styles & Headings"
                        >
                          <span>Styles ▾</span>
                        </button>

                        {showFloatingStylesMenu && (
                          <div
                            onMouseDown={preventFocusLoss}
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 6px)',
                              left: '0',
                              width: '150px',
                              background: '#0f172a',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              borderRadius: '8px',
                              padding: '4px 0',
                              boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
                              zIndex: 10001
                            }}
                          >
                            {[
                              { label: 'Normal Text', tag: 'p', style: { fontSize: '12px', color: '#f8fafc' } },
                              { label: 'Heading 1', tag: 'h1', style: { fontSize: '15px', fontWeight: 800, color: '#38bdf8' } },
                              { label: 'Heading 2', tag: 'h2', style: { fontSize: '13.5px', fontWeight: 700, color: '#60a5fa' } },
                              { label: 'Heading 3', tag: 'h3', style: { fontSize: '12.5px', fontWeight: 600, color: '#93c5fd' } },
                              { label: 'Quote / Callout', tag: 'quote', style: { fontSize: '12px', fontStyle: 'italic', color: '#facc15' } }
                            ].map(item => (
                              <button
                                key={item.tag}
                                type="button"
                                onMouseDown={preventFocusLoss}
                                onClick={() => {
                                  applyStyleBlock(item.tag);
                                  setShowFloatingStylesMenu(false);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '6px 12px',
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#fff',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  display: 'block',
                                  ...item.style
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ROW 2: Bold, Italic, Underline, Highlight, Font Color, Align, Lists, Link, Insert Picture, Insert Video */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('bold')} style={miniBtnStyle} title="Bold (Ctrl+B)"><Bold size={13} /></button>
                      <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('italic')} style={miniBtnStyle} title="Italic (Ctrl+I)"><Italic size={13} /></button>
                      <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('underline')} style={miniBtnStyle} title="Underline (Ctrl+U)"><Underline size={13} /></button>

                      {/* Highlight Color Picker */}
                      <div style={{ position: 'relative' }}>
                        <button 
                          type="button" 
                          onMouseDown={preventFocusLoss} 
                          onClick={() => {
                            setShowFloatingHighlightPicker(!showFloatingHighlightPicker);
                            setShowFloatingColorPicker(false);
                            setShowFloatingPicturesMenu(false);
                            setShowFloatingVideosMenu(false);
                          }} 
                          style={{
                            ...miniBtnStyle,
                            background: showFloatingHighlightPicker ? '#3b82f6' : miniBtnStyle.background,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1px',
                            padding: '2px 5px'
                          }} 
                          title="Highlight Color"
                        >
                          <Highlighter size={12} color="#fef08a" />
                          <div style={{ width: '12px', height: '2px', background: '#facc15', borderRadius: '1px' }} />
                        </button>

                        {showFloatingHighlightPicker && (
                          <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 6px)',
                            left: '0',
                            background: '#0f172a',
                            border: '1px solid rgba(255,255,255,0.25)',
                            borderRadius: '8px',
                            padding: '6px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.7)',
                            zIndex: 10000
                          }}>
                            {[
                              { color: '#fef08a', title: 'Yellow' },
                              { color: '#a7f3d0', title: 'Emerald' },
                              { color: '#bae6fd', title: 'Sky Blue' },
                              { color: '#fbcfe8', title: 'Pink' },
                              { color: '#e9d5ff', title: 'Purple' },
                              { color: '#fed7aa', title: 'Orange' },
                              { color: 'transparent', title: 'Clear Highlight' }
                            ].map((item) => (
                              <div
                                key={item.color}
                                onMouseDown={preventFocusLoss}
                                onClick={() => {
                                  applyHighlight(item.color);
                                  setShowFloatingHighlightPicker(false);
                                }}
                                title={item.title}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  background: item.color === 'transparent' ? '#334155' : item.color,
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  border: '1px solid rgba(255,255,255,0.4)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '10px',
                                  color: '#fff'
                                }}
                              >
                                {item.color === 'transparent' && '✕'}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Font Text Color Picker */}
                      <div style={{ position: 'relative' }}>
                        <button 
                          type="button" 
                          onMouseDown={preventFocusLoss} 
                          onClick={() => {
                            setShowFloatingColorPicker(!showFloatingColorPicker);
                            setShowFloatingHighlightPicker(false);
                            setShowFloatingPicturesMenu(false);
                            setShowFloatingVideosMenu(false);
                          }} 
                          style={{
                            ...miniBtnStyle,
                            background: showFloatingColorPicker ? '#3b82f6' : miniBtnStyle.background,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1px',
                            padding: '2px 5px'
                          }} 
                          title="Font Color"
                        >
                          <Palette size={12} color="#ef4444" />
                          <div style={{ width: '12px', height: '2px', background: '#ef4444', borderRadius: '1px' }} />
                        </button>

                        {showFloatingColorPicker && (
                          <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 6px)',
                            left: '0',
                            background: '#0f172a',
                            border: '1px solid rgba(255,255,255,0.25)',
                            borderRadius: '8px',
                            padding: '6px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.7)',
                            zIndex: 10000
                          }}>
                            {[
                              { color: '#ffffff', title: 'White' },
                              { color: '#38bdf8', title: 'Sky Blue' },
                              { color: '#34d399', title: 'Emerald Green' },
                              { color: '#f59e0b', title: 'Amber / Yellow' },
                              { color: '#ef4444', title: 'Red' },
                              { color: '#a855f7', title: 'Purple' },
                              { color: '#f43f5e', title: 'Rose' },
                              { color: '#94a3b8', title: 'Muted Grey' }
                            ].map((item) => (
                              <div
                                key={item.color}
                                onMouseDown={preventFocusLoss}
                                onClick={() => {
                                  applyTextColor(item.color);
                                  setShowFloatingColorPicker(false);
                                }}
                                title={item.title}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  background: item.color,
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  border: '1px solid rgba(255,255,255,0.4)'
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('justifyLeft')} style={miniBtnStyle} title="Align Left"><AlignLeft size={13} /></button>
                      <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('justifyCenter')} style={miniBtnStyle} title="Align Center"><AlignCenter size={13} /></button>
                      <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('justifyRight')} style={miniBtnStyle} title="Align Right"><AlignRight size={13} /></button>

                      <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('insertUnorderedList')} style={miniBtnStyle} title="Bulleted List"><List size={13} /></button>
                      <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('insertOrderedList')} style={miniBtnStyle} title="Numbered List"><ListOrdered size={13} /></button>
                      <button type="button" onMouseDown={preventFocusLoss} onClick={openLinkModal} style={miniBtnStyle} title="Insert Link"><LinkIcon size={13} color="#38bdf8" /></button>

                      <span style={{ margin: '0 2px', color: 'rgba(255,255,255,0.2)' }}>|</span>

                      {/* FLOATING INSERT PICTURE DROPDOWN TOGGLE */}
                      <div style={{ position: 'relative' }}>
                        <button 
                          type="button" 
                          onMouseDown={preventFocusLoss} 
                          onClick={() => {
                            saveSelection();
                            setShowFloatingPicturesMenu(!showFloatingPicturesMenu);
                            setShowFloatingVideosMenu(false);
                            setShowFloatingColorPicker(false);
                            setShowFloatingHighlightPicker(false);
                          }} 
                          style={{
                            ...miniBtnStyle,
                            background: showFloatingPicturesMenu ? '#2563eb' : miniBtnStyle.background,
                            color: showFloatingPicturesMenu ? '#ffffff' : '#38bdf8'
                          }} 
                          title="Insert Picture"
                        >
                          <ImageIcon size={13} color={showFloatingPicturesMenu ? '#ffffff' : '#38bdf8'} />
                        </button>

                        {showFloatingPicturesMenu && (
                          <div 
                            onMouseDown={preventFocusLoss}
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 6px)',
                              left: '0',
                              width: '180px',
                              background: '#182030',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              borderRadius: '8px',
                              padding: '6px 0',
                              display: 'flex',
                              flexDirection: 'column',
                              boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
                              zIndex: 10000
                            }}
                          >
                            <div style={{ padding: '4px 10px 6px', fontSize: '10px', fontWeight: 800, color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase' }}>
                              Insert Picture
                            </div>
                            <button
                              type="button"
                              onMouseDown={preventFocusLoss}
                              onClick={() => {
                                saveSelection();
                                setShowFloatingPicturesMenu(false);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = '';
                                  fileInputRef.current.click();
                                }
                              }}
                              style={{ ...dropdownItemStyle, padding: '6px 10px', fontSize: '12px' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <Monitor size={14} color="#60a5fa" />
                              <span>This Device...</span>
                            </button>
                            <button
                              type="button"
                              onMouseDown={preventFocusLoss}
                              onClick={() => {
                                saveSelection();
                                setShowFloatingPicturesMenu(false);
                                setShowStockModal(true);
                              }}
                              style={{ ...dropdownItemStyle, padding: '6px 10px', fontSize: '12px' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <Search size={14} color="#facc15" />
                              <span>Stock Images...</span>
                            </button>
                            <button
                              type="button"
                              onMouseDown={preventFocusLoss}
                              onClick={() => {
                                saveSelection();
                                setShowFloatingPicturesMenu(false);
                                setShowUrlModal(true);
                              }}
                              style={{ ...dropdownItemStyle, padding: '6px 10px', fontSize: '12px' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <Globe size={14} color="#34d399" />
                              <span>Online Pictures...</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* FLOATING INSERT VIDEO DROPDOWN TOGGLE */}
                      <div style={{ position: 'relative' }}>
                        <button 
                          type="button" 
                          onMouseDown={preventFocusLoss} 
                          onClick={() => {
                            saveSelection();
                            setShowFloatingVideosMenu(!showFloatingVideosMenu);
                            setShowFloatingPicturesMenu(false);
                            setShowFloatingColorPicker(false);
                            setShowFloatingHighlightPicker(false);
                          }} 
                          style={{
                            ...miniBtnStyle,
                            background: showFloatingVideosMenu ? '#8b5cf6' : miniBtnStyle.background,
                            color: showFloatingVideosMenu ? '#ffffff' : '#c084fc'
                          }} 
                          title="Insert Video"
                        >
                          <Video size={13} color={showFloatingVideosMenu ? '#ffffff' : '#c084fc'} />
                        </button>

                        {showFloatingVideosMenu && (
                          <div 
                            onMouseDown={preventFocusLoss}
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 6px)',
                              left: '0',
                              width: '190px',
                              background: '#182030',
                              border: '1px solid rgba(255, 255, 255, 0.25)',
                              borderRadius: '8px',
                              padding: '6px 0',
                              display: 'flex',
                              flexDirection: 'column',
                              boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
                              zIndex: 10000
                            }}
                          >
                            <div style={{ padding: '4px 10px 6px', fontSize: '10px', fontWeight: 800, color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase' }}>
                              Insert Video
                            </div>
                            <button
                              type="button"
                              onMouseDown={preventFocusLoss}
                              onClick={() => {
                                saveSelection();
                                setShowFloatingVideosMenu(false);
                                if (videoFileInputRef.current) {
                                  videoFileInputRef.current.value = '';
                                  videoFileInputRef.current.click();
                                }
                              }}
                              style={{ ...dropdownItemStyle, padding: '6px 10px', fontSize: '12px' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <Monitor size={14} color="#60a5fa" />
                              <span>This Device...</span>
                            </button>
                            <button
                              type="button"
                              onMouseDown={preventFocusLoss}
                              onClick={() => {
                                saveSelection();
                                setShowFloatingVideosMenu(false);
                                setShowStockVideoModal(true);
                              }}
                              style={{ ...dropdownItemStyle, padding: '6px 10px', fontSize: '12px' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <Film size={14} color="#facc15" />
                              <span>Stock Videos...</span>
                            </button>
                            <button
                              type="button"
                              onMouseDown={preventFocusLoss}
                              onClick={() => {
                                saveSelection();
                                setShowFloatingVideosMenu(false);
                                setShowOnlineVideoModal(true);
                              }}
                              style={{ ...dropdownItemStyle, padding: '6px 10px', fontSize: '12px' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#253046'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <Play size={14} color="#34d399" />
                              <span>Online / Embed...</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* FLOATING LINK ACTION BADGE POPOVER */}
                {activeLinkPopover && activeLinkPopover.visible && (
                  <div
                    className="link-action-popover"
                    style={{
                      position: 'absolute',
                      top: `${activeLinkPopover.top}px`,
                      left: `${activeLinkPopover.left}px`,
                      background: '#0f172a',
                      border: '1.5px solid #38bdf8',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.85)',
                      zIndex: 99999
                    }}
                  >
                    <a
                      href={activeLinkPopover.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#38bdf8',
                        fontSize: '12px',
                        fontWeight: 800,
                        textDecoration: 'underline',
                        maxWidth: '220px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'inline-block'
                      }}
                      title="Click to open link in new tab"
                    >
                      🔗 Open in new tab ↗
                    </a>

                    <button
                      type="button"
                      onMouseDown={preventFocusLoss}
                      onClick={() => openLinkModalForEdit(activeLinkPopover.node)}
                      style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#f8fafc', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ✎ Edit
                    </button>

                    <button
                      type="button"
                      onMouseDown={preventFocusLoss}
                      onClick={() => removeLinkNode(activeLinkPopover.node)}
                      style={{ background: 'rgba(239, 68, 68, 0.2)', border: 'none', color: '#ef4444', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      🗑 Remove
                    </button>
                  </div>
                )}

                {/* RICH EDITABLE CONTENT AREA */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="editor-body"
                  data-placeholder="Type or paste your article content here..."
                  onPaste={handlePaste}
                  onMouseDown={handleEditorMouseDown}
                  onInput={handleEditorInput}
                  onKeyDown={handleKeyDown}
                  onSelect={handleSelectionChange}
                  onKeyUp={handleSelectionChange}
                  onMouseUp={handleSelectionChange}
                  onDoubleClick={handleEditorDoubleClick}
                  onDragStart={handleEditorDragStart}
                  onDragOver={handleEditorDragOver}
                  onDrop={handleEditorDrop}

                  style={{
                    minHeight: '380px',
                    maxHeight: '640px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: '24px 32px 140px 32px',
                    color: '#f8fafc',
                    fontFamily: fontFamily,
                    fontSize: '16px',
                    lineHeight: '1.7',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                    wordWrap: 'break-word',
                    outline: 'none',
                    background: '#04070d'
                  }}
                />

              {/* GLOBAL STYLES FOR EDITOR CONTENT WRAPPING */}
              <style>{`
                .editor-body,
                .editor-body * {
                  overflow-wrap: anywhere !important;
                  word-break: break-word !important;
                  white-space: pre-wrap;
                  max-width: 100%;
                  min-width: 0;
                  box-sizing: border-box !important;
                }
                .editor-body {
                  color: #f8fafc !important;
                  overflow-x: hidden;
                }
                .editor-body p,
                .editor-body div,
                .editor-body li,
                .editor-body blockquote,
                .editor-body h1,
                .editor-body h2,
                .editor-body h3 {
                  color: #f8fafc;
                }
                .editor-body span:not([style*="color"]) {
                  color: #f8fafc;
                }
                .editor-body a,
                .editor-body a * {
                  color: #38bdf8 !important;
                  text-decoration: underline !important;
                  cursor: pointer;
                }
                .editor-body span,
                .editor-body p,
                .editor-body div,
                .editor-body a,
                .editor-body li,
                .editor-body td,
                .editor-body th {
                  background-color: transparent !important;
                  background: transparent !important;
                }
                .editor-body img,
                .editor-body .img-wrapper,
                .editor-body figure {
                  max-width: 100% !important;
                  box-sizing: border-box !important;
                }
                .editor-body figure.video-wrapper,
                .editor-body figure.img-wrapper,
                .editor-body .video-wrapper,
                .editor-body .img-wrapper {
                  position: relative !important;
                }
              `}</style>

              {/* NATIVE DRAG DROP INDICATOR */}
              {dropIndicatorPos && (
                <div style={{
                  position: 'absolute',
                  top: `${dropIndicatorPos.top}px`,
                  left: `${dropIndicatorPos.left}px`,
                  width: '180px',
                  height: '2px',
                  background: '#3b82f6',
                  pointerEvents: 'none',
                  zIndex: 9999,
                  boxShadow: '0 0 4px rgba(59,130,246,0.8)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-18px',
                    left: '0px',
                    background: '#3b82f6',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '2px 4px',
                    borderRadius: '2px',
                    whiteSpace: 'nowrap'
                  }}>
                    DROP IMAGE HERE
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Featured Pin Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="featured" style={{ cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              Pin as Featured Lead Story on Homepage
            </label>
          </div>

          {/* 2-WAY INTERACTIVE AUTHOR & EDITOR DISCUSSION / Q&A THREAD */}
          <div style={{
            marginTop: '1.5rem',
            background: '#090d16',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#c084fc" />
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Editorial Discussion & Author Q&A Thread
                </h4>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {Array.isArray(formData.comments) ? formData.comments.length : 0} Messages
              </span>
            </div>

            {/* Timeline of Discussion Messages */}
            <div 
              ref={commentsContainerRef}
              style={{
                maxHeight: '240px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '12px',
                paddingRight: '4px'
              }}
            >
              {!Array.isArray(formData.comments) || formData.comments.length === 0 ? (
                <div style={{ fontSize: '0.825rem', color: '#64748b', fontStyle: 'italic', padding: '12px 0', textAlign: 'center' }}>
                  No discussion notes yet. Type a question or message below to start communicating with the {currentUser?.roleId === 'editor' ? 'Author' : 'Editor'}.
                </div>
              ) : (
                formData.comments.map((msg, idx) => {
                  const isMe = (msg.senderName?.toLowerCase() === currentUser?.name?.toLowerCase()) || 
                               (msg.senderName?.toLowerCase() === currentUser?.username?.toLowerCase()) ||
                               (msg.senderId && msg.senderId === currentUser?.id);
                  const isEditorRole = msg.senderRole === 'Editor' || msg.senderRole === 'EDITOR';
                  const isSuperAdminRole = msg.senderRole === 'Super Admin' || msg.senderRole === 'SUPER_ADMIN';

                  return (
                    <div
                      key={msg.id || idx}
                      style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '88%',
                        width: 'fit-content',
                        background: isMe ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: isMe ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.825rem', color: isMe ? '#38bdf8' : '#f8fafc' }}>
                            {msg.senderName || 'Staff User'}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: isEditorRole ? 'rgba(192, 132, 252, 0.2)' : (isSuperAdminRole ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'),
                            color: isEditorRole ? '#c084fc' : (isSuperAdminRole ? '#ef4444' : '#f59e0b')
                          }}>
                            {isEditorRole ? 'Editor' : (isSuperAdminRole ? 'Super Admin' : 'Author')}
                          </span>
                        </div>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5', wordBreak: 'break-word' }}>
                        {msg.text || msg.content}
                      </p>
                    </div>
                  );
                })
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* Error Banner if message sending fails */}
            {commentError && (
              <div style={{ color: '#ef4444', fontSize: '0.775rem', marginBottom: '8px', fontWeight: 600 }}>
                ⚠️ {commentError}
              </div>
            )}

            {/* Input Form for New Discussion Message */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                disabled={isSendingComment}
                placeholder={currentUser?.roleId === 'editor' ? "Reply to Author or post editorial notes (e.g. 'Paragraph 2 fixed...')" : "Ask Editor a question (e.g. 'Why was this rejected?')..."}
                value={commentInputText}
                onChange={(e) => setCommentInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
                style={{ flex: 1, background: '#182030', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                className="btn btn-primary"
                disabled={isSendingComment || !commentInputText.trim()}
                onClick={handleSendComment}
                style={{
                  background: isSendingComment ? '#64748b' : 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                  border: 'none',
                  fontWeight: 800,
                  padding: '0 18px',
                  fontSize: '0.85rem',
                  cursor: isSendingComment || !commentInputText.trim() ? 'not-allowed' : 'pointer',
                  opacity: isSendingComment || !commentInputText.trim() ? 0.6 : 1
                }}
              >
                {isSendingComment ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (editorRef.current) {
                setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
              }
              setShowPreviewModal(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1e293b',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              fontWeight: 800,
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Eye size={16} />
            Preview Article
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            {/* AUTHOR / CONTENT ADMIN WORKFLOW ACTIONS */}
            {(!currentUser?.roleId || currentUser?.roleId === 'content_admin' || currentUser?.roleId === 'super_admin') && (
              <>
                {/* Save Draft */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={isSaving}
                  onClick={(e) => executeSaveAction(e, 'Draft')}
                  style={{ background: '#334155', color: '#f8fafc', border: '1px solid #475569', opacity: isSaving ? 0.6 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                >
                  {isSaving ? 'Saving Draft...' : 'Save Draft'}
                </button>

                {/* Submit for Editorial Review */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={isSaving}
                  onClick={(e) => executeSaveAction(e, 'Pending Editor Assignment')}
                  style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)', fontWeight: 800, opacity: isSaving ? 0.6 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                >
                  {isSaving ? 'Submitting...' : 'Submit for Editorial Review'}
                </button>
              </>
            )}

            {/* EDITOR QUALITY WORKFLOW ACTIONS */}
            {(currentUser?.roleId === 'editor' || currentUser?.roleId === 'super_admin') && articleToEdit && (
              <>
                {/* Save Editorial Edits */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={isSaving}
                  onClick={(e) => executeSaveAction(e, formData.status || 'Draft')}
                  style={{ background: '#334155', color: '#f8fafc', border: '1px solid #475569', fontWeight: 700, opacity: isSaving ? 0.6 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                >
                  {isSaving ? 'Saving Edits...' : 'Save Edits'}
                </button>

                {/* Option 1: Return to Author (Changes Requested) */}
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowFeedbackModal(true)}
                  style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', fontWeight: 800 }}
                >
                  Return to Author (Request Changes)
                </button>

                {/* Option 2: Approve Article Quality */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async (e) => {
                    e.preventDefault();
                    const bodyHtml = editorRef.current ? editorRef.current.innerHTML : formData.content;
                    const sanitizedBody = sanitizeArticleHtml(bodyHtml || '');
                    await updateArticle({ ...formData, content: sanitizedBody, status: 'Approved by Editor' });
                    onClose();
                  }}

                  style={{ background: '#10b981', color: '#ffffff', border: 'none', fontWeight: 800 }}
                >
                  ✓ Approve Article Quality
                </button>
              </>
            )}

            {/* PUBLISH ACTION BUTTON: Available for Editor, Content Admin, & Super Admin */}
            {(currentUser?.roleId === 'editor' || currentUser?.roleId === 'content_admin' || currentUser?.roleId === 'super_admin' || !currentUser?.roleId) && (
              <button
                type="button"
                className="btn btn-primary"
                disabled={isSaving}
                onClick={(e) => executeSaveAction(e, 'Published')}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 900,
                  opacity: isSaving ? 0.6 : 1,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                }}
              >
                {isSaving ? 'Publishing...' : (articleToEdit?.status === 'Published' ? '✓ Update Live Article' : '🚀 Publish Article')}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* SUB-MODAL: EDITOR REVISION FEEDBACK INPUT PROMPT */}
      {showFeedbackModal && (
        <div style={subModalOverlayStyle}>
          <div style={{ ...subModalContentStyle, maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💬 Request Changes from Author
              </h3>
              <button type="button" onClick={() => setShowFeedbackModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px', lineHeight: '1.5' }}>
              Provide mandatory feedback comments for the Author (e.g. <em>"Please rewrite paragraph 3. Headline needs improvement. Statistics need sources."</em>):
            </p>

            <textarea
              className="form-control"
              rows={4}
              placeholder="Enter detailed editorial comments..."
              value={feedbackInputText}
              onChange={(e) => setFeedbackInputText(e.target.value)}
              style={{ width: '100%', background: '#090d16', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.2)' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowFeedbackModal(false)}>Cancel</button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={!feedbackInputText.trim()}
                onClick={async () => {
                  if (articleToEdit) {
                    await requestChangesOnArticle(articleToEdit.id, feedbackInputText.trim());
                    setShowFeedbackModal(false);
                    onClose();
                  }
                }}
                style={{ background: '#ef4444', color: '#fff', border: 'none', opacity: feedbackInputText.trim() ? 1 : 0.5, fontWeight: 800 }}
              >
                Send Feedback & Return to Author
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 1: STOCK IMAGES GALLERY */}
      {showStockModal && (
        <div style={subModalOverlayStyle}>
          <div style={{ ...subModalContentStyle, maxWidth: '580px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              🔍 Stock Images Gallery
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', maxHeight: '320px', overflowY: 'auto', marginBottom: '18px' }}>
              {[
                { title: 'Tech Hardware', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
                { title: 'Corporate Skyscraper', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
                { title: 'Global Network', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
                { title: 'Cinema Theatre', url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80' },
                { title: 'Stadium Sports', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80' },
                { title: 'Modern Lifestyle', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80' }
              ].map((stock, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    insertImageHtml(stock.url, stock.title, 'center');
                    setShowStockModal(false);
                  }}
                  style={{
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: '#04070d'
                  }}
                >
                  <img src={stock.url} alt={stock.title} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                  <div style={{ padding: '6px', fontSize: '11px', fontWeight: 700, textAlign: 'center', color: '#cbd5e1' }}>
                    {stock.title}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowStockModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: ONLINE PICTURES & SOCIAL MEDIA IMAGE EXTRACTOR */}
      {showUrlModal && (
        <div style={subModalOverlayStyle}>
          <div style={subModalContentStyle}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🖼️ Insert Picture from Web / Social Media
            </h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (imageUrlInput.trim()) {
                const urlToInsert = imageUrlInput.trim();
                const capToInsert = imageCaptionInput;
                const alignToInsert = imageAlignInput;
                setShowUrlModal(false);
                setImageUrlInput('');
                setImageCaptionInput('');
                await insertImageHtml(urlToInsert, capToInsert, alignToInsert);
              }
            }}>
              {(() => {
                const liveParsed = imageUrlInput.trim() ? parseMediaUrl(imageUrlInput.trim()) : null;
                return (
                  <>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '12px' }}>Image URL or Social Media Post / Video Link</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Paste link: https://x.com/... or https://instagram.com/... or https://youtube.com/... or Image URL"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        required
                      />

                      {/* Live Validation Feedback Badge */}
                      {liveParsed && (
                        <div style={{
                          marginTop: '8px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span>✨ Auto-Extracts Picture from {liveParsed.provider || 'Link'}</span>
                        </div>
                      )}

                      <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                        Pasting a post link (Twitter/X, Instagram, Facebook, YouTube, Reddit, Pinterest) automatically extracts the clean, full-resolution picture into the article.
                      </span>
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '12px' }}>Photo Caption / Credit (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Photo credit: Reuters / @username"
                        value={imageCaptionInput}
                        onChange={(e) => setImageCaptionInput(e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '18px' }}>
                      <label style={{ fontSize: '12px' }}>Alignment Layout</label>
                      <select
                        className="form-control"
                        value={imageAlignInput}
                        onChange={(e) => setImageAlignInput(e.target.value)}
                      >
                        <option value="center">Centered (Full Width Banner)</option>
                        <option value="left">Float Left (Wrap Text Right)</option>
                        <option value="right">Float Right (Wrap Text Left)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowUrlModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary" style={{ background: '#3b82f6' }}>🖼️ Insert Picture</button>
                    </div>
                  </>
                );
              })()}
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL 3: STOCK VIDEOS GALLERY */}
      {showStockVideoModal && (
        <div style={subModalOverlayStyle}>
          <div style={{ ...subModalContentStyle, maxWidth: '580px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              🎥 Stock Videos Gallery
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxHeight: '360px', overflowY: 'auto', marginBottom: '18px' }}>
              {[
                { title: 'Global Finance & Market Ticker', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', poster: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80' },
                { title: 'Tech Cloud & Data Processing', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80' },
                { title: 'World News Studio Broadcast', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', poster: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80' },
                { title: 'EV & Clean Energy Innovation', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylikes.mp4', poster: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80' }
              ].map((stock, i) => (
                <div 
                  key={i} 
                  onClick={() => insertStockVideo(stock.url, stock.title)}
                  style={{
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: '#04070d',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                >
                  <div style={{ position: 'relative', height: '110px' }}>
                    <img src={stock.poster} alt={stock.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={18} color="#ffffff" fill="#ffffff" />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px', fontSize: '12px', fontWeight: 700, textAlign: 'center', color: '#f8fafc' }}>
                    {stock.title}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowStockVideoModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 4: ONLINE VIDEO / EMBED URL INPUT */}
      {showOnlineVideoModal && (
        <div style={subModalOverlayStyle}>
          <div style={subModalContentStyle}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🌐 Online Video / Embed URL
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              insertOnlineVideo();
            }}>
              {(() => {
                const liveParsed = videoUrlInput.trim() ? parseVideoUrl(videoUrlInput.trim()) : null;
                return (
                  <>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '12px' }}>Video Link or YouTube / Vimeo URL or Embed Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or MP4 URL"
                        value={videoUrlInput}
                        onChange={(e) => setVideoUrlInput(e.target.value)}
                        required
                      />
                      
                      {/* Live Validation Feedback Badge */}
                      {liveParsed && (
                        <div style={{
                          marginTop: '8px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          background: liveParsed.isEmbeddable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: liveParsed.isEmbeddable ? '#10b981' : '#f59e0b',
                          border: `1px solid ${liveParsed.isEmbeddable ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {liveParsed.badgeText}
                        </div>
                      )}

                      <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                        Supports YouTube, Vimeo, Loom, Dailymotion, Streamable, direct MP4 video URLs, and web links.
                      </span>
                    </div>

                    <div className="form-group" style={{ marginBottom: '18px' }}>
                      <label style={{ fontSize: '12px' }}>Video Caption</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Video source: Reuters / YouTube Broadcast"
                        value={videoCaptionInput}
                        onChange={(e) => setVideoCaptionInput(e.target.value)}
                      />
                    </div>
                  </>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowOnlineVideoModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#8b5cf6' }}>Insert Video</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL 5: HYPERLINK INSERT/EDIT MODAL */}
      {showLinkModal && (
        <div style={subModalOverlayStyle}>
          <div style={{ ...subModalContentStyle, maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔗 {selectedLinkNode ? 'Edit Hyperlink' : 'Insert Hyperlink'}
              </h3>
              <button type="button" onClick={() => setShowLinkModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <form onSubmit={handleInsertOrUpdateLink}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>Destination Web URL (Link)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://www.instagram.com/p/... or https://example.com"
                  value={linkUrlInput}
                  onChange={(e) => setLinkUrlInput(e.target.value)}
                  autoFocus
                  required
                />
                <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                  ✓ Links will automatically open in a new tab (<code style={{ color: '#38bdf8' }}>target="_blank"</code>).
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>Text to Display (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. View Instagram Post"
                  value={linkTextInput}
                  onChange={(e) => setLinkTextInput(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {selectedLinkNode ? (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeLinkNode(selectedLinkNode)}
                    style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', fontWeight: 700 }}
                  >
                    🗑 Remove Link
                  </button>
                ) : <div />}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowLinkModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#3b82f6', fontWeight: 800 }}>
                    {selectedLinkNode ? 'Update Link' : 'Insert Link'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL: LIVE ARTICLE READER PREVIEW OVERLAY */}
      {showPreviewModal && (() => {
        const currentTitle = formData.title?.trim() || 'Untitled Article Headline';
        const currentCategory = formData.category || 'General News';
        const currentAuthor = isSuperAdmin ? (formData.author || currentUser?.name || 'Super Admin') : (currentUser?.name || formData.author || 'Content Admin');
        const currentSummary = formData.summary?.trim() || '';
        const currentCoverImage = formData.imageUrl || formData.image || '';
        const currentBodyHtml = editorRef.current?.innerHTML || formData.content || '';

        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(2, 6, 23, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '980px',
              maxHeight: '90vh',
              background: '#090d16',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '12px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Reader Preview Header */}
              <div style={{
                padding: '16px 24px',
                background: '#0f172a',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    background: '#eab308',
                    color: '#000000',
                    fontSize: '11px',
                    fontWeight: 900,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Reader Preview Mode
                  </span>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                    This is how your published article will appear to readers on Daily Brief.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px', fontWeight: 800 }}
                >
                  ✕
                </button>
              </div>

              {/* Reader Preview Body */}
              <div style={{ padding: '32px 44px', overflowY: 'auto', flex: 1, color: '#f8fafc' }}>
                {/* Kicker / Supertitle (Overline) */}
                {formData.kicker ? (
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#facc15', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1.5px' }}>
                    {formData.kicker}
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#eab308', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>
                    {currentCategory}
                  </div>
                )}

                {/* Title */}
                <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', lineHeight: 1.25, marginBottom: '14px' }}>
                  {currentTitle}
                </h1>

                {/* Summary Excerpt */}
                {currentSummary ? (
                  <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '22px', fontStyle: 'italic', borderLeft: '3px solid #38bdf8', paddingLeft: '14px', background: 'rgba(56,189,248,0.04)', padding: '10px 14px', borderRadius: '0 6px 6px 0' }}>
                    {currentSummary}
                  </p>
                ) : (
                  <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginBottom: '16px' }}>
                    (No lead summary entered)
                  </div>
                )}

                {/* Author & Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px' }}>
                    {currentAuthor.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>By {currentAuthor}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Published on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • 3 min read</div>
                  </div>
                </div>

                {/* Lead Cover Image */}
                {currentCoverImage ? (
                  <div style={{ marginBottom: '28px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={currentCoverImage} alt="Article Cover" style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                ) : (
                  <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '8px', color: '#64748b', fontSize: '12px', marginBottom: '24px', textAlign: 'center' }}>
                    📷 Cover image not uploaded yet (Optional)
                  </div>
                )}

                {/* Rich Body Content */}
                <div
                  className="preview-article-body"
                  onClick={(e) => {
                    const img = e.target.closest('img');
                    if (img) {
                      const sourceUrl = img.getAttribute('data-source-url') || img.closest('a')?.getAttribute('href');
                      if (sourceUrl && sourceUrl !== '#' && !sourceUrl.startsWith('javascript:')) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(sourceUrl, '_blank', 'noopener,noreferrer');
                      }
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: currentBodyHtml.trim() ? currentBodyHtml : '<p style="color:#94a3b8; font-style:italic;">No article body text written yet.</p>' }}
                  style={{ fontSize: '16px', lineHeight: '1.8', color: '#cbd5e1' }}
                />
              </div>

              {/* Preview Footer Actions */}
              <div style={{ padding: '16px 24px', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="btn btn-secondary"
                >
                  ← Return to Editor
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    setShowPreviewModal(false);
                    handleSubmit(e);
                  }}
                  className="btn btn-primary"
                >
                  {articleToEdit ? "Confirm Update & Publish" : "Confirm & Publish Article"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </Modal>
  );
}

const btnStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '6px',
  padding: '5px 9px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease'
};

const selectStyle = {
  background: '#0f172a',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '6px',
  padding: '4px 8px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer'
};

const sectionDividerStyle = {
  width: '1px',
  height: '28px',
  background: 'rgba(255, 255, 255, 0.15)'
};

const miniBtnStyle = {
  background: 'rgba(255, 255, 255, 0.12)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  padding: '4px 6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const dropdownItemStyle = {
  width: '100%',
  padding: '10px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '13px',
  fontWeight: 700,
  color: '#ffffff',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.15s ease'
};

const pickerDropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  background: '#0f172a',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '8px',
  padding: '8px',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '6px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
  zIndex: 9999
};

const subModalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 99999
};

const subModalContentStyle = {
  background: '#0f172a',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '16px',
  padding: '24px',
  width: '90%',
  maxWidth: '480px',
  color: '#fff',
  boxShadow: '0 25px 50px rgba(0,0,0,0.7)'
};
