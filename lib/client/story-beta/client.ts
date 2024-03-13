//@ts-nocheck
import { http } from "viem"
import { Address, privateKeyToAccount } from "viem/accounts"
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'

const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as Address)
const config: StoryConfig = {
    account,
    transport: http(process.env.RPC_PROVIDER_URL),
}
export const client = StoryClient.newClient(config)