'use server';

import { client } from "../../client/story-beta/client";

export async function mintLicense(
    policyId: string,
    originIpId: string,
    receiverAddress: string
): Promise<string> {
    console.log('Minting license...')
    const mintLicenseResponse = await client.license.mintLicense({
        policyId,
        licensorIpId: originIpId as `0x${string}`,
        receiverAddress: receiverAddress as `0x${string}`,
        mintAmount: 1,
        txOptions: { waitForTransaction: true }
    });

    console.log(`License minted at transaction hash ${mintLicenseResponse.txHash}, License ID: ${mintLicenseResponse.licenseId}`)
    return mintLicenseResponse.licenseId!;
}