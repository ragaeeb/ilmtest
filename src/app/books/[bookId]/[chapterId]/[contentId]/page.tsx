import { cookies } from 'next/headers';
import Link from 'next/link';
import { InteractiveText } from '@/components/InteractiveText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function ContentPage({
    params,
}: {
    params: Promise<{ bookId: string; chapterId: string; contentId: string }>;
}) {
    const { bookId, chapterId, contentId } = await params;
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}/chapters/${chapterId}/contents/${contentId}`,
        {
            cache: 'force-cache',
            headers: { cookie: (await cookies()).toString() },
        },
    );
    if (!res.ok) {
        return <div>Content not found</div>;
    }
    const item = await res.json();
    const isQuran = bookId === 'quran';
    const sourceUrl = `https://shamela.ws/book/${bookId}/${contentId}`;
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8 rounded-2xl border border-sky-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-sky-800 dark:bg-gray-900/80">
                    <h1 className="mb-4 text-center font-bold text-3xl text-sky-800 dark:text-sky-200">
                        {isQuran ? `Verse ${contentId}` : `Hadith ${contentId}`}
                    </h1>
                    <div className="mb-4">
                        <InteractiveText
                            text={item.arabic}
                            terms={{
                                'عمر بن الخطاب': {
                                    title: 'Umar ibn al-Khattab',
                                    description: 'Second caliph of Islam and close companion of the Prophet',
                                },
                            }}
                            className="text-right font-arabic text-2xl text-sky-900 dark:text-sky-100"
                        />
                    </div>
                    {item.transliteration && (
                        <div className="mb-4">
                            <InteractiveText
                                text={item.transliteration}
                                terms={{
                                    mustaqeem: {
                                        title: 'Mustaqeem',
                                        description: 'The straight and upright path',
                                    },
                                }}
                                className="text-sky-700 italic dark:text-sky-300"
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <InteractiveText
                            text={item.translation}
                            terms={{
                                'Umar ibn al-Khattab': {
                                    title: 'Umar ibn al-Khattab',
                                    description: 'Second caliph of Islam and close companion of the Prophet',
                                },
                            }}
                            className="text-lg text-sky-800 dark:text-sky-200"
                        />
                    </div>
                    <div className="mb-4">
                        <Button asChild variant="outline" className="h-8 px-4 text-sm">
                            <Link href={`/books/${bookId}/${chapterId}/${contentId}/explanations`}>Explanation</Link>
                        </Button>
                    </div>
                    {!isQuran && (
                        <div className="mb-4 flex items-center gap-4 text-sm">
                            <span className="text-sky-600 dark:text-sky-400">
                                <strong>Narrator:</strong> {item.narrator}
                            </span>
                            <span className="rounded-full bg-green-100 px-2 py-1 text-green-700 text-xs dark:bg-green-900 dark:text-green-300">
                                {item.grade}
                            </span>
                        </div>
                    )}
                    {item.tags && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {item.tags.map((tag: string) => (
                                <Link key={tag} href={`/tags/${tag}`}>
                                    <Badge>{tag}</Badge>
                                </Link>
                            ))}
                        </div>
                    )}
                    <Link
                        href={sourceUrl}
                        target="_blank"
                        className="text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
                    >
                        View original Arabic source
                    </Link>
                </div>
            </div>
        </div>
    );
}
