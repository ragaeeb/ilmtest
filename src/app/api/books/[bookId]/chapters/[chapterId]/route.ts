import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const mockChapters: Record<string, Record<string, any>> = {
    quran: {
        '1': { id: 1, nameAr: 'الفاتحة', nameEn: 'Al-Fatiha', meaning: 'The Opening', verses: 7, revelation: 'Meccan' },
        '2': { id: 2, nameAr: 'البقرة', nameEn: 'Al-Baqarah', meaning: 'The Cow', verses: 286, revelation: 'Medinan' },
    },
    'sahih-bukhari': {
        '1': { id: 1, nameAr: 'كتاب بدء الوحي', nameEn: 'Book of Revelation', hadithCount: 7 },
        '2': { id: 2, nameAr: 'كتاب الإيمان', nameEn: 'Book of Faith', hadithCount: 53 },
    },
};

export const revalidate = 3600;

export async function GET(_req: Request, { params }: { params: { bookId: string; chapterId: string } }) {
    const { userId } = auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const { bookId, chapterId } = params;
    const endpoint = process.env.ILMTEST_API_ENDPOINT;
    if (endpoint) {
        try {
            const res = await fetch(`${endpoint}/books/${bookId}/chapters/${chapterId}`, {
                next: { revalidate: 3600 },
                cache: 'force-cache',
            });
            if (res.ok) {
                const data = await res.json();
                return NextResponse.json(data, {
                    headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
                });
            }
        } catch (_err) {
            // ignore
        }
    }
    const chapter =
        mockChapters[bookId as keyof typeof mockChapters]?.[
            chapterId as keyof (typeof mockChapters)[keyof typeof mockChapters]
        ];
    if (!chapter) {
        return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(chapter, {
        headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
    });
}
