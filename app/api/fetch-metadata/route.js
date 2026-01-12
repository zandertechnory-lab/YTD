import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Fetch video metadata using ytdl-core
        const info = await ytdl.getInfo(url);

        // Extract relevant metadata
        const metadata = {
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
            duration: formatDuration(parseInt(info.videoDetails.lengthSeconds)),
            author: info.videoDetails.author.name,
            formats: info.formats.length,
        };

        return NextResponse.json(metadata);
    } catch (error) {
        console.error('Metadata fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch video metadata', details: error.message },
            { status: 500 }
        );
    }
}

function formatDuration(seconds) {
    if (!seconds) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
