'use server';

import { Address } from "viem";
import { client } from "../../client/story-beta/client";

export async function registerDerivativeIP(tokenId: string, licenseId: string): Promise<string> {
    const registeredIpAsset = await client.ipAsset.registerDerivativeIp({
        tokenContractAddress: process.env.NFT_CONTRACT_ADDRESS as Address,
        tokenId,
        licenseIds: [licenseId!],
        txOptions: { waitForTransaction: true }
    })
    console.log(`Remixed IPA created at transaction hash ${registeredIpAsset.txHash}, IPA ID: ${registeredIpAsset.ipId}`)
    return registeredIpAsset.ipId!;
}