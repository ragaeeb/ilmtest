'use client';

import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/ui/button';

interface ContentReaderProps {
    bookId?: string;
    chapterId?: string;
    chapterTitle?: string;
    chapterTitleEn?: string;
    bookTitle?: string;
    prevChapterId?: string | null;
    nextChapterId?: string | null;
}

export default function ContentReader({
    bookId = 'quran',
    chapterId = '1',
    chapterTitle = 'الفاتحة',
    chapterTitleEn = 'Al-Fatiha',
    bookTitle = 'القرآن الكريم',
    prevChapterId = null,
    nextChapterId = null,
}: ContentReaderProps) {
    const [showTransliteration, setShowTransliteration] = useState(false);
    const [content, setContent] = useState<any[]>([]);

    const isQuran = bookId === 'quran';

    useEffect(() => {
        fetch(`/api/books/${bookId}/chapters/${chapterId}/contents`)
            .then((res) => res.json())
            .then(setContent)
            .catch(() => setContent([]));
    }, [bookId, chapterId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 rounded-2xl border border-sky-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-sky-800 dark:bg-gray-900/80">
                    <div className="mb-4 flex items-center gap-4">
                        <Button
                            asChild
                            variant="outline"
                            className="flex items-center gap-2 text-sky-600 transition-colors hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200"
                        >
                            <Link href={`/books/${bookId}`}>
                                <ArrowLeft className="h-5 w-5" />
                                <span>Back to {isQuran ? 'Surahs' : 'Books'}</span>
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="mb-2 text-sky-600 dark:text-sky-400">{bookTitle}</p>
                        <h1 className="mb-2 font-bold text-3xl text-sky-800 dark:text-sky-200">{chapterTitle}</h1>
                        <h2 className="mb-4 font-semibold text-sky-600 text-xl dark:text-sky-400">{chapterTitleEn}</h2>
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                className="rounded-lg px-4 py-2 text-sky-600 transition-colors hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-900"
                                onClick={() => setShowTransliteration(!showTransliteration)}
                            >
                                Toggle Transliteration
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {content.map((item) => (
                        <ContentCard
                            key={item.id}
                            bookId={bookId}
                            chapterId={chapterId}
                            item={item}
                            showTransliteration={isQuran && showTransliteration}
                        />
                    ))}
                </div>

                {/* Navigation */}
                <div className="mt-12 flex items-center justify-between rounded-xl border border-sky-200 bg-white/70 p-6 shadow-lg backdrop-blur-sm dark:border-sky-800 dark:bg-gray-900/70">
                    {prevChapterId ? (
                        <Button
                            asChild
                            variant="default"
                            className="flex items-center gap-2 rounded-lg px-6 py-3 text-white"
                        >
                            <Link href={`/books/${bookId}/${prevChapterId}`}>
                                <ArrowLeft className="h-5 w-5" />
                                Previous {isQuran ? 'Surah' : 'Chapter'}
                            </Link>
                        </Button>
                    ) : (
                        <span />
                    )}

                    <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                        <BookOpen className="h-5 w-5" />
                        <span>
                            {content.length} {isQuran ? 'verses' : 'hadiths'}
                        </span>
                    </div>

                    {nextChapterId ? (
                        <Button
                            asChild
                            variant="default"
                            className="flex items-center gap-2 rounded-lg px-6 py-3 text-white"
                        >
                            <Link href={`/books/${bookId}/${nextChapterId}`}>
                                Next {isQuran ? 'Surah' : 'Chapter'}
                                <ArrowLeft className="h-5 w-5 rotate-180" />
                            </Link>
                        </Button>
                    ) : (
                        <span />
                    )}
                </div>
            </div>
        </div>
    );
}
