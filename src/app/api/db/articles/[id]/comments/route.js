import { NextResponse } from 'next/server';
import { queryD1 } from '../../../../../../lib/edgeDb';

export const runtime = 'edge';

// Helper to safely parse comments JSON
function parseComments(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// GET: Fetch all comments for a specific article
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: true, comments: [] });
    }

    const rows = await queryD1('SELECT comments FROM articles WHERE id = ?;', [id]);
    if (!rows.length) {
      return NextResponse.json({ success: true, comments: [] });
    }

    const comments = parseComments(rows[0].comments);
    return NextResponse.json({ success: true, comments });
  } catch (err) {
    console.error('Error fetching comments:', err);
    return NextResponse.json({ success: true, comments: [] });
  }
}

// POST: Add a new comment to an article's discussion thread
export async function POST(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID required' }, { status: 400 });
    }

    const body = await req.json();
    const text = (body.text || '').trim();
    if (!text) {
      return NextResponse.json({ success: false, error: 'Comment text is required' }, { status: 400 });
    }

    const newComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text,
      senderId: body.senderId || 'unknown',
      senderName: body.senderName || 'Anonymous',
      senderRole: body.senderRole || 'Author',
      createdAt: new Date().toISOString(),
      isRead: false
    };

    const rows = await queryD1('SELECT comments FROM articles WHERE id = ?;', [id]);
    const existingComments = rows.length ? parseComments(rows[0].comments) : [];
    const updatedComments = [...existingComments, newComment];

    await queryD1('UPDATE articles SET comments = ?, updatedAt = ? WHERE id = ?;', [
      JSON.stringify(updatedComments),
      new Date().toISOString(),
      id
    ]);

    return NextResponse.json({ success: true, comments: updatedComments });
  } catch (err) {
    console.error('Error adding comment:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH: Mark discussion thread comments as read
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID required' }, { status: 400 });
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const readerRole = body.readerRole || '';
    const readerId = body.readerId || '';

    const rows = await queryD1('SELECT comments FROM articles WHERE id = ?;', [id]);
    if (!rows.length) {
      return NextResponse.json({ success: true, comments: [] });
    }

    const existingComments = parseComments(rows[0].comments);
    let changed = false;

    const updatedComments = existingComments.map(c => {
      // Mark as read if not sent by reader
      if (!c.isRead && (c.senderId !== readerId || (readerRole && c.senderRole !== readerRole))) {
        changed = true;
        return { ...c, isRead: true };
      }
      return c;
    });

    if (changed) {
      await queryD1('UPDATE articles SET comments = ? WHERE id = ?;', [
        JSON.stringify(updatedComments),
        id
      ]);
    }

    return NextResponse.json({ success: true, comments: updatedComments });
  } catch (err) {
    console.error('Error marking comments read:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
