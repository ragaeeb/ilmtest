'use client';

import { ArrowLeft, BookOpen, Copy, Heart, Share } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { InteractiveText } from '@/components/InteractiveText';
import { Button } from '@/components/ui/button';

interface ContentReaderProps {
    bookId?: string;
    chapterId?: string;
    chapterTitle?: string;
    chapterTitleEn?: string;
    bookTitle?: string;
}

export default function ContentReader({
    bookId = 'quran',
    chapterId = '1',
    chapterTitle = 'الفاتحة',
    chapterTitleEn = 'Al-Fatiha',
    bookTitle = 'القرآن الكريم',
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

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
                        <div
                            key={item.id}
                            className="rounded-xl border border-sky-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-sky-800 dark:bg-gray-900/80"
                        >
                            {/* Reference Number */}
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 font-bold text-sm text-white">
                                        {isQuran ? `${chapterId}:${item.id}` : `#${item.id}`}
                                    </div>
                                    <span className="text-sky-500 text-sm">
                                        {isQuran ? `Verse ${item.id}` : `Hadith ${item.id}`}
                                    </span>
                                </div>
                                <Link
                                    href={`/books/${bookId}/${chapterId}/${item.id}`}
                                    className="text-sky-500 text-sm underline-offset-2 hover:underline"
                                >
                                    View
                                </Link>
                            </div>

                            {/* Arabic Text */}
                            <div className="mb-6">
                                <InteractiveText
                                    text={item.arabic}
                                    terms={{
                                        'عمر بن الخطاب': {
                                            title: 'Umar ibn al-Khattab',
                                            description: 'Second caliph of Islam and close companion of the Prophet',
                                        },
                                    }}
                                    className="text-right font-arabic text-2xl text-sky-900 leading-relaxed dark:text-sky-100"
                                />
                            </div>

                            {/* Transliteration (Quran only) */}
                            {isQuran && showTransliteration && (
                                <div className="mb-4 rounded-lg bg-sky-50 p-4 dark:bg-sky-900/30">
                                    <InteractiveText
                                        text={item.transliteration}
                                        terms={{
                                            mustaqeem: {
                                                title: 'Mustaqeem',
                                                description: 'The straight and upright path',
                                            },
                                        }}
                                        className="text-sky-700 italic dark:text-sky-300"
                                    />
                                </div>
                            )}

                            {/* Translation */}
                            <div className="mb-4">
                                <InteractiveText
                                    text={item.translation}
                                    terms={{
                                        'Umar ibn al-Khattab': {
                                            title: 'Umar ibn al-Khattab',
                                            description: 'Second caliph of Islam and close companion of the Prophet',
                                        },
                                    }}
                                    className="text-lg text-sky-800 leading-relaxed dark:text-sky-200"
                                />
                            </div>
                            <div className="mb-4">
                                <Button asChild variant="outline" className="h-7 px-3 text-xs">
                                    <Link href={`/books/${bookId}/${chapterId}/${item.id}/explanations`}>
                                        Explanation
                                    </Link>
                                </Button>
                            </div>

                            {/* Hadith specific info */}
                            {!isQuran && (
                                <div className="border-sky-200 border-t pt-4 dark:border-sky-700">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sky-600 dark:text-sky-400">
                                                <strong>Narrator:</strong> {item.narrator}
                                            </span>
                                            <span className="rounded-full bg-green-100 px-2 py-1 text-green-700 text-xs dark:bg-green-900 dark:text-green-300">
                                                {item.grade}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="mt-4 flex gap-2">
                                <Button
                                    onClick={() => copyToClipboard(item.arabic)}
                                    className="rounded-lg p-2 text-sky-500 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-900"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button className="rounded-lg p-2 text-sky-500 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-900">
                                    <Heart className="h-4 w-4" />
                                </Button>
                                <Button className="rounded-lg p-2 text-sky-500 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-900">
                                    <Share className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <div className="mt-12 flex items-center justify-between rounded-xl border border-sky-200 bg-white/70 p-6 shadow-lg backdrop-blur-sm dark:border-sky-800 dark:bg-gray-900/70">
                    <Button className="flex items-center gap-2 rounded-lg bg-sky-500 px-6 py-3 text-white transition-colors hover:bg-sky-600">
                        <ArrowLeft className="h-5 w-5" />
                        Previous {isQuran ? 'Surah' : 'Book'}
                    </Button>

                    <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                        <BookOpen className="h-5 w-5" />
                        <span>
                            {content.length} {isQuran ? 'verses' : 'hadiths'}
                        </span>
                    </div>

                    <Button className="flex items-center gap-2 rounded-lg bg-sky-500 px-6 py-3 text-white transition-colors hover:bg-sky-600">
                        Next {isQuran ? 'Surah' : 'Book'}
                        <ArrowLeft className="h-5 w-5 rotate-180" />
                    </Button>
                </div>

                {/* Footer with Dua */}
                <div className="mt-12 border-sky-200 border-t pt-8 text-center dark:border-sky-800">
                    <div className="rounded-xl border border-sky-200 bg-white/70 p-6 shadow-lg backdrop-blur-sm dark:border-sky-800 dark:bg-gray-900/70">
                        <p className="mb-2 font-arabic text-lg text-sky-800 dark:text-sky-200">
                            رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
                        </p>
                        <p className="text-sky-600 italic dark:text-sky-400">
                            "Our Lord, give us good in this world and good in the hereafter, and save us from the
                            punishment of the Fire."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
