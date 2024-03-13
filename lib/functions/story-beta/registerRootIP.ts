'use server';

import { Address } from "viem";
import { client } from "../../client/story-beta/client";

export async function registerRootIP(tokenId: string, policyId: string): Promise<string> {
    const registeredIpAsset = await client.ipAsset.registerRootIp({
        tokenContractAddress: process.env.NFT_CONTRACT_ADDRESS as Address,
        tokenId,
        policyId,
        txOptions: { waitForTransaction: true }
    })
    console.log(`Root IPA created at transaction hash ${registeredIpAsset.txHash}, IPA ID: ${registeredIpAsset.ipId}`)
    return registeredIpAsset.ipId!;
}