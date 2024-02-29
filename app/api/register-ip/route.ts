import { getArtcastImage } from '@/lib/actions/getArtcastImage';
import { uploadJSONToIPFS } from '@/lib/pinata/functions/uploadJSONToIPFS';
import { mintNFT } from '@/lib/story-beta/functions/mintNFT';
import { registerRootIP } from '@/lib/story-beta/functions/registerRootIP';
import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60; // This function can run for a maximum of 5 seconds

export async function POST(request: NextRequest) {
    // prompts is in order from old -> new
    const { castId, castName, imagePath, walletAddress, prompt } = await request.json();

    try {
        const imageURL = await getArtcastImage(imagePath);
        // store on ipfs
        const ipfsUri = await uploadJSONToIPFS(castName, prompt, imageURL);
        // create nft
        const mintedNFTTokenId = await mintNFT(walletAddress, ipfsUri);
        // register on story protocol beta
        const registerIpId = await registerRootIP(mintedNFTTokenId, '1');
        // save it to supabase
        const { data, error } = await supabaseClient.from('cast_datas').update({
            ip_id: registerIpId,
            nft_token_id: mintedNFTTokenId
        }).eq('id', castId)
        console.log(error)

        // Send a success response
        return new NextResponse(JSON.stringify({ message: 'Registering root ip successful' }), {
            status: 200
        })
    } catch (error) {
        console.error('Error registering root ip:', error);

        // Send a success response
        return new NextResponse(JSON.stringify({ error: 'Registering root ip successful' }), {
            status: 400
        })
    }
}
