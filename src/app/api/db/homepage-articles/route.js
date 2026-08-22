import { NextResponse } from 'next/server';
import { queryD1 } from '../../../../lib/edgeDb';
import { INITIAL_HOMEPAGE_ARTICLE_SECTIONS } from '../../../../data/mockInitialData';

export const runtime = 'edge';

let memorySections = INITIAL_HOMEPAGE_ARTICLE_SECTIONS;

export async function GET() {
  try {
    await queryD1(`CREATE TABLE IF NOT EXISTS homepage_articles (id TEXT PRIMARY KEY, data TEXT, updated_at TEXT);`);
    const rows = await queryD1('SELECT data FROM homepage_articles WHERE id = "current_homepage_articles" LIMIT 1;');
    if (rows && rows.length > 0 && rows[0].data) {
      const parsed = JSON.parse(rows[0].data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memorySections = parsed;
        return NextResponse.json({ success: true, data: parsed });
      }
    }
    return NextResponse.json({ success: true, data: memorySections });
  } catch (err) {
    return NextResponse.json({ success: true, data: memorySections });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const sections = body.sections || [];
    memorySections = sections;
    await queryD1(`CREATE TABLE IF NOT EXISTS homepage_articles (id TEXT PRIMARY KEY, data TEXT, updated_at TEXT);`);
    await queryD1(
      `INSERT INTO homepage_articles (id, data, updated_at) VALUES ("current_homepage_articles", ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP;`,
      [JSON.stringify(sections)]
    );
    return NextResponse.json({ success: true, data: sections });
  } catch (err) {
    return NextResponse.json({ success: true, data: memorySections });
  }
}
