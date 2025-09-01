import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/ratelimit';

const mockExplanations: Record<string, any> = {
    quran: {
        '1': {
            '6': [
                {
                    id: 'exp1',
                    title: 'Hadith of Jibril',
                    bookId: 'sahih-bukhari',
                    chapterId: '1',
                    contentId: '1',
                },
            ],
        },
    },
    'sahih-bukhari': {
        '1': {
            '1': [
                {
                    id: 'exp1',
                    title: 'Quran 1:6',
                    bookId: 'quran',
                    chapterId: '1',
                    contentId: '6',
                },
            ],
        },
    },
};

export const revalidate = 3600;

export async function GET(
    _req: Request,
    context: { params: Promise<{ bookId: string; chapterId: string; contentId: string }> },
) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!rateLimit(userId)) {
        return new NextResponse('Too Many Requests', { status: 429 });
    }
    const { bookId, chapterId, contentId } = await context.params;
    const data = mockExplanations[bookId as keyof typeof mockExplanations]?.[chapterId]?.[contentId] || [];
    return NextResponse.json(data, {
        headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
    });
}
