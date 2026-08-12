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
  return NextResponse.json({ success: true, data: db.supportTickets || [] });
}

export async function POST(req) {
  const body = await req.json();
  const db = getDb();

  const newTicket = {
    id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
    userName: body.userName || 'Subscriber',
    userEmail: body.userEmail || '',
    subject: body.subject || 'Support Ticket',
    category: body.category || 'General Issue',
    priority: body.priority || 'Medium',
    status: 'Open',
    createdAt: new Date().toISOString(),
    messages: [
      {
        sender: 'user',
        text: body.message || body.subject,
        timestamp: new Date().toISOString()
      }
    ]
  };

  db.supportTickets = [newTicket, ...(db.supportTickets || [])];
  saveDb(db);
  return NextResponse.json({ success: true, data: newTicket });
}

export async function PUT(req) {
  const body = await req.json();
  const db = getDb();

  const idx = (db.supportTickets || []).findIndex(t => t.id === body.id);
  if (idx !== -1) {
    if (body.replyMessage) {
      db.supportTickets[idx].messages = db.supportTickets[idx].messages || [];
      db.supportTickets[idx].messages.push({
        sender: 'admin',
        text: body.replyMessage,
        timestamp: new Date().toISOString()
      });
      if (body.status) db.supportTickets[idx].status = body.status;
    } else {
      db.supportTickets[idx] = { ...db.supportTickets[idx], ...body };
    }
    saveDb(db);
    return NextResponse.json({ success: true, data: db.supportTickets[idx] });
  }

  return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Ticket ID is required' }, { status: 400 });
    }
    const db = getDb();
    db.supportTickets = (db.supportTickets || []).filter(t => t.id !== id);
    saveDb(db);
    return NextResponse.json({ success: true, message: 'Support ticket deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
