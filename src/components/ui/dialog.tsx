'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function Dialog({
    open,
    onOpenChange,
    children,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    children: React.ReactNode;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        open ? dialog.showModal() : dialog.close();
    }, [open]);
    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        const handler = (e: MouseEvent) => {
            if (e.target === dialog) onOpenChange(false);
        };
        dialog.addEventListener('click', handler);
        return () => dialog.removeEventListener('click', handler);
    }, [onOpenChange]);
    return (
        <dialog
            ref={ref}
            className="rounded-lg border border-sky-200 bg-white p-6 shadow-lg backdrop:bg-black/50 dark:border-sky-800 dark:bg-gray-900"
            onClose={() => onOpenChange(false)}
        >
            {children}
        </dialog>
    );
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn(className)}>{children}</div>;
}

export function DialogHeader({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn('mb-4 flex flex-col space-y-1.5 text-center sm:text-left', className)}>{children}</div>;
}

export function DialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
    return <h2 className={cn('font-semibold text-lg', className)}>{children}</h2>;
}
