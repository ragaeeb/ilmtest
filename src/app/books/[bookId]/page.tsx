'use client';

import { use } from 'react';
import BookChapters from './BookChapters';

const bookTitles = {
    quran: { ar: 'القرآن الكريم', en: 'The Holy Quran' },
    'sahih-bukhari': { ar: 'صحيح البخاري', en: 'Sahih al-Bukhari' },
    'sahih-muslim': { ar: 'صحيح مسلم', en: 'Sahih Muslim' },
    'sunan-abi-dawud': { ar: 'سنن أبي داود', en: 'Sunan Abi Dawud' },
    'jami-tirmidhi': { ar: 'جامع الترمذي', en: 'Jami at-Tirmidhi' },
    'sunan-nasai': { ar: 'سنن النسائي', en: 'Sunan an-Nasai' },
};

export default function BookPage({ params }: { params: Promise<{ bookId: string }> }) {
    const { bookId } = use(params);
    const book = bookTitles[bookId as keyof typeof bookTitles];

    if (!book) {
        return <div>Book not found</div>;
    }

    return <BookChapters bookId={bookId} bookTitle={book.ar} bookTitleEn={book.en} />;
}
