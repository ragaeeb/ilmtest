import ContentReader from './ContentReader';

export default async function ChapterPage({ params }: { params: { bookId: string; chapterId: string } }) {
    const { bookId, chapterId } = params;
    const [bookRes, chapterRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}`, { cache: 'force-cache' }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}/chapters/${chapterId}`, {
            cache: 'force-cache',
        }),
    ]);
    if (!bookRes.ok || !chapterRes.ok) {
        return <div>Chapter not found</div>;
    }
    const book = await bookRes.json();
    const chapter = await chapterRes.json();
    return (
        <ContentReader
            bookId={bookId}
            chapterId={chapterId}
            chapterTitle={chapter.nameAr}
            chapterTitleEn={chapter.nameEn}
            bookTitle={book.title}
        />
    );
}
