'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';

export default function SearchPage() {
    const [query, setQuery] = useQueryState('q', { defaultValue: '' });
    const [input, setInput] = useState(query);
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults([]);
                return;
            }
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                setResults(await res.json());
            }
        };
        fetchResults();
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setQuery(input);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950">
            <div className="container mx-auto px-4 py-12">
                <form onSubmit={handleSearch} className="mb-8 flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search the library..."
                        className="flex-1 rounded-lg border border-sky-200 bg-white/50 px-4 py-2 text-sky-800 placeholder-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-sky-700 dark:bg-gray-800/50 dark:text-sky-200"
                    />
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-white transition-colors hover:bg-sky-600"
                    >
                        <Search className="h-4 w-4" />
                        Search
                    </button>
                </form>

                <div className="space-y-4">
                    {results.map((r) => (
                        <Link
                            key={r.id}
                            href={`/books/${r.bookId}/${r.chapterId}/${r.contentId}`}
                            className="block rounded-xl border border-sky-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-colors hover:bg-white dark:border-sky-800 dark:bg-gray-900/80"
                        >
                            <h3 className="font-semibold text-sky-800 dark:text-sky-200">{r.title}</h3>
                            <p className="text-sky-600 text-sm dark:text-sky-400">{r.snippet}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
