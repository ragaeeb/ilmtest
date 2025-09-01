'use client';

import { ArrowLeft, BookOpen, Hash, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface BookChaptersProps {
    bookId: string;
    bookTitle: string;
    bookTitleEn: string;
}

export default function BookChapters({
    bookId = 'quran',
    bookTitle = 'القرآن الكريم',
    bookTitleEn = 'The Holy Quran',
}: BookChaptersProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [chapters, setChapters] = useState<any[]>([]);

    useEffect(() => {
        fetch(`/api/books/${bookId}/chapters`)
            .then((res) => res.json())
            .then(setChapters)
            .catch(() => setChapters([]));
    }, [bookId]);

    const isQuran = bookId === 'quran';

    const filteredChapters = chapters.filter(
        (chapter) =>
            chapter.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || chapter.nameAr.includes(searchTerm),
    );

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
                            <Link href="/">
                                <ArrowLeft className="h-5 w-5" />
                                <span>Back to Library</span>
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center">
                        <h1 className="mb-2 font-bold text-4xl text-sky-800 dark:text-sky-200">{bookTitle}</h1>
                        <h2 className="mb-4 font-semibold text-2xl text-sky-600 dark:text-sky-400">{bookTitleEn}</h2>
                        <p className="text-sky-600 dark:text-sky-400">
                            Select a {isQuran ? 'Surah' : 'Book'} to begin reading
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6 rounded-xl border border-sky-200 bg-white/70 p-4 shadow-lg backdrop-blur-sm dark:border-sky-800 dark:bg-gray-900/70">
                    <div className="relative">
                        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-sky-500" />
                        <input
                            type="text"
                            placeholder={`Search ${isQuran ? 'Surahs' : 'Books'}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-sky-200 bg-white/50 py-3 pr-4 pl-10 text-sky-800 placeholder-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-sky-700 dark:bg-gray-800/50 dark:text-sky-200"
                        />
                    </div>
                </div>

                {/* Chapters Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredChapters.map((chapter) => (
                        <Link
                            key={chapter.id}
                            href={`/books/${bookId}/${chapter.id}`}
                            className="group cursor-pointer rounded-xl border border-sky-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-sky-800 dark:bg-gray-900/80"
                        >
                            {/* Chapter Number */}
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 font-bold text-white">
                                        {chapter.id}
                                    </div>
                                    {isQuran && (
                                        <span className="rounded-full bg-sky-100 px-2 py-1 text-sky-600 text-xs dark:bg-sky-900 dark:text-sky-400">
                                            {(chapter as any).revelation}
                                        </span>
                                    )}
                                </div>
                                <BookOpen className="h-5 w-5 text-sky-500 transition-colors group-hover:text-sky-600" />
                            </div>

                            {/* Arabic Name */}
                            <h3 className="mb-2 text-right font-bold text-sky-800 text-xl dark:text-sky-200">
                                {chapter.nameAr}
                            </h3>

                            {/* English Name */}
                            <h4 className="mb-2 font-semibold text-lg text-sky-600 dark:text-sky-400">
                                {chapter.nameEn}
                            </h4>

                            {/* Additional Info */}
                            {isQuran ? (
                                <div className="space-y-2">
                                    <p className="text-sky-600 text-sm italic dark:text-sky-400">
                                        "{(chapter as any).meaning}"
                                    </p>
                                    <div className="flex items-center gap-2 text-sky-500 text-sm">
                                        <Hash className="h-4 w-4" />
                                        <span>{(chapter as any).verses} verses</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sky-500 text-sm">
                                    <Hash className="h-4 w-4" />
                                    <span>{(chapter as any).hadithCount} hadiths</span>
                                </div>
                            )}

                            {/* Hover Effect */}
                            <div className="absolute inset-0 rounded-xl border-2 border-transparent transition-colors duration-300 group-hover:border-sky-300 dark:group-hover:border-sky-600" />
                        </Link>
                    ))}
                </div>

                {/* No Results */}
                {filteredChapters.length === 0 && (
                    <div className="py-12 text-center">
                        <BookOpen className="mx-auto mb-4 h-16 w-16 text-sky-400" />
                        <h3 className="mb-2 font-semibold text-sky-600 text-xl dark:text-sky-400">
                            No {isQuran ? 'Surahs' : 'Books'} Found
                        </h3>
                        <p className="text-sky-500">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
}
