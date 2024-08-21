"use client";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage, http, useWalletClient } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import React, { PropsWithChildren, ReactNode } from "react";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider } from "wagmi";
import { StoryProvider } from "@story-protocol/react-sdk";

// Get projectId from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Artcast",
  description: "Create and remix each others AI-generated images.",
  url: "https://artcast.ai", // origin must match your domain & subdomain
  icons: ["https://artcast.ai/logo.png"],
};

// Create wagmiConfig
const chains = [mainnet, sepolia] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

// Setup queryClient
const queryClient = new QueryClient();

// Create modal
createWeb3Modal({
  metadata,
  //@ts-ignore
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export default function Web3Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <StoryProviderWrapper>{children}</StoryProviderWrapper>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// we use this component to pass in our
// wallet from wagmi
function StoryProviderWrapper({ children }: PropsWithChildren) {
  const { data: wallet } = useWalletClient();

  // react sdk will throw an error if wallet is
  // undefined, meaning user has not logged in yet
  // using the WalletConnect login
  if (!wallet) {
    return <>{children}</>;
  }

  return (
    <StoryProvider
      config={{
        chainId: "sepolia",
        transport: http(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL),
        wallet: wallet,
      }}
    >
      {children}
    </StoryProvider>
  );
}
