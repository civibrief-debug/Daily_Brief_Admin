import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(req) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, data: body });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
