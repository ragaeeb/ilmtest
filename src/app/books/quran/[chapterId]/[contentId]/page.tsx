import Link from 'next/link';
import { InteractiveText } from '@/components/InteractiveText';
import { Badge } from '@/components/ui/badge';
import { fetchWithCookies } from '@/lib/fetchWithCookies';

export default async function QuranContentPage({ params }: { params: { chapterId: string; contentId: string } }) {
    const { chapterId, contentId } = params;
    const bookId = 'quran';
    const res = await fetchWithCookies(
        `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}/chapters/${chapterId}/contents/${contentId}`,
        { cache: 'force-cache' },
    );
    if (!res.ok) {
        return <div>Content not found</div>;
    }
    const item = await res.json();
    const bookRes = await fetchWithCookies(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}`, { cache: 'force-cache' });
    const book = bookRes.ok ? await bookRes.json() : null;
    const sourceUrl = book?.url ? book.url.replace('{{id}}', contentId) : '';
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8 rounded-2xl border border-sky-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-sky-800 dark:bg-gray-900/80">
                    <h1 className="mb-4 text-center font-bold text-3xl text-sky-800 dark:text-sky-200">Verse {contentId}</h1>
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
                    {item.translator && (
                        <div className="mb-4">
                            <Badge variant="secondary">{item.translator}</Badge>
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
