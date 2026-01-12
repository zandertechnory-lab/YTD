import { NextResponse } from 'next/server';
import { validateYouTubeUrl } from '@/lib/youtube';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ isValid: false, error: 'URL is required' }, { status: 400 });
        }

        const isValid = validateYouTubeUrl(url);

        return NextResponse.json({ isValid });
    } catch (error) {
        return NextResponse.json({ isValid: false, error: 'Internal server error' }, { status: 500 });
    }
}
