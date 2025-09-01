import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/ratelimit';

// reuse mock data from contents route
const mockContents: Record<string, Record<string, any[]>> = {
    quran: {
        '1': [
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
        ],
    },
    'sahih-bukhari': {
        '1': [
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
        ],
    },
};

export const revalidate = 3600;

export async function GET(
    _req: Request,
    { params }: { params: { bookId: string; chapterId: string; contentId: string } },
) {
    const { userId } = auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!rateLimit(userId)) {
        return new NextResponse('Too Many Requests', { status: 429 });
    }
    const { bookId, chapterId, contentId } = params;
    const endpoint = process.env.ILMTEST_API_ENDPOINT;
    if (endpoint) {
        try {
            const res = await fetch(`${endpoint}/books/${bookId}/chapters/${chapterId}/contents/${contentId}`, {
                next: { revalidate: 3600 },
                cache: 'force-cache',
            });
            if (res.ok) {
                const data = await res.json();
                return NextResponse.json(data, {
                    headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
                });
            }
        } catch (_err) {
            // ignore
        }
    }
    const content = mockContents[bookId]?.[chapterId]?.find((c) => c.id.toString() === contentId);
    if (!content) {
        return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.json(content, {
        headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
    });
}
