"use server";

import { Address } from "viem";
import { useIpAsset } from "react-sdk57";

export async function registerRootIP(tokenId: string): Promise<string> {
  const { register } = useIpAsset();
  const registeredIpAsset = await register({
    nftContract: process.env.NFT_CONTRACT_ADDRESS as Address,
    tokenId,
    txOptions: { waitForTransaction: true },
  });
  console.log(
    `Root IPA created at transaction hash ${registeredIpAsset.txHash}, IPA ID: ${registeredIpAsset.ipId}`
  );
  return registeredIpAsset.ipId!;
}
