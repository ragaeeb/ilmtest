const requests = new Map<string, { count: number; timestamp: number }>();

export function rateLimit(key: string, limit = 100, windowMs = 60_000): boolean {
    const now = Date.now();
    const entry = requests.get(key) || { count: 0, timestamp: now };
    if (now - entry.timestamp > windowMs) {
        entry.count = 0;
        entry.timestamp = now;
    }
    entry.count++;
    requests.set(key, entry);
    return entry.count <= limit;
}
