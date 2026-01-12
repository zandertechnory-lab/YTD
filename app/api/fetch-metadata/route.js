import { NextResponse } from 'next/server';
import YTDlpWrap from 'yt-dlp-wrap';

const ytDlp = new YTDlpWrap();

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Fetch video metadata using yt-dlp
        const output = await ytDlp.execPromise([
            url,
            '--dump-single-json',
            '--no-check-certificates',
            '--no-warnings',
            '--skip-download'
        ]);

        const info = JSON.parse(output);

        // Extract relevant metadata
        const metadata = {
            title: info.title,
            thumbnail: info.thumbnail,
            duration: formatDuration(info.duration),
            author: info.uploader || info.channel,
            formats: info.formats?.length || 0,
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
