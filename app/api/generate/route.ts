import { generateImage } from '@/lib/functions/stability/generateImage';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30; // This function can run for a maximum of 5 seconds

export async function POST(request: NextRequest) {
    // prompts is in order from old -> new
    const { castName, prompts, createdArtcastId } = await request.json();

    try {
        // generate the image
        await generateImage(castName, prompts, createdArtcastId);

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
