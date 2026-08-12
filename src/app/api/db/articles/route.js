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

    const newArticle = {
      id: body.id || `art-${Date.now()}`,
      title: body.title || 'Untitled Article',
      category: body.category || 'Technology',
      author: body.author || 'Staff Reporter',
      authorId: body.authorId || null,
      assignedEditorId: body.assignedEditorId || null,
      assignedEditorName: body.assignedEditorName || null,
      status: body.status || 'Pending Editor Assignment',
      summary: body.summary || '',
      content: body.content || '',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      featured: !!body.featured,
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
