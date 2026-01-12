import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const quality = searchParams.get('quality') || 'highest';
    const type = searchParams.get('type') || 'video';

    if (!url || !ytdl.validateURL(url)) {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    try {
        const agent = ytdl.createAgent(undefined, {
            localAddress: undefined,
        });

        const info = await ytdl.getInfo(url, {
            agent,
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                }
            }
        });
        const title = info.videoDetails.title.replace(/[^a-z0-9]/gi, '_');

        // Choose format
        const format = ytdl.chooseFormat(info.formats, {
            quality: type === 'audio' ? 'highestaudio' : quality,
            filter: type === 'audio' ? 'audioonly' : 'audioandvideo',
        });

        if (!format || !format.url) {
            throw new Error('No suitable format found');
        }

        // Return the direct download URL
        return NextResponse.json({
            title: info.videoDetails.title,
            downloadUrl: format.url,
            filesize: format.contentLength,
            ext: type === 'audio' ? 'mp3' : 'mp4'
        });

    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json({
            error: error.message || 'Download failed',
            details: error.toString()
        }, { status: 500 });
    }
}
