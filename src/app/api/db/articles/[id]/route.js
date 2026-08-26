import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { queryD1 } from '../../../../../lib/edgeDb';

function getSharedDbPath() {
  const candidates = [
    path.join(process.cwd(), '..', 'shared_database.json'),
    path.join(process.cwd(), 'shared_database.json'),
    'd:/Daily News/shared_database.json'
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (e) {}
  }
  return candidates[0];
}

function readSharedDb() {
  const p = getSharedDbPath();
  try {
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {}
  return null;
}

function writeSharedDb(updater) {
  const p = getSharedDbPath();
  try {
    let db = readSharedDb() || { articles: [] };
    const updatedDb = updater(db);
    fs.writeFileSync(p, JSON.stringify(updatedDb || db, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error writing shared_database.json:', e);
    return false;
  }
}

function formatArticle(r) {
  if (!r) return null;
  return {
    ...r,
    coverMediaType: r.coverMediaType || (r.videoUrl ? 'video' : 'image'),
    isHero: Boolean(r.isHero),
    isEditorsPick: Boolean(r.isEditorsPick),
    isTrending: Boolean(r.isTrending),
    isLive: Boolean(r.isLive),
    placeholderAdEnabled: Boolean(r.placeholderAdEnabled),
    comments: r.comments ? (typeof r.comments === 'string' ? (JSON.parse(r.comments || '[]')) : r.comments) : [],
    adPlacements: r.adPlacements ? (typeof r.adPlacements === 'string' ? JSON.parse(r.adPlacements) : r.adPlacements) : [],
    coverImageCrop: r.coverImageCrop ? (typeof r.coverImageCrop === 'string' ? JSON.parse(r.coverImageCrop) : r.coverImageCrop) : null,
    coverVideoCrop: r.coverVideoCrop ? (typeof r.coverVideoCrop === 'string' ? JSON.parse(r.coverVideoCrop) : r.coverVideoCrop) : null
  };
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    // 1. Try D1 if configured
    try {
      const rows = await queryD1('SELECT * FROM articles WHERE id = ?;', [id]);
      if (rows && rows.length > 0) {
        return NextResponse.json({ success: true, data: formatArticle(rows[0]) });
      }
    } catch (e) {}

    // 2. Try shared_database.json
    const db = readSharedDb();
    if (db && Array.isArray(db.articles)) {
      const found = db.articles.find(a => a.id === id || a.slug === id);
      if (found) {
        return NextResponse.json({ success: true, data: formatArticle(found) });
      }
    }

    return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (body.status === 'Published') {
      const hasTitle = !!body.title?.trim();
      const hasSupertitle = !!(body.kicker?.trim() || body.supertitle?.trim());
      if (!hasTitle || !hasSupertitle) {
        return NextResponse.json(
          { success: false, error: 'Article cannot be published without both Supertitle (kicker) and Headline Title.' },
          { status: 400 }
        );
      }
    }

    const supertitleVal = (body.kicker?.trim() || body.supertitle?.trim() || '');
    const title = body.title || 'Untitled Article';
    const kicker = supertitleVal;
    const supertitle = supertitleVal;
    const category = body.category || 'Technology';
    const subSection = body.subSection || '';
    const author = body.author || 'Staff Reporter';
    const authorId = body.authorId || null;
    const assignedEditorId = body.assignedEditorId || null;
    const assignedEditorName = body.assignedEditorName || null;
    const status = body.status || 'Draft';
    const summary = body.summary || '';
    const content = body.content || '';
    const imageUrl = body.imageUrl || '';
    const coverMediaType = body.coverMediaType || (body.videoUrl ? 'video' : 'image');
    const videoUrl = body.videoUrl || '';
    const photoCaption = body.photoCaption || '';
    const photoCredit = body.photoCredit || '';
    const coverImageCrop = body.coverImageCrop || body.coverCropBox || {};
    const coverVideoCrop = body.coverVideoCrop || {};
    const coverMediaAspect = body.coverMediaAspect || '16:9';
    const readTime = body.readTime || '3 min read';
    const isHero = body.isHero ? 1 : 0;
    const isEditorsPick = body.isEditorsPick ? 1 : 0;
    const isTrending = body.isTrending ? 1 : 0;
    const isLive = body.isLive ? 1 : 0;
    const adPlacements = body.adPlacements || [];
    const placeholderAdEnabled = body.placeholderAdEnabled ? 1 : 0;
    const placeholderAdTargetUrl = body.placeholderAdTargetUrl || '';
    const placeholderAdHeadline = body.placeholderAdHeadline || '';
    const placeholderAdDescription = body.placeholderAdDescription || '';
    const placeholderAdCtaText = body.placeholderAdCtaText || '';
    const publishedAt = body.status === 'Published' ? (body.publishedAt || new Date().toISOString()) : (body.publishedAt || null);
    const updatedAt = new Date().toISOString();

    const formattedArticle = {
      ...body,
      id,
      title,
      kicker,
      supertitle,
      category,
      subSection,
      author,
      authorId,
      assignedEditorId,
      assignedEditorName,
      status,
      summary,
      content,
      imageUrl,
      coverMediaType,
      videoUrl,
      photoCaption,
      photoCredit,
      coverImageCrop,
      coverVideoCrop,
      coverMediaAspect,
      readTime,
      isHero: Boolean(isHero),
      isEditorsPick: Boolean(isEditorsPick),
      isTrending: Boolean(isTrending),
      isLive: Boolean(isLive),
      adPlacements,
      placeholderAdEnabled: Boolean(placeholderAdEnabled),
      placeholderAdTargetUrl,
      placeholderAdHeadline,
      placeholderAdDescription,
      placeholderAdCtaText,
      publishedAt,
      updatedAt
    };

    // 1. Update shared_database.json
    writeSharedDb((db) => {
      if (!Array.isArray(db.articles)) db.articles = [];
      const idx = db.articles.findIndex(a => a.id === id);
      if (idx >= 0) {
        db.articles[idx] = { ...db.articles[idx], ...formattedArticle };
      } else {
        db.articles.unshift(formattedArticle);
      }
      return db;
    });

    // 2. Try sync to D1
    try {
      const sql = `
        INSERT OR REPLACE INTO articles (
          id, title, kicker, supertitle, category, subSection, author, authorId,
          assignedEditorId, assignedEditorName, status, summary, content, imageUrl,
          coverMediaType, videoUrl, photoCaption, photoCredit, coverImageCrop,
          coverVideoCrop, coverMediaAspect, readTime, isHero, isEditorsPick,
          isTrending, isLive, adPlacements, placeholderAdEnabled,
          placeholderAdTargetUrl, placeholderAdHeadline, placeholderAdDescription,
          placeholderAdCtaText, createdAt, publishedAt, updatedAt
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?,
          COALESCE((SELECT createdAt FROM articles WHERE id = ?), ?), ?, ?
        );
      `;

      const paramsList = [
        id, title, kicker, supertitle, category, subSection, author, authorId,
        assignedEditorId, assignedEditorName, status, summary, content, imageUrl,
        coverMediaType, videoUrl, photoCaption, photoCredit, JSON.stringify(coverImageCrop),
        JSON.stringify(coverVideoCrop), coverMediaAspect, readTime, isHero, isEditorsPick,
        isTrending, isLive, JSON.stringify(adPlacements), placeholderAdEnabled,
        placeholderAdTargetUrl, placeholderAdHeadline, placeholderAdDescription,
        placeholderAdCtaText,
        id, updatedAt, publishedAt, updatedAt
      ];

      await queryD1(sql, paramsList);
    } catch (e) {}

    return NextResponse.json({ success: true, data: formattedArticle });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    // 1. Delete from shared_database.json
    writeSharedDb((db) => {
      if (Array.isArray(db.articles)) {
        db.articles = db.articles.filter(a => a.id !== id);
      }
      return db;
    });

    // 2. Try D1 delete
    try {
      await queryD1('DELETE FROM articles WHERE id = ?;', [id]);
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
