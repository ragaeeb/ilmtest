import { SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { BookOpen, Heart, Star } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function BooksGrid() {
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/books`, {
        cache: 'force-cache',
        headers: { cookie: cookieHeader },
    });
    if (!res.ok) {
        return <div className="text-center text-red-500">Failed to load books</div>;
    }
    const books = await res.json();
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book: any) => (
                <Link
                    href={`/books/${book.id}`}
                    key={book.id}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-sky-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-sky-800 dark:bg-gray-900/80"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-600/5 transition-all duration-300 group-hover:from-sky-500/10 group-hover:to-blue-600/10" />
                    <div className="relative z-10">
                        <div className="mb-4 text-center text-4xl">{book.icon}</div>
                        <h3 className="mb-2 text-center font-arabic font-bold text-2xl text-sky-800 dark:text-sky-200">
                            {book.title}
                        </h3>
                        <h4 className="mb-4 text-center font-semibold text-lg text-sky-600 dark:text-sky-400">
                            {book.titleEn}
                        </h4>
                        <p className="mb-6 text-center text-sky-600 leading-relaxed dark:text-sky-400">
                            {book.description}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sky-500 text-sm dark:text-sky-400">
                            <BookOpen className="h-4 w-4" />
                            <span>
                                {book.chapters} {book.id === 'quran' ? 'Surahs' : 'Books'}
                            </span>
                        </div>
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300 group-hover:border-sky-300 dark:group-hover:border-sky-600" />
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default async function Home() {
    const { userId } = await auth();
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-16 text-center">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-xl">
                        <BookOpen className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="mb-4 bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text font-bold text-5xl text-transparent dark:from-sky-400 dark:to-blue-300">
                        مكتبة الإسلام
                    </h1>
                    <h2 className="mb-4 font-semibold text-3xl text-sky-700 dark:text-sky-300">Islamic Library</h2>
                    <p className="mx-auto max-w-2xl text-sky-600 text-xl leading-relaxed dark:text-sky-400">
                        Your complete digital library for the Quran and authentic hadith collections. Explore the
                        timeless wisdom of Islamic texts with beautiful translations.
                    </p>
                </div>

                {!userId ? (
                    <div className="mb-12 rounded-2xl border border-sky-200 bg-white/70 p-12 shadow-xl backdrop-blur-sm dark:border-sky-800 dark:bg-gray-900/70">
                        <div className="text-center">
                            <Heart className="mx-auto mb-6 h-16 w-16 text-sky-600 dark:text-sky-400" />
                            <h3 className="mb-4 font-semibold text-3xl text-sky-800 dark:text-sky-200">
                                Join the Library
                            </h3>
                            <p className="mb-8 text-sky-600 dark:text-sky-400">
                                Sign in to access your personalized reading experience, bookmarks, and reading history.
                            </p>
                            <SignInButton mode="modal">
                                <button
                                    type="button"
                                    className="rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-sky-600"
                                >
                                    Sign In
                                </button>
                            </SignInButton>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 rounded-2xl border border-sky-200 bg-white/70 p-6 shadow-xl backdrop-blur-sm dark:border-sky-800 dark:bg-gray-900/70">
                            <div className="mb-4 flex items-center gap-3">
                                <Star className="h-6 w-6 text-amber-500" />
                                <h3 className="font-semibold text-sky-800 text-xl dark:text-sky-200">
                                    Continue Your Journey
                                </h3>
                            </div>
                            <p className="text-sky-600 dark:text-sky-400">
                                Welcome back! Select a book below to continue your Islamic studies.
                            </p>
                        </div>
                        {/* Books Grid */}
                        <BooksGrid />
                    </>
                )}

                {/* Footer */}
                <div className="mt-20 border-sky-200 border-t pt-12 text-center dark:border-sky-800">
                    <p className="text-lg text-sky-600 dark:text-sky-400">بسم الله الرحمن الرحيم</p>
                    <p className="mt-2 text-sky-500 dark:text-sky-500">
                        "In the name of Allah, the Most Gracious, the Most Merciful"
                    </p>
                </div>
            </div>
        </div>
    );
}
