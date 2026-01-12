// Simple in-memory cache to store video info temporarily
// This helps avoid double-fetching (once for metadata, once for download)
// which often triggers YouTube's anti-bot throttling.

const videoCache = new Map();

export const cacheVideoInfo = (url, info) => {
    // Clear old entries if cache gets too big to prevent memory leaks
    if (videoCache.size > 100) {
        const firstKey = videoCache.keys().next().value;
        videoCache.delete(firstKey);
    }
    videoCache.set(url, {
        info,
        timestamp: Date.now()
    });
};

export const getCachedVideoInfo = (url) => {
    const cached = videoCache.get(url);
    if (!cached) return null;

    // Expire after 1 hour
    if (Date.now() - cached.timestamp > 3600 * 1000) {
        videoCache.delete(url);
        return null;
    }

    return cached.info;
};
