//@ts-nocheck
import { http, Address, createPublicClient, WalletClient } from "viem";
import { sepolia } from "viem/chains";
import { contractAbi } from "../../utils/contractAbi";

export async function mintNFT(
  wallet: WalletClient,
  uri: string
): Promise<string> {
  console.log("Minting a new NFT...");
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL),
  });

  // 3. Mint an NFT to your account
  const { request } = await publicClient.simulateContract({
    address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address,
    functionName: "mint",
    args: [wallet.account?.address, uri],
    abi: contractAbi,
  });
  const hash = await wallet.writeContract(request);
  console.log(`Minted NFT successful with hash: ${hash}`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const tokenId = Number(receipt.logs[0].topics[3]).toString();
  console.log(`Minted NFT tokenId: ${tokenId}`);

  return tokenId;
}
