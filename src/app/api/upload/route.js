import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;

    // Target uploads directory in Admin Portal public folder
    const adminUploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(adminUploadDir)) {
      fs.mkdirSync(adminUploadDir, { recursive: true });
    }
    const adminFilePath = path.join(adminUploadDir, filename);
    fs.writeFileSync(adminFilePath, buffer);

    // Sync to Reader App public folder if accessible
    const readerUploadDir = path.join(process.cwd(), '..', 'Daily_Brief', 'public', 'uploads');
    try {
      if (!fs.existsSync(readerUploadDir)) {
        fs.mkdirSync(readerUploadDir, { recursive: true });
      }
      const readerFilePath = path.join(readerUploadDir, filename);
      fs.writeFileSync(readerFilePath, buffer);
    } catch (e) {
      console.warn('Could not sync upload to reader app directory (non-fatal):', e?.message);
    }

    // Determine host origin for absolute cross-port resolution
    const host = req.headers.get('host') || 'localhost:5174';
    const protocol = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const origin = `${protocol}://${host}`;

    // Priority: Custom Cloud CDN URL (if configured), or absolute server URL, or relative fallback
    const customCdn = process.env.NEXT_PUBLIC_MEDIA_URL || process.env.NEXT_PUBLIC_R2_URL;
    const publicUrl = customCdn
      ? `${customCdn.replace(/\/$/, '')}/${filename}`
      : `${origin}/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      relativePath: `/uploads/${filename}`,
      filename
    });
  } catch (err) {
    console.error('File Upload Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
