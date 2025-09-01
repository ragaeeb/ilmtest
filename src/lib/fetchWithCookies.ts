import { cookies } from 'next/headers';

export async function fetchWithCookies(input: RequestInfo | URL, init: RequestInit = {}) {
    const cookieHeader = (await cookies()).toString();
    const headers = { ...(init.headers as any), cookie: cookieHeader };
    return fetch(input, { ...init, headers });
}
