import { NextResponse } from 'next/server';
import { queryD1 } from '../../../../lib/edgeDb';

export const runtime = 'edge';

export async function GET() {
  try {
    const rows = await queryD1('SELECT * FROM admin_users ORDER BY createdAt DESC;');
    const formatted = rows.map(r => ({
      ...r,
      categoryScope: r.categoryScope ? JSON.parse(r.categoryScope) : ['All Categories'],
      sectionScope: r.sectionScope ? JSON.parse(r.sectionScope) : {},
      actionPermissions: r.actionPermissions ? JSON.parse(r.actionPermissions) : ['manage_articles']
    }));
    return NextResponse.json({ success: true, data: formatted });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const id = body.id || `adm-${Date.now()}`;
    const name = body.name || 'Staff Admin';
    const email = body.email || `admin_${Date.now()}@dailybrief.com`;
    const password = body.password || 'admin123';
    const roleId = body.roleId || 'content_admin';
    const categoryScope = JSON.stringify(body.categoryScope || ['All Categories']);
    const sectionScope = JSON.stringify(body.sectionScope || {});
    const actionPermissions = JSON.stringify(body.actionPermissions || ['manage_articles']);
    const status = body.status || 'Active';
    const createdAt = new Date().toISOString();

    await queryD1(
      `INSERT OR REPLACE INTO admin_users (id, name, email, password, roleId, categoryScope, sectionScope, actionPermissions, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, name, email, password, roleId, categoryScope, sectionScope, actionPermissions, status, createdAt]
    );

    return NextResponse.json({ success: true, data: { id, name, email, roleId, status, createdAt } });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const id = body.id;
    const name = body.name || 'Staff Admin';
    const email = body.email;
    const password = body.password || 'admin123';
    const roleId = body.roleId || 'content_admin';
    const categoryScope = JSON.stringify(body.categoryScope || ['All Categories']);
    const sectionScope = JSON.stringify(body.sectionScope || {});
    const actionPermissions = JSON.stringify(body.actionPermissions || ['manage_articles']);
    const status = body.status || 'Active';
    const createdAt = body.createdAt || new Date().toISOString();

    await queryD1(
      `INSERT OR REPLACE INTO admin_users (id, name, email, password, roleId, categoryScope, sectionScope, actionPermissions, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, name, email, password, roleId, categoryScope, sectionScope, actionPermissions, status, createdAt]
    );

    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Admin ID required' }, { status: 400 });
    }

    await queryD1('DELETE FROM admin_users WHERE id = ?;', [id]);
    return NextResponse.json({ success: true, message: 'Admin deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


