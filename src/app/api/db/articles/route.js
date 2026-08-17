import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getDb() {
  const dbPath = path.join(process.cwd(), '..', 'shared_database.json');
  if (fs.existsSync(dbPath)) return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const altPath = path.join(process.cwd(), 'shared_database.json');
  if (fs.existsSync(altPath)) return JSON.parse(fs.readFileSync(altPath, 'utf8'));
  return { articles: [], subscribers: [], supportTickets: [] };
}

function saveDb(data) {
  let dbPath = path.join(process.cwd(), '..', 'shared_database.json');
  if (!fs.existsSync(path.dirname(dbPath))) {
    dbPath = path.join(process.cwd(), 'shared_database.json');
  }
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  const db = getDb();
  return NextResponse.json({ success: true, data: db.articles || [] });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const db = getDb();

    // Mandatory Publish Validation: Article CANNOT be published without both Supertitle and Headline Title!
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

    const newArticle = {
      id: body.id || `art-${Date.now()}`,
      title: body.title || 'Untitled Article',
      kicker: supertitleVal,
      supertitle: supertitleVal,
      category: body.category || 'Technology',
      author: body.author || 'Staff Reporter',
      authorId: body.authorId || null,
      assignedEditorId: body.assignedEditorId || null,
      assignedEditorName: body.assignedEditorName || null,
      status: body.status || 'Pending Editor Assignment',
      summary: body.summary || '',
      content: body.content || '',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      coverMediaType: body.coverMediaType || (body.videoUrl ? 'video' : 'image'),
      videoUrl: body.videoUrl || '',
      imageCaption: body.imageCaption || '',
      coverWidth: body.coverWidth || '100%',
      coverHeight: body.coverHeight || '340px',
      coverAspectRatio: body.coverAspectRatio || null,
      coverCropBox: body.coverCropBox || null,
      coverCropStyle: body.coverCropStyle || null,
      featured: !!body.featured,
      // Persistent per-article placeholder ad placement configuration
      placeholderAdEnabled: body.userRole === 'super_admin' || body.isSuperAdmin ? !!body.placeholderAdEnabled : false,
      placeholderAdPositionType: body.placeholderAdPositionType || 'after_paragraph',
      placeholderAdPositionValue: body.placeholderAdPositionValue || '2',
      placeholderAdAlignment: body.placeholderAdAlignment || 'center',
      placeholderAdLabel: body.placeholderAdLabel || 'Advertisement',
      placeholderAdContentType: body.placeholderAdContentType || 'placeholder',
      placeholderAdContent: body.placeholderAdContent || null,
      placeholderAdDropZoneId: body.placeholderAdDropZoneId || 'dropzone-p-2',
      placeholderAdOrder: body.placeholderAdOrder !== undefined ? body.placeholderAdOrder : 2,
      placeholderAdManualPlacement: !!body.placeholderAdManualPlacement,
      placeholderAdCollageLayout: body.placeholderAdCollageLayout || 'grid_2x2',
      placeholderAdCollageGap: body.placeholderAdCollageGap || '8px',
      placeholderAdCollageRadius: body.placeholderAdCollageRadius || '12px',
      placeholderAdCollageItems: Array.isArray(body.placeholderAdCollageItems) ? body.placeholderAdCollageItems : null,
      // Persistent Multi-Ad Placements Array
      adPlacements: (body.userRole === 'super_admin' || body.isSuperAdmin) && Array.isArray(body.adPlacements) 
        ? body.adPlacements 
        : (body.placeholderAdEnabled ? [{
            id: `ad-place-${Date.now()}-1`,
            enabled: true,
            placementType: body.placeholderAdPositionType || 'after_paragraph',
            placementValue: body.placeholderAdPositionValue || '2',
            alignment: body.placeholderAdAlignment || 'center',
            columnPosition: body.placeholderAdAlignment === 'left' ? 'left_col' : (body.placeholderAdAlignment === 'right' ? 'right_col' : 'full'),
            sortOrder: 1,
            widthMode: 'responsive_banner',
            label: body.placeholderAdLabel || 'Advertisement',
            contentType: body.placeholderAdContentType || 'placeholder',
            content: body.placeholderAdContent || null,
            collageLayout: body.placeholderAdCollageLayout || 'grid_2x2',
            collageGap: body.placeholderAdCollageGap || '8px',
            collageRadius: body.placeholderAdCollageRadius || '12px',
            collageItems: body.placeholderAdCollageItems || null,
            dropZoneId: body.placeholderAdDropZoneId || 'dropzone-p-2'
          }] : []),
      comments: Array.isArray(body.comments) ? body.comments : [],
      editorFeedback: body.editorFeedback || null,
      feedbackDate: body.feedbackDate || null,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.articles = [newArticle, ...(db.articles || [])];
    saveDb(db);

    return NextResponse.json({ success: true, data: newArticle });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
