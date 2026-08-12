import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getDb() {
  const dbPath = path.join(process.cwd(), '..', 'shared_database.json');
  if (fs.existsSync(dbPath)) return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const altPath = path.join(process.cwd(), 'shared_database.json');
  if (fs.existsSync(altPath)) return JSON.parse(fs.readFileSync(altPath, 'utf8'));
  return { articles: [], subscribers: [], supportTickets: [], adminUsers: [] };
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
  return NextResponse.json({ success: true, data: db.adminUsers || [] });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const db = getDb();

    const newAdmin = {
      id: body.id || `adm-${Date.now()}`,
      name: body.name || 'Admin Staff',
      email: body.email || '',
      password: body.password || 'admin123',
      roleId: body.roleId || 'content_admin',
      categoryScope: body.categoryScope || ['All Categories'],
      sectionScope: body.sectionScope || {},
      actionPermissions: body.actionPermissions || ['manage_articles'],
      status: body.status || 'Active',
      createdAt: new Date().toISOString()
    };

    const existingAdmins = db.adminUsers || [];
    const updatedAdmins = [newAdmin, ...existingAdmins.filter(a => a.id !== newAdmin.id)];
    db.adminUsers = updatedAdmins;
    saveDb(db);

    return NextResponse.json({ success: true, data: newAdmin });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const db = getDb();

    const existingAdmins = db.adminUsers || [];
    const index = existingAdmins.findIndex(a => a.id === body.id || a.email === body.email);

    if (index !== -1) {
      existingAdmins[index] = { ...existingAdmins[index], ...body };
    } else {
      existingAdmins.unshift({
        id: body.id || `adm-${Date.now()}`,
        name: body.name || 'Admin Staff',
        email: body.email || '',
        password: body.password || 'admin123',
        roleId: body.roleId || 'content_admin',
        categoryScope: body.categoryScope || ['All Categories'],
        sectionScope: body.sectionScope || {},
        actionPermissions: body.actionPermissions || ['manage_articles'],
        status: body.status || 'Active'
      });
    }

    db.adminUsers = existingAdmins;
    saveDb(db);

    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
