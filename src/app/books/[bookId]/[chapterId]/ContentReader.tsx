'use client';

import { ArrowLeft, BookOpen, Copy, Heart, Share } from 'lucide-react';
import { use, useState } from 'react';
import { Button } from '@/components/ui/button';

// Sample Quran data (Al-Fatiha)
const quranVerses = [
    {
        id: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
        transliteration: 'Bismillahi ar-rahmani ar-raheem',
    },
    {
        id: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        translation: 'All praise is due to Allah, Lord of the worlds',
        transliteration: 'Al-hamdu lillahi rabbi al-alameen',
    },
    {
        id: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'The Most Gracious, the Most Merciful',
        transliteration: 'Ar-rahmani ar-raheem',
    },
    {
        id: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        translation: 'Master of the Day of Judgment',
        transliteration: 'Maliki yawmi ad-deen',
    },
    {
        id: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        translation: 'You alone we worship, and You alone we ask for help',
        transliteration: "Iyyaka na'budu wa iyyaka nasta'een",
    },
    {
        id: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        translation: 'Guide us to the straight path',
        transliteration: 'Ihdinaa as-siraat al-mustaqeem',
    },
    {
        id: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        translation:
            'The path of those whom You have blessed—not those who have incurred Your wrath or those who have gone astray',
        transliteration: "Siraat al-ladheena an'amta alayhim ghayri al-maghdoobi alayhim wa laa ad-dalleen",
    },
];

// Sample Hadith data (Book of Faith)
const hadithData = [
    {
        id: 1,
        arabic: 'عن عمر بن الخطاب رضي الله عنه قال: بينما نحن عند رسول الله صلى الله عليه وسلم ذات يوم إذ طلع علينا رجل شديد بياض الثياب، شديد سواد الشعر، لا يرى عليه أثر السفر، ولا يعرفه منا أحد، حتى جلس إلى النبي صلى الله عليه وسلم...',
        translation:
            'Umar ibn al-Khattab (may Allah be pleased with him) reported: While we were sitting with the Messenger of Allah (peace be upon him) one day, a man appeared before us whose clothes were exceedingly white and whose hair was exceedingly black; no signs of journey were to be seen on him and none of us knew him...',
        narrator: 'Umar ibn al-Khattab',
        grade: 'Sahih (Authentic)',
    },
    {
        id: 2,
        arabic: 'عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "الإيمان بضع وسبعون شعبة، فأفضلها قول لا إله إلا الله، وأدناها إماطة الأذى عن الطريق، والحياء شعبة من الإيمان"',
        translation:
            'Abu Huraira reported that the Messenger of Allah (peace be upon him) said: "Faith has over seventy branches, the most excellent of which is the declaration that there is no god but Allah, and the humblest of which is the removal of what is injurious from the path, and modesty is a branch of faith."',
        narrator: 'Abu Huraira',
        grade: 'Sahih (Authentic)',
    },
];

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

    const isQuran = bookId === 'quran';
    const content = isQuran ? quranVerses : hadithData;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 rounded-2xl border border-sky-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-sky-800 dark:bg-gray-900/80">
                    <div className="mb-4 flex items-center gap-4">
                        <Button className="flex items-center gap-2 text-sky-600 transition-colors hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200">
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back to {isQuran ? 'Surahs' : 'Books'}</span>
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="mb-2 text-sky-600 dark:text-sky-400">{bookTitle}</p>
                        <h1 className="mb-2 font-bold text-3xl text-sky-800 dark:text-sky-200">{chapterTitle}</h1>
                        <h2 className="mb-4 font-semibold text-sky-600 text-xl dark:text-sky-400">{chapterTitleEn}</h2>

                        {/* Controls */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {isQuran && (
                                <Button
                                    onClick={() => setShowTransliteration(!showTransliteration)}
                                    className={`rounded-lg border px-4 py-2 transition-colors ${
                                        showTransliteration
                                            ? 'border-sky-500 bg-sky-500 text-white'
                                            : 'border-sky-200 bg-white/50 text-sky-600 hover:bg-sky-50'
                                    }`}
                                >
                                    Transliteration
                                </Button>
                            )}
                            <Button className="rounded-lg border border-sky-200 bg-white/50 p-2 text-sky-600 transition-colors hover:bg-sky-50">
                                <Share className="h-5 w-5" />
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

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => copyToClipboard(item.arabic)}
                                        className="rounded-lg p-2 text-sky-500 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-900"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button className="rounded-lg p-2 text-sky-500 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-900">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Arabic Text */}
                            <div className="mb-6">
                                <p className="text-right font-arabic text-2xl text-sky-900 leading-relaxed dark:text-sky-100">
                                    {item.arabic}
                                </p>
                            </div>

                            {/* Transliteration (Quran only) */}
                            {isQuran && showTransliteration && (
                                <div className="mb-4 rounded-lg bg-sky-50 p-4 dark:bg-sky-900/30">
                                    <p className="text-sky-700 italic dark:text-sky-300">
                                        {(item as any).transliteration}
                                    </p>
                                </div>
                            )}

                            {/* Translation */}
                            <div className="mb-4">
                                <p className="text-lg text-sky-800 leading-relaxed dark:text-sky-200">
                                    {item.translation}
                                </p>
                            </div>

                            {/* Hadith specific info */}
                            {!isQuran && (
                                <div className="border-sky-200 border-t pt-4 dark:border-sky-700">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sky-600 dark:text-sky-400">
                                                <strong>Narrator:</strong> {(item as any).narrator}
                                            </span>
                                            <span className="rounded-full bg-green-100 px-2 py-1 text-green-700 text-xs dark:bg-green-900 dark:text-green-300">
                                                {(item as any).grade}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
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
