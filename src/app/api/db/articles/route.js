import { NextResponse } from 'next/server';
import { queryD1 } from '../../../../lib/edgeDb';

export const runtime = 'edge';

export async function GET() {
  try {
    const rows = await queryD1('SELECT * FROM articles ORDER BY COALESCE(updatedAt, createdAt) DESC, createdAt DESC;');
    const formatted = rows.map(r => ({

      ...r,
      isHero: Boolean(r.isHero),
      isEditorsPick: Boolean(r.isEditorsPick),
      isTrending: Boolean(r.isTrending),
      isLive: Boolean(r.isLive),
      placeholderAdEnabled: Boolean(r.placeholderAdEnabled),
      comments: r.comments ? (typeof r.comments === 'string' ? (JSON.parse(r.comments || '[]')) : r.comments) : [],
      adPlacements: r.adPlacements ? (typeof r.adPlacements === 'string' ? JSON.parse(r.adPlacements) : r.adPlacements) : [],
      coverImageCrop: r.coverImageCrop ? (typeof r.coverImageCrop === 'string' ? JSON.parse(r.coverImageCrop) : r.coverImageCrop) : null,
      coverVideoCrop: r.coverVideoCrop ? (typeof r.coverVideoCrop === 'string' ? JSON.parse(r.coverVideoCrop) : r.coverVideoCrop) : null
    }));
    return NextResponse.json({ success: true, data: formatted });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
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
    const id = body.id || `art-${Date.now()}`;
    const title = body.title || 'Untitled Article';
    const kicker = supertitleVal;
    const supertitle = supertitleVal;
    const category = body.category || 'Technology';
    const subSection = body.subSection || '';
    const author = body.author || 'Staff Reporter';
    const authorId = body.authorId || null;
    const assignedEditorId = body.assignedEditorId || null;
    const assignedEditorName = body.assignedEditorName || null;
    const status = body.status || 'Pending Editor Assignment';
    const summary = body.summary || '';
    const content = body.content || '';
    const imageUrl = body.imageUrl || '';
    const coverMediaType = body.coverMediaType || (body.videoUrl ? 'video' : 'image');
    const videoUrl = body.videoUrl || '';
    const photoCaption = body.photoCaption || '';
    const photoCredit = body.photoCredit || '';
    const coverImageCrop = JSON.stringify(body.coverImageCrop || body.coverCropBox || {});
    const coverVideoCrop = JSON.stringify(body.coverVideoCrop || {});
    const coverMediaAspect = body.coverMediaAspect || '16:9';
    const readTime = body.readTime || '3 min read';
    const isHero = body.isHero ? 1 : 0;
    const isEditorsPick = body.isEditorsPick ? 1 : 0;
    const isTrending = body.isTrending ? 1 : 0;
    const isLive = body.isLive ? 1 : 0;
    const adPlacements = JSON.stringify(body.adPlacements || []);
    const placeholderAdEnabled = body.placeholderAdEnabled ? 1 : 0;
    const placeholderAdTargetUrl = body.placeholderAdTargetUrl || '';
    const placeholderAdHeadline = body.placeholderAdHeadline || '';
    const placeholderAdDescription = body.placeholderAdDescription || '';
    const placeholderAdCtaText = body.placeholderAdCtaText || '';
    const createdAt = new Date().toISOString();
    const publishedAt = body.status === 'Published' ? new Date().toISOString() : null;
    const updatedAt = new Date().toISOString();

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
        ?, ?, ?, ?
      );
    `;

    const params = [
      id, title, kicker, supertitle, category, subSection, author, authorId,
      assignedEditorId, assignedEditorName, status, summary, content, imageUrl,
      coverMediaType, videoUrl, photoCaption, photoCredit, coverImageCrop,
      coverVideoCrop, coverMediaAspect, readTime, isHero, isEditorsPick,
      isTrending, isLive, adPlacements, placeholderAdEnabled,
      placeholderAdTargetUrl, placeholderAdHeadline, placeholderAdDescription,
      placeholderAdCtaText, createdAt, publishedAt, updatedAt
    ];

    await queryD1(sql, params);

    return NextResponse.json({ success: true, data: { id, title, status, createdAt } });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
