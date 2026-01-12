import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import { cacheVideoInfo } from '@/app/lib/cache';
import { formatDuration } from '@/lib/youtube';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!ytdl.validateURL(url)) {
            return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
        }

        // Remove custom agent with empty cookies as it might trigger anti-bot
        // const agent = ytdl.createAgent([
        //     {
        //         name: "cookie",
        //         value: "", // Cookies key can be added here if needed for age-gated content
        //     },
        // ]);

        const info = await ytdl.getInfo(url, {
            requestOptions: {
                headers: {
                    // Use a slightly different common User-Agent
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                }
            }
        });

        // Cache the info to reuse in download
        cacheVideoInfo(url, info);

        const videoDetails = info.videoDetails;

        // Extract available formats
        const formats = info.formats || [];
        const qualities = new Set();
        formats.forEach(f => {
            if (f.qualityLabel) qualities.add(f.qualityLabel);
        });

        const metadata = {
            title: videoDetails.title,
            thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url, // Highest res
            duration: formatDuration(videoDetails.lengthSeconds),
            author: videoDetails.author.name,
            url: videoDetails.video_url,
            qualities: Array.from(qualities).sort((a, b) => {
                // Sort resolution simply
                return parseInt(b) - parseInt(a);
            }),
        };

        return NextResponse.json(metadata);
    } catch (error) {
        console.error('Metadata fetch error:', error); // Log the full error
        // Return the actual error message if useful
        return NextResponse.json({ error: error.message || 'Failed to fetch video details' }, { status: 500 });
    }
}
