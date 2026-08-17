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

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = getDb();
    const article = (db.articles || []).find(a => a.id === id);
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: article });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    const index = (db.articles || []).findIndex(a => a.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    const isSuperAdmin = body.userRole === 'super_admin' || body.isSuperAdmin === true;
    const existing = db.articles[index];

    // Mandatory Publish Validation: Article CANNOT be published without both Supertitle and Headline Title!
    const targetStatus = body.status !== undefined ? body.status : existing.status;
    if (targetStatus === 'Published') {
      const finalTitle = (body.title !== undefined ? body.title : existing.title)?.trim() || '';
      const kickerCandidate = body.kicker !== undefined ? body.kicker : (body.supertitle !== undefined ? body.supertitle : (existing.kicker || existing.supertitle || ''));
      const finalSupertitle = (kickerCandidate || '')?.trim();
      if (!finalTitle || !finalSupertitle) {
        return NextResponse.json(
          { success: false, error: 'Article cannot be published without both Supertitle (kicker) and Headline Title.' },
          { status: 400 }
        );
      }
    }

    // If user is not super_admin, protect and preserve the existing ad settings from modification
    const adSettings = isSuperAdmin ? {
      placeholderAdEnabled: body.placeholderAdEnabled !== undefined ? !!body.placeholderAdEnabled : (existing.placeholderAdEnabled || false),
      placeholderAdPositionType: body.placeholderAdPositionType || existing.placeholderAdPositionType || 'after_paragraph',
      placeholderAdPositionValue: body.placeholderAdPositionValue !== undefined ? body.placeholderAdPositionValue : (existing.placeholderAdPositionValue || '2'),
      placeholderAdAlignment: body.placeholderAdAlignment || existing.placeholderAdAlignment || 'center',
      placeholderAdLabel: body.placeholderAdLabel || existing.placeholderAdLabel || 'Advertisement',
      placeholderAdContentType: body.placeholderAdContentType || existing.placeholderAdContentType || 'placeholder',
      placeholderAdContent: body.placeholderAdContent !== undefined ? body.placeholderAdContent : (existing.placeholderAdContent || null),
      placeholderAdDropZoneId: body.placeholderAdDropZoneId || existing.placeholderAdDropZoneId || 'dropzone-p-2',
      placeholderAdOrder: body.placeholderAdOrder !== undefined ? body.placeholderAdOrder : (existing.placeholderAdOrder !== undefined ? existing.placeholderAdOrder : 2),
      placeholderAdManualPlacement: body.placeholderAdManualPlacement !== undefined ? !!body.placeholderAdManualPlacement : (existing.placeholderAdManualPlacement || false),
      // Multi-Ad Placements Array Persistence
      adPlacements: Array.isArray(body.adPlacements) ? body.adPlacements : (existing.adPlacements || [])
    } : {
      placeholderAdEnabled: existing.placeholderAdEnabled || false,
      placeholderAdPositionType: existing.placeholderAdPositionType || 'after_paragraph',
      placeholderAdPositionValue: existing.placeholderAdPositionValue || '2',
      placeholderAdAlignment: existing.placeholderAdAlignment || 'center',
      placeholderAdLabel: existing.placeholderAdLabel || 'Advertisement',
      placeholderAdContentType: existing.placeholderAdContentType || 'placeholder',
      placeholderAdContent: existing.placeholderAdContent || null,
      placeholderAdDropZoneId: existing.placeholderAdDropZoneId || 'dropzone-p-2',
      placeholderAdOrder: existing.placeholderAdOrder !== undefined ? existing.placeholderAdOrder : 2,
      placeholderAdManualPlacement: existing.placeholderAdManualPlacement || false,
      adPlacements: existing.adPlacements || []
    };

    db.articles[index] = {
      ...existing,
      ...body,
      ...adSettings,
      updatedAt: new Date().toISOString()
    };

    saveDb(db);
    return NextResponse.json({ success: true, data: db.articles[index] });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const db = getDb();

    db.articles = (db.articles || []).filter(a => a.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
