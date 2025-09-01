import { cookies } from 'next/headers';
import ContentReader from './ContentReader';

export default async function ChapterPage({ params }: { params: Promise<{ bookId: string; chapterId: string }> }) {
    const { bookId, chapterId } = await params;
    const cookieHeader = cookies().toString();
    const [bookRes, chapterRes, chaptersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}`, {
            cache: 'force-cache',
            headers: { cookie: cookieHeader },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}/chapters/${chapterId}`, {
            cache: 'force-cache',
            headers: { cookie: cookieHeader },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}/chapters`, {
            cache: 'force-cache',
            headers: { cookie: cookieHeader },
        }),
    ]);
    if (!bookRes.ok || !chapterRes.ok || !chaptersRes.ok) {
        return <div>Chapter not found</div>;
    }
    const [book, chapter, chapters] = await Promise.all([bookRes.json(), chapterRes.json(), chaptersRes.json()]);
    const idx = chapters.findIndex((c: any) => c.id.toString() === chapterId);
    const prevChapterId = idx > 0 ? chapters[idx - 1].id.toString() : null;
    const nextChapterId = idx < chapters.length - 1 ? chapters[idx + 1].id.toString() : null;
    return (
        <ContentReader
            bookId={bookId}
            chapterId={chapterId}
            chapterTitle={chapter.nameAr}
            chapterTitleEn={chapter.nameEn}
            bookTitle={book.title}
            prevChapterId={prevChapterId}
            nextChapterId={nextChapterId}
        />
    );
}
