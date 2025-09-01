import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function ExplanationsPage({
    params,
}: {
    params: { bookId: string; chapterId: string; contentId: string };
}) {
    const { bookId, chapterId, contentId } = params;
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}/chapters/${chapterId}/contents/${contentId}/explanations`,
        { cache: 'force-cache', headers: { cookie: cookies().toString() } },
    );
    const explanations = res.ok ? await res.json() : [];
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950">
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-6 font-bold text-2xl text-sky-800 dark:text-sky-200">Explanations</h1>
                <ul className="space-y-4">
                    {explanations.map((e: any) => (
                        <li
                            key={e.id}
                            className="rounded-lg border border-sky-200 bg-white/80 p-4 shadow-sm dark:border-sky-800 dark:bg-gray-900/80"
                        >
                            <Link
                                href={`/books/${e.bookId}/${e.chapterId}/${e.contentId}`}
                                className="text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
                            >
                                {e.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
