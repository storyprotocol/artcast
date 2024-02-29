'use server';
import { http, Address, createWalletClient, createPublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { contractAbi } from './contract-abi';

export async function mintNFT(walletAddress: string, uri: string): Promise<string> {
    console.log('Minting a new NFT...')
    const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as Address)
    const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(),
    })
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http()
    })

    // 3. Mint an NFT to your account
    const { request, result } = await publicClient.simulateContract({
        address: process.env.NFT_CONTRACT_ADDRESS as Address,
        functionName: 'mint',
        args: [walletAddress, uri],
        abi: contractAbi
    })
    const hash = await walletClient.writeContract(request);

    let tokenId = result!.toString();

    console.log(`Minted NFT successful with hash: ${hash}`);
    console.log(`Minted NFT tokenId: ${tokenId}`);

    await publicClient.waitForTransactionReceipt({ hash });

    return tokenId;
}