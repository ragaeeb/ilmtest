import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const mockBooks = {
    quran: {
        id: 'quran',
        title: 'القرآن الكريم',
        titleEn: 'The Holy Quran',
        description: 'The final revelation from Allah',
        chapters: 114,
        avatar: 'https://dev.shamela.ws/covers/1.jpg',
        url: 'https://shamela.ws/book/21795/{{id}}',
    },
    'sahih-bukhari': {
        id: 'sahih-bukhari',
        title: 'صحيح البخاري',
        titleEn: 'Sahih al-Bukhari',
        description: 'The most authentic collection of hadith',
        chapters: 97,
        avatar: 'https://dev.shamela.ws/covers/335.jpg',
        url: 'https://shamela.ws/book/112233/{{id}}',
        author: { name: 'Muhammad b. Ismail', born: 194, died: 256 },
    },
    'sahih-muslim': {
        id: 'sahih-muslim',
        title: 'صحيح مسلم',
        titleEn: 'Sahih Muslim',
        description: 'The second most authentic hadith collection',
        chapters: 56,
        avatar: 'https://dev.shamela.ws/covers/3.jpg',
        url: 'https://shamela.ws/book/445566/{{id}}',
        author: { name: 'Muslim b. al-Hajjaj', born: 206, died: 261 },
    },
    'sunan-abi-dawud': {
        id: 'sunan-abi-dawud',
        title: 'سنن أبي داود',
        titleEn: 'Sunan Abi Dawud',
        description: 'Collection focusing on legal hadith',
        chapters: 43,
        avatar: 'https://dev.shamela.ws/covers/1727.jpg',
        url: 'https://shamela.ws/book/778899/{{id}}',
    },
    'jami-tirmidhi': {
        id: 'jami-tirmidhi',
        title: 'جامع الترمذي',
        titleEn: 'Jami at-Tirmidhi',
        description: 'Comprehensive hadith collection with commentary',
        chapters: 46,
        avatar: 'https://dev.shamela.ws/covers/1681.jpg',
        url: 'https://shamela.ws/book/998877/{{id}}',
    },
    'sunan-nasai': {
        id: 'sunan-nasai',
        title: 'سنن النسائي',
        titleEn: 'Sunan an-Nasai',
        description: 'Focused collection of authentic hadith',
        chapters: 51,
        avatar: 'https://dev.shamela.ws/covers/336.jpg',
        url: 'https://shamela.ws/book/665544/{{id}}',
    },
};

export const revalidate = 3600;

export async function GET(_req: Request, context: { params: Promise<{ bookId: string }> }) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const endpoint = process.env.ILMTEST_API_ENDPOINT;
    const { bookId } = await context.params;
    if (endpoint) {
        try {
            const res = await fetch(`${endpoint}/books/${bookId}`, {
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

    const book = mockBooks[bookId as keyof typeof mockBooks];
    if (!book) {
        return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(book, {
        headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
    });
}
