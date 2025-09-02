import { type NextRequest, NextResponse } from 'next/server';
import { type AgentHadith, runAgent } from '@/lib/agent';

export interface SearchResult {
    id: string;
    bookId: string;
    chapterId: string;
    contentId: string;
    title: string;
    snippet: string;
}

// Helper function to convert AgentHadith to SearchResult
function convertHadithToSearchResult(hadith: AgentHadith): SearchResult {
    const chapterIdStr = hadith.chapterId !== null ? String(hadith.chapterId) : 'unknown';

    return {
        id: `bukhari-${chapterIdStr}-${hadith.hadithNumber}`,
        bookId: 'sahih-bukhari',
        chapterId: chapterIdStr,
        contentId: String(hadith.hadithNumber ?? ''),
        title: `Sahih Bukhari: ${hadith.chapter ?? ''} #${hadith.hadithNumber}`,
        snippet: hadith.hadithEnglish ?? '',
    };
}

export async function POST(req: NextRequest) {
    try {
        // Validate request body
        const body = await req.json();
        const { query } = body as { query?: unknown };

        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: 'Missing or invalid "query" in request body' }, { status: 400 });
        }

        // Run the agent with strong typing
        const result = await runAgent(query);

        // Handle agent errors
        if (!result.success) {
            console.error('Agent error:', result.error);

            return NextResponse.json(
                {
                    error: result.error.message,
                    details: result.error.statusText,
                    raw: result.rawContent, // Only present for parsing/validation errors
                },
                { status: result.error.status },
            );
        }

        // Convert strongly-typed hadiths to SearchResults
        const searchResults: SearchResult[] = result.data.hadiths.map(convertHadithToSearchResult);

        console.log('Responding with', searchResults.length, 'hadiths');

        // Return the properly typed response
        return NextResponse.json(searchResults);
    } catch (err: unknown) {
        console.error('Route handler error:', err);

        const message = err instanceof Error ? err.message : 'Unknown server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
