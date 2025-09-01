'use client';

import { use } from 'react';
import ContentReader from './ContentReader';

const bookTitles = {
    quran: { ar: 'القرآن الكريم', en: 'The Holy Quran' },
    'sahih-bukhari': { ar: 'صحيح البخاري', en: 'Sahih al-Bukhari' },
    // ... other books
};

// Sample chapter data
const chapterTitles = {
    quran: {
        '1': { ar: 'الفاتحة', en: 'Al-Fatiha' },
        '2': { ar: 'البقرة', en: 'Al-Baqarah' },
        // ... other surahs
    },
    'sahih-bukhari': {
        '1': { ar: 'كتاب بدء الوحي', en: 'Book of Revelation' },
        '2': { ar: 'كتاب الإيمان', en: 'Book of Faith' },
        // ... other books
    },
};

export default function ChapterPage({ params }: { params: Promise<{ bookId: string; chapterId: string }> }) {
    console.log('params', params);
    const { bookId, chapterId } = use(params);
    const book = bookTitles[bookId as keyof typeof bookTitles];
    const chapter =
        chapterTitles[bookId as keyof typeof chapterTitles]?.[
            chapterId as keyof (typeof chapterTitles)[keyof typeof chapterTitles]
        ];

    if (!book || !chapter) {
        return <div>Chapter not found</div>;
    }

    return (
        <ContentReader
            bookId={bookId}
            chapterId={chapterId}
            chapterTitle={chapter.ar}
            chapterTitleEn={chapter.en}
            bookTitle={book.ar}
        />
    );
}
