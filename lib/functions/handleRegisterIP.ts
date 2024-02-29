'use server';

import { getArtcastImage } from "../actions/getArtcastImage";
import { uploadJSONToIPFS } from "../pinata/functions/uploadJSONToIPFS";
import { mintNFT } from "../story-beta/functions/mintNFT";
import { registerRootIP } from "../story-beta/functions/registerRootIP";
import { supabaseClient } from "../supabase/supabaseClient";

export const maxDuration = 30;

// Your component or event handler
export async function handleRegisterIP(castName: string, prompt: string, imagePath: string, castId: number, walletAddress: string) {
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
};
