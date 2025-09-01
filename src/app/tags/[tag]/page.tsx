import { cookies } from 'next/headers';
import { ContentCard } from '@/components/ContentCard';

export default async function TagPage({ params }: { params: { tag: string } }) {
    const { tag } = params;
    const cookieHeader = cookies().toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/tags/${tag}`, {
        cache: 'force-cache',
        headers: { cookie: cookieHeader },
    });
    const refs = res.ok ? await res.json() : [];
    const items = (
        await Promise.all(
            refs.map(async (r: any) => {
                const c = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${r.bookId}/chapters/${r.chapterId}/contents/${r.contentId}`,
                    { cache: 'force-cache', headers: { cookie: cookieHeader } },
                );
                if (!c.ok) return null;
                const data = await c.json();
                return { bookId: r.bookId, chapterId: r.chapterId, ...data };
            }),
        )
    ).filter(Boolean);
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950">
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-6 font-bold text-2xl text-sky-800 dark:text-sky-200">Tag: {tag}</h1>
                <div className="space-y-6">
                    {items.map((item: any) => (
                        <ContentCard
                            key={`${item.bookId}-${item.chapterId}-${item.id}`}
                            bookId={item.bookId}
                            chapterId={item.chapterId}
                            item={item}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
