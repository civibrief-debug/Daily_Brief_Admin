import { NextResponse } from 'next/server';
import { queryD1 } from '../../../../lib/edgeDb';

export const runtime = 'edge';

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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const includeDrafts = searchParams.get('includeDrafts') !== 'false';

    let sql = 'SELECT * FROM articles';
    const params = [];
    const conditions = [];

    if (!includeDrafts) {
      conditions.push("status = 'Published'");
    }

    if (category && category !== 'All') {
      conditions.push('(category = ? OR category LIKE ?)');
      params.push(category, `%${category}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY COALESCE(updatedAt, createdAt) DESC, createdAt DESC;';

    const rows = await queryD1(sql, params);
    const formatted = (rows || []).map(formatArticle);
    return NextResponse.json({ success: true, data: formatted });
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error', data: [] }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const article = {
      id: body.id || `art-${Date.now()}`,
      title: body.title || 'Untitled Article',
      kicker: body.kicker || '',
      supertitle: body.supertitle || '',
      category: body.category || 'Technology',
      subSection: body.subSection || '',
      author: body.author || 'Staff Reporter',
      authorId: body.authorId || '',
      assignedEditorId: body.assignedEditorId || '',
      assignedEditorName: body.assignedEditorName || '',
      status: body.status || 'Draft',
      summary: body.summary || '',
      content: body.content || '',
      imageUrl: body.imageUrl || '',
      coverMediaType: body.coverMediaType || (body.videoUrl ? 'video' : 'image'),
      videoUrl: body.videoUrl || '',
      photoCaption: body.photoCaption || '',
      photoCredit: body.photoCredit || '',
      coverImageCrop: body.coverImageCrop ? JSON.stringify(body.coverImageCrop) : null,
      coverVideoCrop: body.coverVideoCrop ? JSON.stringify(body.coverVideoCrop) : null,
      coverMediaAspect: body.coverMediaAspect || '16:9',
      readTime: body.readTime || '3 min read',
      isHero: body.isHero ? 1 : 0,
      isEditorsPick: body.isEditorsPick ? 1 : 0,
      isTrending: body.isTrending ? 1 : 0,
      isLive: body.isLive ? 1 : 0,
      adPlacements: body.adPlacements ? JSON.stringify(body.adPlacements) : '[]',
      placeholderAdEnabled: body.placeholderAdEnabled ? 1 : 0,
      placeholderAdTargetUrl: body.placeholderAdTargetUrl || '',
      placeholderAdHeadline: body.placeholderAdHeadline || '',
      placeholderAdDescription: body.placeholderAdDescription || '',
      placeholderAdCtaText: body.placeholderAdCtaText || '',
      createdAt: body.createdAt || new Date().toISOString(),
      publishedAt: body.status === 'Published' ? (body.publishedAt || new Date().toISOString()) : null,
      updatedAt: new Date().toISOString(),
      comments: '[]',
      editorFeedback: body.editorFeedback || '',
      feedbackDate: body.feedbackDate || ''
    };

    await queryD1(
      `INSERT INTO articles (
        id, title, kicker, supertitle, category, subSection, author, authorId,
        assignedEditorId, assignedEditorName, status, summary, content, imageUrl,
        coverMediaType, videoUrl, photoCaption, photoCredit, coverImageCrop, coverVideoCrop,
        coverMediaAspect, readTime, isHero, isEditorsPick, isTrending, isLive,
        adPlacements, placeholderAdEnabled, placeholderAdTargetUrl, placeholderAdHeadline,
        placeholderAdDescription, placeholderAdCtaText, createdAt, publishedAt, updatedAt,
        comments, editorFeedback, feedbackDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title, kicker = excluded.kicker, supertitle = excluded.supertitle,
        category = excluded.category, subSection = excluded.subSection, author = excluded.author,
        authorId = excluded.authorId, assignedEditorId = excluded.assignedEditorId,
        assignedEditorName = excluded.assignedEditorName, status = excluded.status,
        summary = excluded.summary, content = excluded.content, imageUrl = excluded.imageUrl,
        coverMediaType = excluded.coverMediaType, videoUrl = excluded.videoUrl,
        photoCaption = excluded.photoCaption, photoCredit = excluded.photoCredit,
        coverImageCrop = excluded.coverImageCrop, coverVideoCrop = excluded.coverVideoCrop,
        coverMediaAspect = excluded.coverMediaAspect, readTime = excluded.readTime,
        isHero = excluded.isHero, isEditorsPick = excluded.isEditorsPick,
        isTrending = excluded.isTrending, isLive = excluded.isLive,
        adPlacements = excluded.adPlacements, placeholderAdEnabled = excluded.placeholderAdEnabled,
        placeholderAdTargetUrl = excluded.placeholderAdTargetUrl,
        placeholderAdHeadline = excluded.placeholderAdHeadline,
        placeholderAdDescription = excluded.placeholderAdDescription,
        placeholderAdCtaText = excluded.placeholderAdCtaText,
        publishedAt = excluded.publishedAt, updatedAt = excluded.updatedAt,
        editorFeedback = excluded.editorFeedback, feedbackDate = excluded.feedbackDate;`,
      [
        article.id, article.title, article.kicker, article.supertitle, article.category, article.subSection,
        article.author, article.authorId, article.assignedEditorId, article.assignedEditorName, article.status,
        article.summary, article.content, article.imageUrl, article.coverMediaType, article.videoUrl,
        article.photoCaption, article.photoCredit, article.coverImageCrop, article.coverVideoCrop,
        article.coverMediaAspect, article.readTime, article.isHero, article.isEditorsPick, article.isTrending,
        article.isLive, article.adPlacements, article.placeholderAdEnabled, article.placeholderAdTargetUrl,
        article.placeholderAdHeadline, article.placeholderAdDescription, article.placeholderAdCtaText,
        article.createdAt, article.publishedAt, article.updatedAt, article.comments,
        article.editorFeedback, article.feedbackDate
      ]
    );

    return NextResponse.json({ success: true, data: formatArticle(article) });
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
