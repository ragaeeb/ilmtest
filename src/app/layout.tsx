import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs';
import type { Metadata } from 'next';
import Link from 'next/link';
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
                    {children}
                    <footer className="mt-8 text-center text-sm text-sky-500">
                        <Link href={versionUrl} className="underline" target="_blank">
                            v{version}
                        </Link>
                    </footer>
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    );
}
