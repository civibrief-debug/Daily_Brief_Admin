import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getDb() {
  const dbPath = path.join(process.cwd(), '..', 'shared_database.json');
  if (fs.existsSync(dbPath)) return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  return { articles: [], subscribers: [], supportTickets: [] };
}

function saveDb(data) {
  const dbPath = path.join(process.cwd(), '..', 'shared_database.json');
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  const db = getDb();
  return NextResponse.json({ success: true, data: db.subscribers || [] });
}

export async function POST(req) {
  const body = await req.json();
  const db = getDb();
  
  const newSub = {
    id: `sub-${Date.now()}`,
    name: body.name || 'New Subscriber',
    email: body.email || '',
    status: body.status || 'Active',
    plan: body.plan || 'Digital Premium',
    expiryDate: body.expiryDate || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    joinedDate: new Date().toISOString().split('T')[0]
  };

  db.subscribers = [newSub, ...(db.subscribers || [])];
  saveDb(db);
  return NextResponse.json({ success: true, data: newSub });
}

export async function PUT(req) {
  const body = await req.json();
  const db = getDb();

  const idx = (db.subscribers || []).findIndex(s => s.id === body.id || s.email === body.email);
  if (idx !== -1) {
    db.subscribers[idx] = { ...db.subscribers[idx], ...body };
    saveDb(db);
    return NextResponse.json({ success: true, data: db.subscribers[idx] });
  }

  return NextResponse.json({ success: false, error: 'Subscriber not found' }, { status: 404 });
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Subscriber ID is required' }, { status: 400 });
    }
    const db = getDb();
    db.subscribers = (db.subscribers || []).filter(s => s.id !== id);
    saveDb(db);
    return NextResponse.json({ success: true, message: 'Subscriber deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
