'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TermInfo {
    title: string;
    description: string;
}

interface InteractiveTextProps {
    text: string;
    terms: Record<string, TermInfo>;
    className?: string;
}

export function InteractiveText({ text, terms, className }: InteractiveTextProps) {
    const [open, setOpen] = useState<string | null>(null);

    const parts = Object.keys(terms).reduce<React.ReactNode[]>(
        (acc, term) => {
            const res: React.ReactNode[] = [];
            acc.forEach((part, idx) => {
                if (typeof part === 'string') {
                    const pieces = part.split(term);
                    pieces.forEach((p, i) => {
                        res.push(p);
                        if (i < pieces.length - 1) {
                            res.push(
                                <button
                                    type="button"
                                    key={`${term}-${idx}-${p}`}
                                    className="cursor-pointer text-sky-600 underline decoration-dotted underline-offset-4 dark:text-sky-400"
                                    onClick={() => setOpen(term)}
                                >
                                    {term}
                                </button>,
                            );
                        }
                    });
                } else {
                    res.push(part);
                }
            });
            return res;
        },
        [text] as React.ReactNode[],
    );

    return (
        <span className={className}>
            {parts}
            {open && (
                <Dialog open={true} onOpenChange={() => setOpen(null)}>
                    <DialogContent className="relative">
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={() => setOpen(null)}
                            className="absolute top-3 right-3 text-sky-500 hover:text-sky-700"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <DialogHeader>
                            <DialogTitle>{terms[open].title}</DialogTitle>
                        </DialogHeader>
                        <p>{terms[open].description}</p>
                    </DialogContent>
                </Dialog>
            )}
        </span>
    );
}
