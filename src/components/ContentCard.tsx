'use client';

import { Copy, Heart, Share } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from '@/lib/sonner';
import { InteractiveText } from '@/components/InteractiveText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface ContentItem {
    id: number | string;
    arabic: string;
    translation: string;
    transliteration?: string;
    narrator?: string;
    grade?: string;
    tags?: string[];
}

export function ContentCard({
    bookId,
    chapterId,
    item,
    showTransliteration = false,
}: {
    bookId: string;
    chapterId: string;
    item: ContentItem;
    showTransliteration?: boolean;
}) {
    const isQuran = bookId === 'quran';
    const copy = () => navigator.clipboard.writeText(item.arabic);
    const [editing, setEditing] = useState(false);
    const [arabicText, setArabicText] = useState(item.arabic);
    const [translationText, setTranslationText] = useState(item.translation);

    const submitTypo = async () => {
        await fetch('/api/typo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookId,
                chapterId,
                contentId: item.id,
                arabic: arabicText,
                translation: translationText,
            }),
        });
        toast('Typo submitted');
        setEditing(false);
    };
    return (
        <div className="rounded-xl border border-sky-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-sky-800 dark:bg-gray-900/80">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 font-bold text-sm text-white">
                        {isQuran ? `${chapterId}:${item.id}` : `#${item.id}`}
                    </div>
                    <span className="text-sky-500 text-sm">{isQuran ? `Verse ${item.id}` : `Hadith ${item.id}`}</span>
                </div>
                <Link
                    href={`/books/${bookId}/${chapterId}/${item.id}`}
                    className="text-sky-500 text-sm underline-offset-2 hover:underline"
                >
                    View
                </Link>
            </div>

            <div className="mb-6">
                {editing ? (
                    <textarea
                        className="w-full rounded border p-2"
                        value={arabicText}
                        onChange={(e) => setArabicText(e.target.value)}
                    />
                ) : (
                    <InteractiveText
                        text={item.arabic}
                        terms={{}}
                        className="text-right font-arabic text-2xl text-sky-900 leading-relaxed dark:text-sky-100"
                    />
                )}
            </div>

            {showTransliteration && item.transliteration && (
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

            <div className="mb-4">
                {editing ? (
                    <textarea
                        className="w-full rounded border p-2"
                        value={translationText}
                        onChange={(e) => setTranslationText(e.target.value)}
                    />
                ) : (
                    <InteractiveText
                        text={item.translation}
                        terms={{}}
                        className="text-lg text-sky-800 leading-relaxed dark:text-sky-200"
                    />
                )}
            </div>
            <div className="mb-4">
                <Button asChild variant="outline" className="h-7 px-3 text-xs">
                    <Link href={`/books/${bookId}/${chapterId}/${item.id}/explanations`}>Explanation</Link>
                </Button>
            </div>

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
            {item.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                        <Link href={`/tags/${tag}`} key={tag}>
                            <Badge>{tag}</Badge>
                        </Link>
                    ))}
                </div>
            ) : null}

            {editing ? (
                <div className="mt-4">
                    <Button onClick={submitTypo}>Submit</Button>
                </div>
            ) : (
                <div className="mt-4 flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={copy}
                        className="cursor-pointer rounded-lg p-2 text-sky-500 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-900"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="cursor-pointer rounded-lg p-2 text-sky-500 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-900"
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="cursor-pointer rounded-lg p-2 text-sky-500 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-900"
                    >
                        <Share className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setEditing(true)}
                    >
                        Report Typo
                    </Button>
                </div>
            )}
        </div>
    );
}
