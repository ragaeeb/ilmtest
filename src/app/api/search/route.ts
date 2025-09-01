import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/ratelimit';

interface SearchResult {
    id: string;
    bookId: string;
    chapterId: string;
    contentId: string;
    title: string;
    snippet: string;
}

const mockResults: SearchResult[] = [
    {
        id: 'quran-1-1',
        bookId: 'quran',
        chapterId: '1',
        contentId: '1',
        title: 'Al-Fatiha: Verse 1',
        snippet: 'In the name of Allah, the Most Gracious, the Most Merciful',
    },
    {
        id: 'bukhari-1-1',
        bookId: 'sahih-bukhari',
        chapterId: '1',
        contentId: '1',
        title: 'Sahih Bukhari: Book of Revelation #1',
        snippet: 'Umar ibn al-Khattab reported ...',
    },
];

export const revalidate = 3600;

export async function GET(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!rateLimit(userId)) {
        return new NextResponse('Too Many Requests', { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    const endpoint = process.env.ILMTEST_API_ENDPOINT;
    if (endpoint) {
        try {
            const res = await fetch(`${endpoint}/search?q=${encodeURIComponent(q)}`, {
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

    const filtered = mockResults.filter(
        (r) => r.title.toLowerCase().includes(q.toLowerCase()) || r.snippet.toLowerCase().includes(q.toLowerCase()),
    );
    return NextResponse.json(filtered, {
        headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
    });
}
