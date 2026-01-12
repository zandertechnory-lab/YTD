import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import axios from 'axios';

import { getCachedVideoInfo } from '@/app/lib/cache';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const quality = searchParams.get('quality') || 'highest';
    const type = searchParams.get('type') || 'video'; // video or audio

    if (!url || !ytdl.validateURL(url)) {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    try {
        // 1. Try to get info from cache first to avoid double-request throttling
        let info = getCachedVideoInfo(url);

        if (!info) {
            console.log('Cache miss for', url);
            // Fallback to fresh fetch if direct link or cache expired
            info = await ytdl.getInfo(url, {
                requestOptions: {
                    timeout: 60000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    }
                }
            });
        }

        const title = info.videoDetails.title.replace(/[^a-z0-9]/gi, '_');

        // 2. Choose Format Manually
        const format = ytdl.chooseFormat(info.formats, {
            quality: type === 'audio' ? 'highestaudio' : 'highest',
            filter: type === 'audio' ? 'audioonly' : 'audioandvideo',
        });

        if (!format || !format.url) {
            throw new Error('No suitable format found');
        }

        // 3. Stream the chosen format using ytdl with proper headers and timeout
        const videoStream = ytdl.downloadFromInfo(info, {
            format,
            requestOptions: {
                timeout: 120000, // 2 minutes
                highWaterMark: 1 << 25, // 32MB buffer
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': `https://www.youtube.com/watch?v=${info.videoDetails.videoId}`,
                },
            },
        });

        // 4. Create a Web Stream from the Node stream
        const stream = new ReadableStream({
            start(controller) {
                videoStream.on('data', (chunk) => controller.enqueue(chunk));
                videoStream.on('end', () => controller.close());
                videoStream.on('error', (err) => controller.error(err));
            },
        });

        const headers = new Headers();
        headers.set('Content-Disposition', `attachment; filename="${title}.${type === 'audio' ? 'mp3' : 'mp4'}"`);
        // 5. Set appropriate response headers based on the format
        if (format.mimeType) {
            headers.set('Content-Type', format.mimeType.split(';')[0]);
        }
        if (format.contentLength) {
            headers.set('Content-Length', format.contentLength);
        }

        return new NextResponse(stream, { headers });

    } catch (error) {
        console.error('Download error helper:', error);
        return NextResponse.json({
            error: error.message || 'Download failed',
            details: error.toString()
        }, { status: 500 });
    }
}
