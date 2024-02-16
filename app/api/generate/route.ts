import { generateImage } from '@/lib/actions/generateImage';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // Send a success response
    return new NextResponse(JSON.stringify({ message: 'Image generation successful' }), {
        status: 200
    })
}


export async function POST(request: NextRequest) {
    const { castName, prompts, createdArtcastId, farcasterName } = await request.json();

    try {
        // Call your generateImage function
        await generateImage(castName, prompts, createdArtcastId, farcasterName);

        // Send a success response
        return new NextResponse(JSON.stringify({ message: 'Image generation successful' }), {
            status: 200
        })
    } catch (error) {
        console.error('Error generating image:', error);

        // Send a success response
        return new NextResponse(JSON.stringify({ error: 'Image generation successful' }), {
            status: 400
        })
    }
}
