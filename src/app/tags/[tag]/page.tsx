import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function TagPage({ params }: { params: { tag: string } }) {
    const { tag } = params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/tags/${tag}`, {
        cache: 'force-cache',
        headers: { cookie: cookies().toString() },
    });
    const items = res.ok ? await res.json() : [];
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950">
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-6 font-bold text-2xl text-sky-800 dark:text-sky-200">Tag: {tag}</h1>
                <ul className="space-y-4">
                    {items.map((item: any) => (
                        <li
                            key={`${item.bookId}-${item.chapterId}-${item.contentId}`}
                            className="rounded-lg border border-sky-200 bg-white/80 p-4 shadow-sm dark:border-sky-800 dark:bg-gray-900/80"
                        >
                            <Link
                                href={`/books/${item.bookId}/${item.chapterId}/${item.contentId}`}
                                className="text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
                            >
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
