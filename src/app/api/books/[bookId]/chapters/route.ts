import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const mockChapters: Record<string, any[]> = {
    quran: [
        { id: 1, nameAr: 'الفاتحة', nameEn: 'Al-Fatiha', meaning: 'The Opening', verses: 7, revelation: 'Meccan' },
        { id: 2, nameAr: 'البقرة', nameEn: 'Al-Baqarah', meaning: 'The Cow', verses: 286, revelation: 'Medinan' },
        {
            id: 3,
            nameAr: 'آل عمران',
            nameEn: 'Aal-E-Imran',
            meaning: 'The Family of Imran',
            verses: 200,
            revelation: 'Medinan',
        },
        { id: 4, nameAr: 'النساء', nameEn: 'An-Nisa', meaning: 'The Women', verses: 176, revelation: 'Medinan' },
        { id: 5, nameAr: 'المائدة', nameEn: 'Al-Maidah', meaning: 'The Table', verses: 120, revelation: 'Medinan' },
    ],
    'sahih-bukhari': [
        { id: 1, nameAr: 'كتاب بدء الوحي', nameEn: 'Book of Revelation', hadithCount: 7 },
        { id: 2, nameAr: 'كتاب الإيمان', nameEn: 'Book of Faith', hadithCount: 53 },
        { id: 3, nameAr: 'كتاب العلم', nameEn: 'Book of Knowledge', hadithCount: 76 },
        { id: 4, nameAr: 'كتاب الوضوء', nameEn: 'Book of Ablutions', hadithCount: 113 },
        { id: 5, nameAr: 'كتاب الغسل', nameEn: 'Book of Bathing', hadithCount: 31 },
        { id: 6, nameAr: 'كتاب الحيض', nameEn: 'Book of Menstruation', hadithCount: 33 },
        { id: 7, nameAr: 'كتاب التيمم', nameEn: 'Book of Dry Ablution', hadithCount: 28 },
        { id: 8, nameAr: 'كتاب الصلاة', nameEn: 'Book of Prayer', hadithCount: 172 },
    ],
};

export const revalidate = 3600;

export async function GET(_req: Request, { params }: { params: { bookId: string } }) {
    const { userId } = auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { bookId } = params;
    const endpoint = process.env.ILMTEST_API_ENDPOINT;
    if (endpoint) {
        try {
            const res = await fetch(`${endpoint}/books/${bookId}/chapters`, {
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

    return NextResponse.json(mockChapters[bookId] || [], {
        headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
    });
}
