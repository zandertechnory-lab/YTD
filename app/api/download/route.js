import { NextResponse } from 'next/server';
import ytdlp from 'yt-dlp-exec';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const quality = searchParams.get('quality') || 'highest';
    const type = searchParams.get('type') || 'video'; // video or audio

    if (!url) {
        return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    try {
        // Get video info using yt-dlp
        const info = await ytdlp(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ]
        });

        let selectedFormat;

        if (type === 'audio') {
            // Get best audio format
            selectedFormat = info.formats
                .filter(f => f.acodec !== 'none' && f.vcodec === 'none')
                .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];
        } else {
            // Get video format based on quality
            const targetHeight = quality === 'highest' ? 9999 : parseInt(quality);
            selectedFormat = info.formats
                .filter(f => f.ext === 'mp4' && f.vcodec !== 'none' && f.height)
                .filter(f => f.height <= targetHeight)
                .sort((a, b) => b.height - a.height)[0];
        }

        if (!selectedFormat || !selectedFormat.url) {
            throw new Error('No suitable format found');
        }

        // Return the direct download URL
        return NextResponse.json({
            title: info.title,
            downloadUrl: selectedFormat.url,
            filesize: selectedFormat.filesize,
            ext: type === 'audio' ? 'mp3' : 'mp4'
        });

    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to fetch video',
            details: error.toString()
        }, { status: 500 });
    }
}
