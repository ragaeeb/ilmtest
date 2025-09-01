import BookChapters from '../[bookId]/BookChapters';
import { fetchWithCookies } from '@/lib/fetchWithCookies';

export default async function QuranPage() {
    const res = await fetchWithCookies(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books/quran`, { cache: 'force-cache' });
    if (!res.ok) {
        return <div>Book not found</div>;
    }
    const book = await res.json();
    return <BookChapters bookId="quran" bookTitle={book.title} bookTitleEn={book.titleEn} author={book.author} />;
}
