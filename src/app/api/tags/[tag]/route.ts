import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/ratelimit';

const mockTags: Record<string, any[]> = {
    guidance: [{ bookId: 'quran', chapterId: '1', contentId: '6', title: 'Al-Fatiha: Verse 6' }],
    faith: [
        { bookId: 'sahih-bukhari', chapterId: '1', contentId: '1', title: 'Hadith of Jibril' },
        { bookId: 'sahih-bukhari', chapterId: '1', contentId: '2', title: 'Branches of Faith' },
    ],
};

export const revalidate = 3600;

export async function GET(_req: Request, context: { params: Promise<{ tag: string }> }) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!rateLimit(userId)) {
        return new NextResponse('Too Many Requests', { status: 429 });
    }
    const { tag } = await context.params;
    return NextResponse.json(mockTags[tag] || [], {
        headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
    });
}
