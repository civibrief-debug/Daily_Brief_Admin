import { NextResponse } from 'next/server';
import { queryD1 } from '../../../../lib/edgeDb';

export const runtime = 'edge';

function cleanSections(sections) {
  if (!Array.isArray(sections)) return [];
  return sections.map(sec => {
    if (!sec) return sec;
    return {
      ...sec,
      sectionTitle: sec.sectionTitle ? sec.sectionTitle.replace(/\s*\((?:copy|copied)\)/gi, '').trim() : sec.sectionTitle
    };
  });
}

export async function GET() {
  try {
    await queryD1(`CREATE TABLE IF NOT EXISTS homepage_articles (id TEXT PRIMARY KEY, data TEXT, updated_at TEXT);`);
    const rows = await queryD1('SELECT data FROM homepage_articles WHERE id = "current_homepage_articles" LIMIT 1;');
    if (rows && rows.length > 0 && rows[0].data) {
      const parsed = JSON.parse(rows[0].data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = cleanSections(parsed);
        return NextResponse.json(
          { success: true, data: cleaned },
          { headers: { 'Cache-Control': 'public, max-age=1, s-maxage=2, stale-while-revalidate=10' } }
        );
      }
    }
    return NextResponse.json({ success: true, data: [] });
  } catch (err) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const rawSections = body.sections || [];
    const sections = cleanSections(rawSections);

    await queryD1(`CREATE TABLE IF NOT EXISTS homepage_articles (id TEXT PRIMARY KEY, data TEXT, updated_at TEXT);`);
    await queryD1(
      `INSERT INTO homepage_articles (id, data, updated_at) VALUES ("current_homepage_articles", ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP;`,
      [JSON.stringify(sections)]
    );

    return NextResponse.json({ success: true, data: sections });
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
