import ContentReader from './ContentReader';
import { fetchWithCookies } from '@/lib/fetchWithCookies';

export default async function QuranChapterPage({ params }: { params: { chapterId: string } }) {
    const { chapterId } = params;
    const bookId = 'quran';
    const [bookRes, chapterRes, chaptersRes] = await Promise.all([
        fetchWithCookies(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}`, { cache: 'force-cache' }),
        fetchWithCookies(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}/chapters/${chapterId}`, { cache: 'force-cache' }),
        fetchWithCookies(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}/chapters`, { cache: 'force-cache' }),
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
