"use client";

import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { useAdmin } from '../context/AdminContext';
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
  Eye
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

  // Update bounds of selected image relative to editor container
  const updateImageBounds = (node = selectedImageNode) => {
    if (!node || !editorRef.current) {
      setImageBounds(null);
      return;
    }
    const nodeRect = node.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    setImageBounds({
      top: nodeRect.top - editorRect.top + editorRef.current.scrollTop,
      left: nodeRect.left - editorRect.left + editorRef.current.scrollLeft,
      width: nodeRect.width,
      height: nodeRect.height
    });
  };

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

  const handleEditorMouseDown = (e) => {
    // Select IMG or Text Box div for 8-point resizing & layout options
    const targetBox = e.target?.closest?.('img, [id^="tb_"]');
    if (targetBox && editorRef.current?.contains(targetBox) && targetBox !== editorRef.current) {
      if (e.target.tagName === 'IMG' || targetBox.id?.startsWith('tb_')) {
        setSelectedImageNode(targetBox);
        updateImageBounds(targetBox);
        // If clicking border / resize area, return early to enable drag
        if (e.target.classList?.contains('tb-container') || e.target.tagName === 'IMG') {
          return;
        }
      }
    }

    // Dismiss image/textbox resize/layout overlay if clicking canvas
    if (e.target && !e.target.closest('.image-layout-popover') && !e.target.closest('.image-resize-handle')) {
      setSelectedImageNode(null);
      setShowLayoutOptions(false);
      setImageBounds(null);
    }

    if (!editorRef.current) return;

    const clickX = e.clientX;
    const clickY = e.clientY;

    // Gather all figures
    const figures = Array.from(editorRef.current.querySelectorAll('figure, .img-wrapper'));

    // ──────────────────────────────────────────────────────────────────────
    // PRIORITY 0: Click ABOVE the first image (top of editor) to write before it
    // ──────────────────────────────────────────────────────────────────────
    const firstElement = editorRef.current.firstElementChild;
    let targetFigure = null;

    if (firstElement) {
      if (firstElement.tagName === 'FIGURE' || firstElement.classList?.contains('img-wrapper')) {
        targetFigure = firstElement;
      } else if (firstElement.tagName === 'P' || firstElement.tagName === 'DIV') {
        const firstInner = firstElement.firstElementChild;
        if (firstInner && (firstInner.tagName === 'FIGURE' || firstInner.classList?.contains('img-wrapper'))) {
          targetFigure = firstInner;
        }
      }
    }

    if (targetFigure) {
      const firstRect = targetFigure.getBoundingClientRect();
      if (clickY < firstRect.top) {
        let aboveP = document.createElement('p');
        aboveP.className = 'article-continuation-p';
        aboveP.style.clear = 'both';
        aboveP.style.marginBottom = '16px';
        aboveP.style.lineHeight = '1.7';
        aboveP.style.textAlign = 'left';
        aboveP.style.width = '100%';
        aboveP.style.display = 'block';
        aboveP.style.minHeight = '28px';
        aboveP.style.outline = 'none';
        aboveP.innerHTML = '\u200B';
        
        editorRef.current.insertBefore(aboveP, firstElement);
        
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.setStart(aboveP.firstChild, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          saveSelection();
          if (editorRef.current) editorRef.current.focus();
          e.preventDefault();
          return;
        }
      }
    }

    // ──────────────────────────────────────────────────────────────────────
    // PRIORITY 1: Click BELOW image / center-wrapped row → place cursor below
    // ──────────────────────────────────────────────────────────────────────
    if (figures.length > 0) {
      for (const figure of figures) {
        let parentBlock = findParentBlock(figure) || figure;
        const figRect = figure.getBoundingClientRect();
        const parentRect = parentBlock.getBoundingClientRect();

        // Skip priority 1 if click is alongside a floated image (left or right side click)
        const isFloatedRightSideClick = figure.style.float === 'right' && clickY >= figRect.top - 10 && clickY <= figRect.bottom + 10 && clickX < figRect.left - 5;
        const isFloatedLeftSideClick = figure.style.float === 'left' && clickY >= figRect.top - 10 && clickY <= figRect.bottom + 10 && clickX > figRect.right + 5;

        if (isFloatedRightSideClick || isFloatedLeftSideClick) {
          continue;
        }

        const bottomEdge = Math.max(figRect.bottom, parentRect.bottom);

        if (clickY > bottomEdge + 2) {
          // Find or create a <p> below this block
          let belowP = parentBlock.nextElementSibling;
          while (belowP && belowP.tagName !== 'P') {
            belowP = belowP.nextElementSibling;
          }

          // Validate: must be a real paragraph, not a slot, and must be inside editor
          if (!belowP || belowP.tagName !== 'P' || belowP.classList?.contains('left-text-slot') || belowP.classList?.contains('right-text-slot') || !editorRef.current.contains(belowP)) {
            belowP = document.createElement('p');
            belowP.className = 'article-continuation-p';
            belowP.style.clear = 'both';
            belowP.style.marginTop = '16px';
            belowP.style.marginBottom = '16px';
            belowP.style.lineHeight = '1.7';
            belowP.style.textAlign = 'left';
            belowP.style.width = '100%';
            belowP.style.display = 'block';
            belowP.style.minHeight = '28px';
            belowP.style.outline = 'none';
            belowP.innerHTML = '\u200B';

            // Insert AFTER parentBlock, but INSIDE the editor
            if (editorRef.current.contains(parentBlock) && parentBlock.parentNode === editorRef.current) {
              parentBlock.after(belowP);
            } else if (editorRef.current.contains(parentBlock)) {
              // parentBlock is nested — walk up to find its direct-child-of-editor ancestor
              let ancestor = parentBlock;
              while (ancestor && ancestor.parentNode !== editorRef.current) {
                ancestor = ancestor.parentNode;
              }
              if (ancestor && ancestor !== editorRef.current) {
                ancestor.after(belowP);
              } else {
                editorRef.current.appendChild(belowP);
              }
            } else {
              editorRef.current.appendChild(belowP);
            }
          }

          // Place cursor
          const selection = window.getSelection();
          if (selection && belowP) {
            let targetTextNode = belowP.firstChild;
            if (!targetTextNode || targetTextNode.nodeType !== Node.TEXT_NODE) {
              targetTextNode = document.createTextNode('\u200B');
              belowP.innerHTML = '';
              belowP.appendChild(targetTextNode);
            }
            const range = document.createRange();
            range.setStart(targetTextNode, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            saveSelection();
            if (editorRef.current) editorRef.current.focus();
            return;
          }
        }
      }
    }

    // ──────────────────────────────────────────────────────────────────────
    // PRIORITY 2: Native caret placement for clicks on text
    // ──────────────────────────────────────────────────────────────────────
    let nativeRange = null;
    if (document.caretRangeFromPoint) {
      nativeRange = document.caretRangeFromPoint(clickX, clickY);
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(clickX, clickY);
      if (pos) {
        nativeRange = document.createRange();
        nativeRange.setStart(pos.offsetNode, pos.offset);
        nativeRange.collapse(true);
      }
    }

    if (nativeRange && editorRef.current.contains(nativeRange.commonAncestorContainer)) {
      const containerNode = nativeRange.startContainer;

      // ────────────────────────────────────────────────────────────────────
      // CENTER-aligned images (shape-outside layout): click beside image → place cursor in text
      // ────────────────────────────────────────────────────────────────────
      if (figures.length > 0) {
        for (const figure of figures) {
          const flt = figure.style.float;
          const isFloated = flt === 'left' || flt === 'right';
          if (isFloated) continue; // skip floated images here

          const anchor = figure.closest('.center-wrap-anchor');
          if (!anchor) continue; // not a center-wrap image

          const rect = figure.getBoundingClientRect();
          if (clickY >= rect.top - 30 && clickY <= rect.bottom + 30) {
            const clickedRight = clickX > rect.right + 5;
            const clickedLeft = clickX < rect.left - 5;

            if (clickedRight || clickedLeft) {
              // With shape-outside, the text flows naturally. Use native caret if available.
              if (nativeRange && anchor.contains(nativeRange.startContainer)) {
                const selection = window.getSelection();
                if (selection) {
                  selection.removeAllRanges();
                  selection.addRange(nativeRange);
                  saveSelection();
                  return;
                }
              }

              // Fallback: find a text node in the anchor to place cursor
              let textNode = null;
              let child = figure.nextSibling;
              while (child) {
                if (child.nodeType === Node.TEXT_NODE && child.textContent.length > 0) {
                  textNode = child;
                  break;
                }
                if (child.nodeType === Node.ELEMENT_NODE && child.firstChild) {
                  textNode = child.firstChild;
                  break;
                }
                child = child.nextSibling;
              }

              if (!textNode) {
                textNode = document.createTextNode('\u200B');
                anchor.appendChild(textNode);
              }

              const selection = window.getSelection();
              if (selection && textNode) {
                const range = document.createRange();
                const offset = textNode.nodeType === Node.TEXT_NODE ? textNode.textContent.length : 0;
                range.setStart(textNode, offset);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                saveSelection();
                return;
              }
            }
          }
        }
      }

      // Regular text click — use native range
      if (containerNode && (containerNode.nodeType === Node.TEXT_NODE || (containerNode.tagName === 'P' && containerNode.textContent.trim().length > 0))) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(nativeRange);
          saveSelection();
          return;
        }
      }
    }

    // ──────────────────────────────────────────────────────────────────────
    // PRIORITY 3: Floated image side clicks
    // ──────────────────────────────────────────────────────────────────────
    if (figures.length > 0) {
      for (const figure of figures) {
        const rect = figure.getBoundingClientRect();

        // SINGLE CLICK ON LEFT SIDE OF FLOATED-RIGHT IMAGE (Place cursor in paragraph on the left)
        if (figure.style.float === 'right' && clickY >= rect.top - 20 && clickY <= rect.bottom + 20 && clickX < rect.left - 5) {
          let parentP = findParentBlock(figure) || figure.parentElement;
          if (parentP) {
            if (parentP.firstChild !== figure) {
              parentP.insertBefore(figure, parentP.firstChild);
            }

            if (nativeRange && parentP.contains(nativeRange.startContainer)) {
              const selection = window.getSelection();
              if (selection) {
                selection.removeAllRanges();
                selection.addRange(nativeRange);
                saveSelection();
                if (editorRef.current) editorRef.current.focus();
                return;
              }
            }

            let targetTextNode = figure.nextSibling;
            while (targetTextNode && targetTextNode.nodeType !== Node.TEXT_NODE && targetTextNode.firstChild) {
              targetTextNode = targetTextNode.firstChild;
            }

            if (!targetTextNode || targetTextNode.nodeType !== Node.TEXT_NODE) {
              targetTextNode = document.createTextNode('\u200B');
              if (figure.nextSibling) {
                parentP.insertBefore(targetTextNode, figure.nextSibling);
              } else {
                parentP.appendChild(targetTextNode);
              }
            }

            const selection = window.getSelection();
            if (selection && targetTextNode) {
              const range = document.createRange();
              range.setStart(targetTextNode, targetTextNode.textContent.length);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
              saveSelection();
              if (editorRef.current) editorRef.current.focus();
              return;
            }
          }
        }

        // SINGLE CLICK ON RIGHT SIDE OF FLOATED-LEFT IMAGE (Place cursor in paragraph on the right)
        if (figure.style.float === 'left' && clickY >= rect.top - 20 && clickY <= rect.bottom + 20 && clickX > rect.right + 5) {
          let parentP = findParentBlock(figure) || figure.parentElement;
          if (parentP) {
            if (parentP.firstChild !== figure) {
              parentP.insertBefore(figure, parentP.firstChild);
            }

            if (nativeRange && parentP.contains(nativeRange.startContainer)) {
              const selection = window.getSelection();
              if (selection) {
                selection.removeAllRanges();
                selection.addRange(nativeRange);
                saveSelection();
                if (editorRef.current) editorRef.current.focus();
                return;
              }
            }

            let targetTextNode = figure.nextSibling;
            while (targetTextNode && targetTextNode.nodeType !== Node.TEXT_NODE && targetTextNode.firstChild) {
              targetTextNode = targetTextNode.firstChild;
            }

            if (!targetTextNode || targetTextNode.nodeType !== Node.TEXT_NODE) {
              targetTextNode = document.createTextNode('\u200B');
              if (figure.nextSibling) {
                parentP.insertBefore(targetTextNode, figure.nextSibling);
              } else {
                parentP.appendChild(targetTextNode);
              }
            }

            const selection = window.getSelection();
            if (selection && targetTextNode) {
              const range = document.createRange();
              range.setStart(targetTextNode, targetTextNode.textContent.length);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
              saveSelection();
              if (editorRef.current) editorRef.current.focus();
              return;
            }
          }
        }
      }
    }

    // Fallback native range placement
    if (nativeRange && editorRef.current.contains(nativeRange.commonAncestorContainer)) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(nativeRange);
        saveSelection();
      }
    }
  };

  // 8-Point Interactive Drag Resizing
  const handleResizeStart = (e, handleDirection) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImageNode) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = selectedImageNode.offsetWidth;
    const startHeight = selectedImageNode.offsetHeight;
    const aspectRatio = startWidth / startHeight;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (handleDirection.includes('e')) {
        newWidth = Math.max(60, startWidth + deltaX);
      } else if (handleDirection.includes('w')) {
        newWidth = Math.max(60, startWidth - deltaX);
      }

      if (handleDirection.includes('s')) {
        newHeight = Math.max(40, startHeight + deltaY);
      } else if (handleDirection.includes('n')) {
        newHeight = Math.max(40, startHeight - deltaY);
      }

      if (['nw', 'ne', 'sw', 'se'].includes(handleDirection)) {
        newHeight = newWidth / aspectRatio;
      }

      selectedImageNode.style.width = `${Math.round(newWidth)}px`;
      if (['nw', 'ne', 'sw', 'se'].includes(handleDirection)) {
        selectedImageNode.style.height = 'auto'; // Maintain aspect ratio for corner resizes
      } else {
        selectedImageNode.style.height = `${Math.round(newHeight)}px`;
      }
      selectedImageNode.style.maxWidth = '100%';
      const figure = selectedImageNode.parentElement?.classList.contains('img-wrapper') ? selectedImageNode.parentElement : null;
      if (figure) {
        figure.style.width = 'auto';
        
        const anchor = figure.closest('.center-wrap-anchor');
        if (anchor) {
          const leftF = anchor.querySelector('.center-float-spacer-left');
          const rightF = anchor.querySelector('.center-float-spacer-right');
          if (leftF && rightF) {
            const figW = figure.offsetWidth || 300;
            const figH = figure.offsetHeight || 200;
            const gap = 16;
            const halfImgPx = Math.ceil(figW / 2) + gap;
            
            leftF.style.width = '50%';
            leftF.style.height = `${figH}px`;
            leftF.style.shapeOutside = `inset(0 0 0 calc(100% - ${halfImgPx}px))`;
            
            rightF.style.width = '50%';
            rightF.style.height = `${figH}px`;
            rightF.style.shapeOutside = `inset(0 calc(100% - ${halfImgPx}px) 0 0)`;
          }
        }
      }

      updateImageBounds(selectedImageNode);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const resizeImage = (sizePercent) => {
    if (!selectedImageNode) return;
    selectedImageNode.style.width = sizePercent;
    selectedImageNode.style.height = 'auto';
    selectedImageNode.style.maxWidth = '100%';
    const figure = selectedImageNode.parentElement?.classList.contains('img-wrapper') ? selectedImageNode.parentElement : null;
    if (figure) {
      if (sizePercent === '100%') {
        figure.style.width = '100%';
      } else {
        figure.style.width = sizePercent;
      }
      
      const anchor = figure.closest('.center-wrap-anchor');
      if (anchor) {
        const leftF = anchor.querySelector('.center-float-spacer-left');
        const rightF = anchor.querySelector('.center-float-spacer-right');
        if (leftF && rightF) {
          setTimeout(() => {
            const figW = figure.offsetWidth || figure.getBoundingClientRect().width || 300;
            const figH = figure.offsetHeight || figure.getBoundingClientRect().height || 200;
            const gap = 16;
            const halfImgPx = Math.ceil(figW / 2) + gap;
            
            leftF.style.width = '50%';
            leftF.style.height = `${figH}px`;
            leftF.style.shapeOutside = `inset(0 0 0 calc(100% - ${halfImgPx}px))`;
            
            rightF.style.width = '50%';
            rightF.style.height = `${figH}px`;
            rightF.style.shapeOutside = `inset(0 calc(100% - ${halfImgPx}px) 0 0)`;
          }, 10);
        }
      }
    }
    updateImageBounds(selectedImageNode);
  };

  const alignImage = (alignment) => {
    if (!selectedImageNode) return;
    const figure = selectedImageNode.closest('.img-wrapper') || selectedImageNode.parentElement;
    if (figure) {
      let parentBlock = figure.parentElement;
      const anchor = figure.closest('.center-wrap-anchor');
      const isCenteredAnchor = anchor !== null;
      
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
              editorRef.current.focus();
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

      const setupFloatBlock = (fig, align) => {
        fig.style.float = align;
        fig.style.margin = align === 'left' ? '12px 24px 12px 0' : '12px 0 12px 24px';
        fig.style.clear = 'none';
        fig.style.display = 'block';

        let wrapBlock = findParentBlock(fig);
        
        if (wrapBlock && wrapBlock !== editorRef.current) {
          let hasContentBefore = false;
          let current = fig.previousSibling;
          while(current) {
            if (current.nodeType === Node.TEXT_NODE && current.textContent.trim().length > 0) {
              hasContentBefore = true; break;
            }
            if (current.nodeType === Node.ELEMENT_NODE && current.tagName !== 'BR') {
              hasContentBefore = true; break;
            }
            current = current.previousSibling;
          }

          if (hasContentBefore) {
            let newBlock = document.createElement(wrapBlock.tagName || 'p');
            newBlock.className = wrapBlock.className;
            newBlock.style.cssText = wrapBlock.style.cssText;
            
            let sibling = fig;
            while (sibling) {
              let next = sibling.nextSibling;
              newBlock.appendChild(sibling);
              sibling = next;
            }
            wrapBlock.parentNode.insertBefore(newBlock, wrapBlock.nextSibling);
            wrapBlock = newBlock;
          } else {
            if (wrapBlock.firstChild !== fig) {
              wrapBlock.insertBefore(fig, wrapBlock.firstChild);
            }
          }
        } else {
          wrapBlock = document.createElement('p');
          wrapBlock.style.marginBottom = '16px';
          wrapBlock.style.lineHeight = '1.7';
          wrapBlock.style.textAlign = 'left';
          wrapBlock.style.width = '100%';
          
          if (fig.parentNode) {
            fig.parentNode.insertBefore(wrapBlock, fig);
          } else {
            editorRef.current.appendChild(wrapBlock);
          }
          wrapBlock.appendChild(fig);
        }

        wrapBlock.style.textAlign = 'left';

        let textAfter = fig.nextSibling;
        if (!textAfter) {
          textAfter = document.createTextNode('\u200B');
          wrapBlock.appendChild(textAfter);
        }
      };

      if (alignment === 'left') {
        setupFloatBlock(figure, 'left');
      } else if (alignment === 'right') {
        setupFloatBlock(figure, 'right');
      } else if (alignment === 'center_wrap') {
        // ── Magazine-style center wrap: text flows around both sides ──
        // The image stays STATIC (position:static, centered via margin:auto).
        // Two invisible float spacers with shape-outside carve the text columns.
        // Text typed above flows down and wraps naturally on both sides.

        // 1. Clean up any old flex/pocket layout
        if (parentBlock) {
          const oldLeft = parentBlock.querySelector('.left-text-slot');
          const oldRight = parentBlock.querySelector('.right-text-slot');
          let mergedHTML = '';
          if (oldLeft) { mergedHTML += oldLeft.innerHTML.replace(/\u200B/g, ''); oldLeft.remove(); }
          if (oldRight) { mergedHTML += oldRight.innerHTML.replace(/\u200B/g, ''); oldRight.remove(); }
          parentBlock.style.display = '';
          parentBlock.style.alignItems = '';
          parentBlock.style.justifyContent = '';
          parentBlock.style.flex = '';

          if (mergedHTML.trim()) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = mergedHTML.trim();
            let insertRef = figure.nextSibling;
            while (tempDiv.firstChild) {
              parentBlock.insertBefore(tempDiv.firstChild, insertRef);
            }
          }
        }

        // 2. Ensure figure is inside a proper wrapper block
        let wrapBlock = parentBlock && parentBlock !== editorRef.current ? parentBlock : null;
        if (!wrapBlock) {
          wrapBlock = document.createElement('p');
          wrapBlock.style.lineHeight = '1.7';
          wrapBlock.style.textAlign = 'left';
          wrapBlock.style.width = '100%';
          if (figure.parentNode) {
            figure.parentNode.insertBefore(wrapBlock, figure);
          } else {
            editorRef.current.appendChild(wrapBlock);
          }
          wrapBlock.appendChild(figure);
        }

        // 3. Set up the center-wrap-anchor container
        let anchor = wrapBlock;
        if (!anchor.classList.contains('center-wrap-anchor')) {
          anchor.classList.add('center-wrap-anchor');
        }
        anchor.style.position = 'relative';
        anchor.style.width = '100%';
        anchor.style.lineHeight = '1.7';
        anchor.style.textAlign = 'left';
        anchor.style.display = 'flex';
        anchor.style.alignItems = 'flex-start';
        anchor.style.justifyContent = 'space-between';
        anchor.style.gap = '16px';
        anchor.style.margin = '12px 0';
        anchor.style.clear = 'both';

        // 4. Remove any old spacers/slots
        anchor.querySelectorAll('.center-float-spacer-left, .center-float-spacer-right, .left-text-slot, .right-text-slot').forEach(s => s.remove());

        // 5. Setup figure flex properties
        figure.style.float = 'none';
        figure.style.clear = 'none';
        figure.style.display = 'block';
        figure.style.position = 'static';
        figure.style.transform = 'none';
        figure.style.top = 'auto';
        figure.style.left = 'auto';
        figure.style.margin = '0';
        figure.style.zIndex = '1';
        figure.style.pointerEvents = 'auto';
        figure.style.flexShrink = '0';
        figure.style.order = '2';

        // 6. Create independent text slots
        const leftSlot = document.createElement('div');
        leftSlot.className = 'left-text-slot';
        leftSlot.setAttribute('contenteditable', 'true');
        leftSlot.style.flex = '1';
        leftSlot.style.minWidth = '0';
        leftSlot.style.order = '1';
        leftSlot.style.outline = 'none';
        leftSlot.innerHTML = '\u200B';

        const rightSlot = document.createElement('div');
        rightSlot.className = 'right-text-slot';
        rightSlot.setAttribute('contenteditable', 'true');
        rightSlot.style.flex = '1';
        rightSlot.style.minWidth = '0';
        rightSlot.style.order = '3';
        rightSlot.style.outline = 'none';
        rightSlot.innerHTML = '\u200B';

        anchor.insertBefore(leftSlot, figure);
        anchor.appendChild(rightSlot);

        // 7. Ensure there's a paragraph ABOVE this anchor for the user to type in
        const prevSibling = anchor.previousElementSibling;
        if (!prevSibling || (prevSibling.tagName !== 'P' && prevSibling.tagName !== 'DIV') || prevSibling.querySelector('figure, .img-wrapper')) {
          const aboveP = document.createElement('p');
          aboveP.className = 'article-above-center-img';
          aboveP.style.lineHeight = '1.7';
          aboveP.style.textAlign = 'left';
          aboveP.style.width = '100%';
          aboveP.style.minHeight = '28px';
          aboveP.style.outline = 'none';
          aboveP.style.marginBottom = '0';
          aboveP.innerHTML = '\u200B';
          anchor.parentNode.insertBefore(aboveP, anchor);
        }
        
        // 8. Ensure there's a paragraph BELOW this anchor for the user to type in
        const nextSibling = anchor.nextElementSibling;
        if (!nextSibling || (nextSibling.tagName !== 'P' && nextSibling.tagName !== 'DIV') || nextSibling.querySelector('figure, .img-wrapper')) {
          const belowP = document.createElement('p');
          belowP.className = 'article-below-center-img';
          belowP.style.lineHeight = '1.7';
          belowP.style.textAlign = 'left';
          belowP.style.width = '100%';
          belowP.style.minHeight = '28px';
          belowP.style.outline = 'none';
          belowP.style.marginTop = '0';
          belowP.innerHTML = '\u200B';
          
          if (anchor.nextSibling) {
            anchor.parentNode.insertBefore(belowP, anchor.nextSibling);
          } else {
            anchor.parentNode.appendChild(belowP);
          }
        }
      } else { // 'center' or banner
        figure.style.float = 'none';
        figure.style.margin = '12px auto';
        figure.style.clear = 'both';
        figure.style.display = 'block';
        figure.style.textAlign = 'center';
        if (parentBlock && (parentBlock.tagName === 'P' || parentBlock.tagName === 'DIV')) {
          parentBlock.style.textAlign = 'center';
        }
      }
    }
    updateImageBounds(selectedImageNode);
  };

  const addOrEditCaption = () => {
    if (!selectedImageNode) return;
    const figure = selectedImageNode.closest('figure') || (selectedImageNode.tagName === 'FIGURE' ? selectedImageNode : selectedImageNode.parentElement);
    if (!figure) return;
    let figcaption = figure.querySelector('figcaption');
    let isNew = false;
    if (!figcaption) {
      isNew = true;
      figcaption = document.createElement('figcaption');
      figcaption.style.fontSize = '13px';
      figcaption.style.color = '#94a3b8';
      figcaption.style.fontStyle = 'italic';
      figcaption.style.textAlign = 'center';
      figcaption.style.marginTop = '8px';
      figcaption.contentEditable = 'true';
      figcaption.textContent = 'Type caption here...';
      figure.appendChild(figcaption);
    } else {
      figcaption.contentEditable = 'true';
    }
    
    setTimeout(() => {
      figcaption.focus();
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

  const removeSelectedImage = () => {
    if (!selectedImageNode) return;
    const parent = selectedImageNode.parentElement;
    if (parent && parent.classList.contains('img-wrapper')) {
      parent.remove();
    } else {
      selectedImageNode.remove();
    }
    setSelectedImageNode(null);
    setShowLayoutOptions(false);
    setImageBounds(null);
    setActiveTab('Home');
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

  // Selection Floating Toolbar State
  const [floatingTool, setFloatingTool] = useState({ visible: false, top: 0, left: 0 });

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const headerBannerInputRef = useRef(null);
  const picturesMenuRef = useRef(null);
  const textBoxMenuRef = useRef(null);
  const fontFamilyMenuRef = useRef(null);
  const colorPickerRef = useRef(null);
  const highlightPickerRef = useRef(null);
  const selectionTimeoutRef = useRef(null);
  const savedRangeRef = useRef(null);
  const commentsContainerRef = useRef(null);
  const prevCommentsLengthRef = useRef(0);

  useEffect(() => {
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

  // Persistent 2-way comments auto-fetch & 8-second polling for real-time discussion thread
  useEffect(() => {
    if (!isOpen || !articleToEdit?.id) return;
    let isMounted = true;

    const loadComments = async () => {
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
    };

    loadComments();

    const interval = setInterval(async () => {
      if (fetchArticleComments) {
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
      if (textBoxMenuRef.current && !textBoxMenuRef.current.contains(e.target)) setShowTextBoxMenu(false);
      if (fontFamilyMenuRef.current && !fontFamilyMenuRef.current.contains(e.target)) setShowFontFamilyMenu(false);
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) setShowColorPicker(false);
      if (highlightPickerRef.current && !highlightPickerRef.current.contains(e.target)) setShowHighlightPicker(false);
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
    editorRef.current.focus();

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
        target.style.float = 'none';
      }
    }
  };

  // Keyboard shortcut & Enter key listener
  const handleKeyDown = (e) => {

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

        // CASE 1: Pressing Enter while editing in Left/Right pocket or on Center Image
        if (activeSlot || isFigureSelected) {
          e.preventDefault();
          e.stopPropagation();

          // Clean up any inner <p> or <div> inserted by browser in activeSlot
          if (activeSlot) {
            const blocks = activeSlot.querySelectorAll('p, div');
            blocks.forEach(b => {
              const text = b.textContent;
              b.replaceWith(document.createTextNode(text));
            });
          }

          let centerRow = activeSlot ? activeSlot.parentElement : (figure ? figure.parentElement : null);
          if (!centerRow || centerRow === editorRef.current || centerRow.classList?.contains('editor-body')) {
            centerRow = activeSlot?.closest('p, div') || figure?.closest('p, div');
          }
          
          let targetRow = centerRow || figure;

          // Ensure targetRow is direct child of editorRef.current
          if (targetRow && editorRef.current?.contains(targetRow)) {
            while (targetRow.parentNode && targetRow.parentNode !== editorRef.current) {
              targetRow = targetRow.parentNode;
            }
          }

          if (!targetRow || targetRow === editorRef.current) {
            targetRow = figure || editorRef.current.lastElementChild;
          }

          // Create or find belowP
          let belowP = targetRow?.nextElementSibling;
          while (belowP && (belowP.tagName !== 'P' && belowP.tagName !== 'DIV')) {
            belowP = belowP.nextElementSibling;
          }

          if (!belowP || belowP.tagName !== 'P' || belowP.classList?.contains('left-text-slot') || belowP.classList?.contains('right-text-slot') || !editorRef.current.contains(belowP)) {
            belowP = document.createElement('p');
            belowP.className = 'article-continuation-p';
            belowP.style.clear = 'both';
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

          if (editorRef.current) editorRef.current.focus();

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

        // CASE 2: Pressing Enter while ALREADY BELOW the image in document flow
        // Intercept to create a clean new line moving DOWN AGAIN AND AGAIN with VISIBLE CURSOR
        let node = anchorNode?.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : anchorNode;
        let currentP = node?.closest?.('p, div, h1, h2, h3, blockquote');
        
        // Prevent matching the editor root itself!
        if (currentP === editorRef.current || currentP?.classList?.contains('editor-body')) {
          let childOfEditor = node;
          while (childOfEditor && childOfEditor.parentNode !== editorRef.current) {
             childOfEditor = childOfEditor.parentNode;
          }
          currentP = childOfEditor;
        }

        if (currentP && editorRef.current?.contains(currentP) && !currentP.classList?.contains('left-text-slot') && !currentP.classList?.contains('right-text-slot')) {
          e.preventDefault();
          e.stopPropagation();

          const newP = document.createElement('p');
          newP.className = 'article-continuation-p';
          newP.style.clear = 'both';
          newP.style.marginTop = '16px';
          newP.style.marginBottom = '16px';
          newP.style.lineHeight = '1.7';
          newP.style.textAlign = 'left';
          newP.style.width = '100%';
          newP.style.display = 'block';
          newP.style.minHeight = '28px';
          newP.style.outline = 'none';
          newP.innerHTML = '\u200B';

          if (currentP.parentNode === editorRef.current) {
            currentP.after(newP);
          } else if (currentP === editorRef.current) {
            editorRef.current.appendChild(newP);
          } else if (currentP.parentNode) {
            currentP.after(newP);
          } else {
            editorRef.current.appendChild(newP);
          }

          let targetTextNode = newP.firstChild;
          if (!targetTextNode || targetTextNode.nodeType !== Node.TEXT_NODE) {
            targetTextNode = document.createTextNode('\u200B');
            newP.innerHTML = '';
            newP.appendChild(targetTextNode);
          }

          if (editorRef.current) editorRef.current.focus();

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
      }
    }
  };

  const handleEditorInput = () => {
    saveSelection();

    // Dynamically clamp left and right text slots to rendered image height
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let node = selection.anchorNode;
      let targetEl = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;
      
      const activeSlot = targetEl?.closest?.('.left-text-slot, .right-text-slot');
      if (activeSlot) {
        let centerRow = activeSlot.closest('p, div');
        if (centerRow === editorRef.current || centerRow?.classList?.contains('editor-body')) {
          centerRow = activeSlot.parentElement;
        }
        const figure = centerRow?.querySelector('figure, .img-wrapper') || editorRef.current?.querySelector('figure, .img-wrapper');
        const figH = figure ? (figure.offsetHeight || figure.getBoundingClientRect().height) : 0;
        
        if (figH > 0) {
          activeSlot.style.maxHeight = `${figH}px`;
          activeSlot.style.overflow = 'hidden';
          activeSlot.style.wordBreak = 'break-all';
          activeSlot.style.overflowWrap = 'anywhere';

          // Auto-Flow logic for left pocket when text reaches the bottom edge of the image
          if (activeSlot.classList.contains('left-text-slot') && activeSlot.scrollHeight > figH + 2) {
             let lastTextNode = null;
             const walk = document.createTreeWalker(activeSlot, NodeFilter.SHOW_TEXT, null, false);
             let n;
             while ((n = walk.nextNode())) {
                if (n.textContent.trim().length > 0) {
                   lastTextNode = n;
                }
             }

             if (lastTextNode) {
                const text = lastTextNode.textContent;
                const isCursorInLastNode = (selection.anchorNode === lastTextNode || selection.focusNode === lastTextNode);
                const cursorOffset = selection.anchorOffset;

                const trimmed = text.trimEnd();
                const lastSpaceIndex = trimmed.lastIndexOf(' ');
                let wordToMove = text;
                let newText = '';
                
                if (lastSpaceIndex !== -1) {
                    wordToMove = text.substring(lastSpaceIndex + 1);
                    newText = text.substring(0, lastSpaceIndex + 1);
                } else {
                    wordToMove = text;
                    newText = '';
                }
                
                if (wordToMove.trim().length > 0) {
                   lastTextNode.textContent = newText;
                   
                   let targetRow = centerRow;
                   if (targetRow && editorRef.current?.contains(targetRow)) {
                     while (targetRow.parentNode && targetRow.parentNode !== editorRef.current) {
                       targetRow = targetRow.parentNode;
                     }
                   }
                   if (!targetRow || targetRow === editorRef.current) {
                     targetRow = figure || editorRef.current.lastElementChild;
                   }

                   let belowP = targetRow?.nextElementSibling;
                   while (belowP && (belowP.tagName !== 'P' && belowP.tagName !== 'DIV')) {
                       belowP = belowP.nextElementSibling;
                   }

                   if (!belowP || belowP.tagName !== 'P' || belowP.classList.contains('left-text-slot') || !editorRef.current.contains(belowP)) {
                       belowP = document.createElement('p');
                       belowP.className = 'article-continuation-p';
                       belowP.style.clear = 'both';
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
                       targetTextNode = document.createTextNode('');
                       if (belowP.firstChild) {
                          belowP.insertBefore(targetTextNode, belowP.firstChild);
                       } else {
                          belowP.appendChild(targetTextNode);
                       }
                   }
                   
                   const originalText = targetTextNode.textContent.replace('\u200B', '');
                   targetTextNode.textContent = wordToMove + originalText;
                   
                   if (isCursorInLastNode && cursorOffset >= newText.length) {
                      const cursorRelativeOffset = cursorOffset - newText.length;
                      const newRange = document.createRange();
                      newRange.setStart(targetTextNode, Math.min(cursorRelativeOffset, targetTextNode.textContent.length));
                      newRange.collapse(true);
                      selection.removeAllRanges();
                      selection.addRange(newRange);
                      saveSelection();
                   }
                }
             }
          }
        }
      }
    }
  };

  // Selection change listener for floating menu & saving range
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

    if (selectionTimeoutRef.current) clearTimeout(selectionTimeoutRef.current);
    selectionTimeoutRef.current = setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !editorRef.current) {
        setFloatingTool(prev => ({ ...prev, visible: false }));
        return;
      }

      const range = selection.getRangeAt(0);
      if (!editorRef.current.contains(range.commonAncestorContainer)) {
        setFloatingTool(prev => ({ ...prev, visible: false }));
        return;
      }

      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();

      setFloatingTool({
        visible: true,
        top: Math.max(10, rect.top - editorRect.top - 52),
        left: Math.min(Math.max(10, rect.left - editorRect.left + (rect.width / 2) - 160), editorRect.width - 320)
      });
    }, 100);
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

  // Device File Selector (Base64)
  const handleDeviceFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (base64Url) {
        insertImageHtml(base64Url, file.name.replace(/\.[^/.]+$/, ""), 'center');
      }
    };
    reader.readAsDataURL(file);
    setShowPicturesMenu(false);
  };

  // Insert Image HTML helper into editor
  const insertImageHtml = (src, caption = '', align = 'center') => {
    restoreSelection();
    if (!editorRef.current) return;

    const captionHtml = caption ? `<figcaption contenteditable="true" style="font-size: 13px; color: #94a3b8; font-style: italic; text-align: center; margin-top: 8px;">${caption}</figcaption>` : '';
    const imgStyles = 'max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.3); display: block;';
    
    let wrapperStyles;
    if (align === 'left') {
      wrapperStyles = 'margin: 12px 24px 12px 0; float: left; clear: none; max-width: 50%;';
    } else if (align === 'right') {
      wrapperStyles = 'margin: 12px 0 12px 24px; float: right; clear: none; max-width: 50%;';
    } else {
      wrapperStyles = 'margin: 12px auto; display: block; clear: both; text-align: center; max-width: 100%;';
    }

    const imgHtml = `<figure class="img-wrapper" contenteditable="false" style="${wrapperStyles}"><img src="${src}" alt="Article Photo" style="${imgStyles}" />${captionHtml}</figure><p><br></p>`;

    document.execCommand('insertHTML', false, imgHtml);

    setTimeout(() => {
      setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
    }, 50);
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

  // Font family change
  const handleFontFamilyChange = (font) => {
    setFontFamily(font);
    execCmd('fontName', font);
  };

  // Font size change
  const handleFontSizeChange = (size) => {
    setFontSize(size);
    restoreSelection();
    const selection = window.getSelection();
    
    if (selection) {
      const focusNode = selection.focusNode;
      const figcaption = focusNode?.nodeType === Node.TEXT_NODE ? focusNode.parentElement.closest('figcaption') : focusNode?.closest?.('figcaption');

      if (!selection.isCollapsed) {
        try {
          const span = document.createElement('span');
          span.style.fontSize = size;
          const range = selection.getRangeAt(0);
          range.surroundContents(span);
        } catch (e) {
          document.execCommand('fontSize', false, '7');
          if (editorRef.current) {
            const fonts = editorRef.current.querySelectorAll('font[size="7"]');
            fonts.forEach(f => {
              f.removeAttribute('size');
              f.style.fontSize = size;
            });
          }
        }
      } else if (figcaption) {
        figcaption.style.fontSize = size;
      } else {
        document.execCommand('fontSize', false, '7');
        if (editorRef.current) {
          const fonts = editorRef.current.querySelectorAll('font[size="7"]');
          fonts.forEach(f => {
            f.removeAttribute('size');
            f.style.fontSize = size;
          });
        }
      }
      saveSelection();
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
    execCmd('hiliteColor', color);
    setShowHighlightPicker(false);
  };

  // Apply Text Color
  const applyTextColor = (color) => {
    execCmd('foreColor', color);
    setShowColorPicker(false);
  };

  // Insert Table
  const insertTable = () => {
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
    const calloutHtml = `
      <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%); border-left: 4px solid #3b82f6; border-radius: 8px; padding: 14px 18px; margin: 18px 0; color: #f8fafc;">
        <strong style="color: #60a5fa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">KEY TAKEAWAY REPORT</strong>
        <p style="margin: 0; font-size: 14.5px; font-style: italic;">Insert key executive summary bullet or highlighted takeaway note here...</p>
      </div>
      <p><br/></p>
    `;
    execCmd('insertHTML', calloutHtml);
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalContent = editorRef.current ? editorRef.current.innerHTML : formData.content;

    if (!formData.title || !finalContent) return;

    const payload = {
      ...formData,
      author: isSuperAdmin ? formData.author : (currentUser?.name || formData.author || 'Content Admin'),
      content: finalContent
    };

    if (articleToEdit) {
      updateArticle(payload);
    } else {
      addArticle(payload);
    }
    onClose();
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
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
                      if (ev.target?.result) setFormData(prev => ({ ...prev, imageUrl: ev.target.result }));
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
              {['Home', 'Insert', ...(selectedImageNode ? ['Picture Format'] : [])].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onMouseDown={preventFocusLoss}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: activeTab === tab ? 800 : 600,
                    color: tab === 'Picture Format' ? '#38bdf8' : (activeTab === tab ? '#ffffff' : '#94a3b8'),
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: activeTab === tab ? '2.5px solid #38bdf8' : '2.5px solid transparent',
                    background: tab === 'Picture Format' && activeTab === 'Picture Format' ? 'rgba(56, 189, 248, 0.15)' : 'none',
                    cursor: 'pointer',
                    borderRadius: tab === 'Picture Format' ? '4px 4px 0 0' : '0'
                  }}
                >
                  {tab === 'Picture Format' ? '🖼️ Picture Format' : tab}
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
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('paste')} style={btnStyle} title="Paste"><Clipboard size={14} /> Paste</button>
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
                  onClick={() => {
                    const url = prompt("Enter hyperlink URL (e.g. https://dailybrief.com):");
                    if (url) execCmd('createLink', url);
                  }} 
                  style={btnStyle} 
                  title="Insert Hyperlink"
                >
                  <LinkIcon size={14} /> Link
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
                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={() => resizeImage('25%')} 
                      style={{ ...btnStyle, background: selectedImageNode.style.width === '25%' ? '#2563eb' : 'rgba(255,255,255,0.08)' }}
                    >
                      25% (Small)
                    </button>
                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={() => resizeImage('50%')} 
                      style={{ ...btnStyle, background: selectedImageNode.style.width === '50%' ? '#2563eb' : 'rgba(255,255,255,0.08)' }}
                    >
                      50% (Medium)
                    </button>
                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={() => resizeImage('75%')} 
                      style={{ ...btnStyle, background: selectedImageNode.style.width === '75%' ? '#2563eb' : 'rgba(255,255,255,0.08)' }}
                    >
                      75% (Large)
                    </button>
                    <button 
                      type="button" 
                      onMouseDown={preventFocusLoss} 
                      onClick={() => resizeImage('100%')} 
                      style={{ ...btnStyle, background: selectedImageNode.style.width === '100%' ? '#2563eb' : 'rgba(255,255,255,0.08)' }}
                    >
                      100% (Full Width)
                    </button>
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

            {/* FLOATING QUICK FORMATTING TOOLBAR ON SELECTION */}
            <div style={{ position: 'relative' }}>
              {floatingTool.visible && (
                <div style={{
                  position: 'absolute',
                  top: `${floatingTool.top}px`,
                  left: `${floatingTool.left}px`,
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '10px',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
                  zIndex: 9999
                }}>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('bold')} style={miniBtnStyle} title="Bold (Ctrl+B)"><Bold size={13} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('italic')} style={miniBtnStyle} title="Italic (Ctrl+I)"><Italic size={13} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('underline')} style={miniBtnStyle} title="Underline (Ctrl+U)"><Underline size={13} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => alignImage('left')} style={miniBtnStyle} title="Float Left"><AlignLeft size={13} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => alignImage('center')} style={miniBtnStyle} title="Center Image"><AlignCenter size={13} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => alignImage('right')} style={miniBtnStyle} title="Float Right"><AlignRight size={13} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => applyHighlight('#fef08a')} style={miniBtnStyle} title="Highlight"><Highlighter size={13} color="#fef08a" /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => applyTextColor('#ef4444')} style={miniBtnStyle} title="Text Color"><Palette size={13} color="#ef4444" /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => execCmd('insertUnorderedList')} style={miniBtnStyle} title="Bulleted List"><List size={13} /></button>
                  <button type="button" onMouseDown={preventFocusLoss} onClick={() => {
                    const url = prompt("Enter link URL:");
                    if (url) execCmd('createLink', url);
                  }} style={miniBtnStyle} title="Insert Link"><LinkIcon size={13} /></button>
                </div>
              )}

              {/* IMAGE SELECTION BOUNDING BOX & 8 RESIZE HANDLES OVERLAY (Matches MS Word Screenshots 3, 4, 5!) */}
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

                  {/* 8 WHITE RESIZE HANDLE CIRCLES (Matches MS Word Screenshots 3, 4, 5!) */}
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

              {/* GLOBAL STYLES FOR EDITOR CONTENT WRAPPING */}
              <style>{`
                .editor-body,
                .editor-body * {
                  overflow-wrap: anywhere !important;
                  word-break: break-all !important;
                  white-space: pre-wrap;
                  max-width: 100%;
                  min-width: 0;
                  box-sizing: border-box !important;
                }
                .editor-body {
                  overflow-x: hidden;
                }
                .editor-body img,
                .editor-body .img-wrapper,
                .editor-body figure {
                  max-width: 100% !important;
                  box-sizing: border-box !important;
                }
              `}</style>

              {/* RICH EDITABLE CONTENT AREA */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="editor-body"
                data-placeholder="Type or paste your article content here..."
                onMouseDown={handleEditorMouseDown}
                onInput={handleEditorInput}
                onKeyDown={handleKeyDown}
                onSelect={handleSelectionChange}
                onKeyUp={handleSelectionChange}
                onMouseUp={handleSelectionChange}
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
                  fontSize: '16px', // Fixed base size so toolbar selections don't resize everything
                  lineHeight: '1.7',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  wordWrap: 'break-word',
                  outline: 'none',
                  background: '#04070d'
                }}
              />

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
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!formData.title?.trim()) {
                      alert("Please enter a headline before saving draft.");
                      return;
                    }
                    const bodyHtml = editorRef.current ? editorRef.current.innerHTML : formData.content;
                    const draftObj = {
                      ...formData,
                      authorId: formData.authorId || currentUser?.id || 'adm-author',
                      author: formData.author || currentUser?.name || currentUser?.username || 'Staff Reporter',
                      content: bodyHtml,
                      status: 'Draft'
                    };
                    if (articleToEdit) await updateArticle(draftObj);
                    else await addArticle(draftObj);
                    onClose();
                  }}
                  style={{ background: '#334155', color: '#f8fafc', border: '1px solid #475569' }}
                >
                  Save Draft
                </button>

                {/* Submit for Editorial Review */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!formData.title?.trim()) {
                      alert("Please enter a headline before submitting.");
                      return;
                    }
                    const bodyHtml = editorRef.current ? editorRef.current.innerHTML : formData.content;
                    const revObj = {
                      ...formData,
                      authorId: formData.authorId || currentUser?.id || 'adm-author',
                      author: formData.author || currentUser?.name || currentUser?.username || 'Staff Reporter',
                      content: bodyHtml,
                      status: 'Pending Editor Assignment'
                    };
                    if (articleToEdit) await updateArticle(revObj);
                    else await addArticle(revObj);
                    onClose();
                  }}
                  style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)', fontWeight: 800 }}
                >
                  Submit for Editorial Review
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
                  onClick={async (e) => {
                    e.preventDefault();
                    const bodyHtml = editorRef.current ? editorRef.current.innerHTML : formData.content;
                    const updatedObj = {
                      ...formData,
                      content: bodyHtml
                    };
                    await updateArticle(updatedObj);
                    onClose();
                  }}
                  style={{ background: '#334155', color: '#f8fafc', border: '1px solid #475569', fontWeight: 700 }}
                >
                  Save Edits
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
                    if (editorRef.current) {
                      const bodyHtml = editorRef.current.innerHTML;
                      await updateArticle({ ...formData, content: bodyHtml, status: 'Approved by Editor' });
                    } else {
                      await approveArticleByEditor(articleToEdit.id);
                    }
                    onClose();
                  }}
                  style={{ background: '#10b981', color: '#ffffff', border: 'none', fontWeight: 800 }}
                >
                  ✓ Approve Article Quality
                </button>
              </>
            )}

            {/* PUBLISH ACTION: Super Admin OR Content Admin when Approved */}
            {(currentUser?.roleId === 'super_admin' || (currentUser?.roleId === 'content_admin' && (articleToEdit?.status === 'Approved by Editor' || articleToEdit?.status === 'Published'))) && (
              <button type="submit" className="btn btn-primary" style={{ background: '#2563eb' }}>
                {articleToEdit ? "Publish / Update Live" : "Publish Article"}
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

      {/* SUB-MODAL 2: ONLINE PICTURES URL INPUT */}
      {showUrlModal && (
        <div style={subModalOverlayStyle}>
          <div style={subModalContentStyle}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              🌐 Online Pictures URL
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (imageUrlInput) {
                insertImageHtml(imageUrlInput, imageCaptionInput, imageAlignInput);
                setShowUrlModal(false);
                setImageUrlInput('');
                setImageCaptionInput('');
              }
            }}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px' }}>Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/photo..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px' }}>Photo Caption</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Photo credit: Reuters"
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
                <button type="submit" className="btn btn-primary" style={{ background: '#3b82f6' }}>Insert Online Image</button>
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
