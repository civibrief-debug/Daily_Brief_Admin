import { NextResponse } from 'next/server';
import { queryD1 } from '../../../../lib/edgeDb';
import { INITIAL_HOMEPAGE_ADS } from '../../../../data/mockInitialData';

let memoryAds = INITIAL_HOMEPAGE_ADS;

export async function GET() {
  try {
    await queryD1(`CREATE TABLE IF NOT EXISTS homepage_ads (id TEXT PRIMARY KEY, data TEXT, updated_at TEXT);`);
    const rows = await queryD1('SELECT data FROM homepage_ads WHERE id = "current_homepage_ads" LIMIT 1;');
    if (rows && rows.length > 0 && rows[0].data) {
      const parsed = JSON.parse(rows[0].data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryAds = parsed;
        return NextResponse.json({ success: true, data: parsed });
      }
    }
    return NextResponse.json({ success: true, data: memoryAds });
  } catch (err) {
    return NextResponse.json({ success: true, data: memoryAds });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const ads = body.ads || [];
    memoryAds = ads;
    await queryD1(`CREATE TABLE IF NOT EXISTS homepage_ads (id TEXT PRIMARY KEY, data TEXT, updated_at TEXT);`);
    await queryD1(
      `INSERT INTO homepage_ads (id, data, updated_at) VALUES ("current_homepage_ads", ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP;`,
      [JSON.stringify(ads)]
    );
    return NextResponse.json({ success: true, data: ads });
  } catch (err) {
    return NextResponse.json({ success: true, data: memoryAds });
  }
}
