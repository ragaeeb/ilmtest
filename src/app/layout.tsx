import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs';
import type { Metadata } from 'next';
import Link from 'next/link';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Toaster } from '@/lib/sonner';
import pkg from '../../package.json';
import './globals.css';

export const metadata: Metadata = {
    title: 'IlmTest',
    description: 'IlmTest',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const version = pkg.version;
    const homepage = pkg.homepage;
    const versionUrl = `${homepage}/releases/tag/v${version}`;
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="antialiased">
                    <SignedIn>
                        <div className="fixed top-4 right-4 z-50">
                            <UserButton />
                        </div>
                    </SignedIn>
                    <NuqsAdapter>{children}</NuqsAdapter>
                    <footer className="mt-8 border-t bg-muted/50 py-4 text-center text-muted-foreground text-xs">
                        <p>
                            © 2025 IlmTest. All rights reserved.{' '}
                            <Link href={versionUrl} className="underline" target="_blank">
                                v{version}
                            </Link>
                        </p>
                    </footer>
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    );
}
