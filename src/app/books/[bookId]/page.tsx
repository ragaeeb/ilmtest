import BookChapters from './BookChapters';
import { fetchWithCookies } from '@/lib/fetchWithCookies';

export default async function BookPage({ params }: { params: Promise<{ bookId: string }> }) {
    const { bookId } = await params;
    const res = await fetchWithCookies(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/${bookId}`, {
        cache: 'force-cache',
    });
    if (!res.ok) {
        return <div>Book not found</div>;
    }
    const book = await res.json();
    return <BookChapters bookId={bookId} bookTitle={book.title} bookTitleEn={book.titleEn} author={book.author} />;
}
