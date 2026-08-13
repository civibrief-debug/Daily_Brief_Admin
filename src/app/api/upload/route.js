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

    // Also sync to Reader App public folder so both apps serve the video statically
    const readerUploadDir = path.join(process.cwd(), '..', 'Daily_Brief', 'public', 'uploads');
    try {
      if (!fs.existsSync(readerUploadDir)) {
        fs.mkdirSync(readerUploadDir, { recursive: true });
      }
      const readerFilePath = path.join(readerUploadDir, filename);
      fs.writeFileSync(readerFilePath, buffer);
    } catch (e) {
      console.warn('Could not sync upload to reader app (non-fatal):', e?.message);
    }

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('File Upload Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
