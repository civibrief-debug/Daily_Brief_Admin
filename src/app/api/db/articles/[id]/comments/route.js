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
    const comments = Array.isArray(article.comments) ? article.comments : [];
    return NextResponse.json({ success: true, comments });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (!body.text && !body.content) {
      return NextResponse.json({ success: false, error: 'Comment content cannot be empty' }, { status: 400 });
    }

    const db = getDb();
    const index = (db.articles || []).findIndex(a => a.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    const article = db.articles[index];
    const existingComments = Array.isArray(article.comments) ? article.comments : [];

    const newComment = {
      id: `cmt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      articleId: id,
      senderId: body.senderId || 'unknown',
      senderName: body.senderName || 'User',
      senderRole: body.senderRole || 'Author',
      text: body.text || body.content || '',
      content: body.text || body.content || '',
      createdAt: new Date().toISOString(),
      isRead: false
    };

    const updatedComments = [...existingComments, newComment];
    db.articles[index].comments = updatedComments;
    db.articles[index].updatedAt = new Date().toISOString();

    saveDb(db);
    return NextResponse.json({ success: true, comment: newComment, comments: updatedComments });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    const index = (db.articles || []).findIndex(a => a.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    const article = db.articles[index];
    const existingComments = Array.isArray(article.comments) ? article.comments : [];
    const readerRole = body.readerRole;
    const readerId = body.readerId;

    let modified = false;
    const updatedComments = existingComments.map(c => {
      // Mark as read if the message was sent by someone else
      if (!c.isRead && (c.senderRole !== readerRole || c.senderId !== readerId)) {
        modified = true;
        return { ...c, isRead: true };
      }
      return c;
    });

    if (modified) {
      db.articles[index].comments = updatedComments;
      saveDb(db);
    }

    return NextResponse.json({ success: true, comments: updatedComments });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
