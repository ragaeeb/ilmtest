import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function ContentPage({
    params,
}: {
    params: { bookId: string; chapterId: string; contentId: string };
}) {
    const { bookId, chapterId, contentId } = params;
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}/chapters/${chapterId}/contents/${contentId}`,
        {
            cache: 'force-cache',
            headers: { cookie: cookies().toString() },
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
                    <div className="mb-4 text-right font-arabic text-2xl text-sky-900 dark:text-sky-100">
                        {item.arabic}
                    </div>
                    {item.transliteration && (
                        <p className="mb-4 text-sky-700 italic dark:text-sky-300">{item.transliteration}</p>
                    )}
                    <p className="mb-4 text-lg text-sky-800 dark:text-sky-200">{item.translation}</p>
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
