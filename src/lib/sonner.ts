'use client';

export function toast(message: string) {
    if (typeof window !== 'undefined') {
        window.alert(message);
    }
}

export function Toaster() {
    return null;
}
