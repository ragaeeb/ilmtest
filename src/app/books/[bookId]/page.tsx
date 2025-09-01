import { cookies } from 'next/headers';
import BookChapters from './BookChapters';

export default async function BookPage({ params }: { params: Promise<{ bookId: string }> }) {
    const { bookId } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}`, {
        cache: 'force-cache',
        headers: { cookie: (await cookies()).toString() },
    });
    if (!res.ok) {
        return <div>Book not found</div>;
    }
    const book = await res.json();
    return <BookChapters bookId={bookId} bookTitle={book.title} bookTitleEn={book.titleEn} />;
}
