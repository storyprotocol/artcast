import { getArtcastImage } from '@/lib/actions/getArtcastImage';
import { uploadJSONToIPFS } from '@/lib/pinata/functions/uploadJSONToIPFS';
import { mintLicense } from '@/lib/story-beta/functions/mintLicense';
import { mintNFT } from '@/lib/story-beta/functions/mintNFT';
import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 120; // This function can run for a maximum of 5 seconds

export async function POST(request: NextRequest) {
    // prompts is in order from old -> new
    const { castId, castName, imagePath, walletAddress, prompt, originIpId } = await request.json();

    try {
        const imageURL = await getArtcastImage(imagePath);
        // store on ipfs
        const ipfsUri = await uploadJSONToIPFS(castName, prompt, imageURL);
        // create nft
        const mintedNFTTokenId = await mintNFT(walletAddress, ipfsUri);
        // register on story protocol beta
        const licenseId = await mintLicense('1', originIpId, walletAddress);
        // save it to supabase
        const { data, error } = await supabaseClient.from('cast_datas').update({
            license_id: licenseId,
            nft_token_id: mintedNFTTokenId
        }).eq('id', castId)
        console.log(error)

        // Send a success response
        return new NextResponse(JSON.stringify({ message: 'Registering derivative ip successful' }), {
            status: 200
        })
    } catch (error) {
        console.error('Error registering derivative ip:', error);

        // Send a success response
        return new NextResponse(JSON.stringify({ error: 'Registering derivative ip successful' }), {
            status: 400
        })
    }
}
