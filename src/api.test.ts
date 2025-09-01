import { expect, mock, test } from 'bun:test';

mock.module('@clerk/nextjs/server', () => ({ auth: async () => ({ userId: 'user_1' }) }));

import { GET as getExplanations } from '@/app/api/books/[bookId]/chapters/[chapterId]/contents/[contentId]/explanations/route';
import { GET as getContent } from '@/app/api/books/[bookId]/chapters/[chapterId]/contents/[contentId]/route';
import { GET as getContents } from '@/app/api/books/[bookId]/chapters/[chapterId]/contents/route';
import { GET as getChapter } from '@/app/api/books/[bookId]/chapters/[chapterId]/route';
import { GET as getChapters } from '@/app/api/books/[bookId]/chapters/route';
import { GET as getBook } from '@/app/api/books/[bookId]/route';
import { GET as getBooks } from '@/app/api/books/route';
import { GET as searchGet } from '@/app/api/search/route';
import { GET as getTag } from '@/app/api/tags/[tag]/route';

test('books route returns list', async () => {
    const res = await getBooks();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
});

test('book route returns single book', async () => {
    const res = await getBook(new Request('http://test'), { params: Promise.resolve({ bookId: 'quran' }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe('quran');
});

test('chapters route returns list', async () => {
    const res = await getChapters(new Request('http://test'), { params: Promise.resolve({ bookId: 'quran' }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
});

test('chapter route returns chapter', async () => {
    const res = await getChapter(new Request('http://test'), {
        params: Promise.resolve({ bookId: 'quran', chapterId: '1' }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe(1);
});

test('contents route returns items', async () => {
    const res = await getContents(new Request('http://test'), {
        params: Promise.resolve({ bookId: 'quran', chapterId: '1' }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
});

test('content route returns item', async () => {
    const res = await getContent(new Request('http://test'), {
        params: Promise.resolve({ bookId: 'quran', chapterId: '1', contentId: '6' }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe(6);
});

test('search route returns results', async () => {
    const res = await searchGet(new Request('http://test?q=allah'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
});

test('explanations route returns list', async () => {
    const res = await getExplanations(new Request('http://test'), {
        params: Promise.resolve({ bookId: 'quran', chapterId: '1', contentId: '6' }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
});

test('tag route returns tagged items', async () => {
    const res = await getTag(new Request('http://test'), { params: Promise.resolve({ tag: 'guidance' }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
});
