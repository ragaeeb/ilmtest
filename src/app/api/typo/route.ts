import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const data = await req.json();
    // Normally we'd persist typo reports or forward them.
    console.log('Typo report', data);
    return NextResponse.json({ success: true });
}
