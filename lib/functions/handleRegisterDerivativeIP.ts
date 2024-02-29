'use server';

import { getArtcastImage } from "../actions/getArtcastImage";
import { uploadJSONToIPFS } from "../pinata/functions/uploadJSONToIPFS";
import { mintLicense } from "../story-beta/functions/mintLicense";
import { mintNFT } from "../story-beta/functions/mintNFT";
import { supabaseClient } from "../supabase/supabaseClient";

// Your component or event handler
export async function handleRegisterDerivativeIP(castName: string, prompt: string, imagePath: string, castId: number, walletAddress: string, originIpId: string) {
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
};
