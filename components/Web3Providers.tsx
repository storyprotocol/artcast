"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http, useWalletClient, WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StoryProvider } from "@story-protocol/react-sdk";
import { PropsWithChildren } from "react";

const config = getDefaultConfig({
  appName: "Artcast",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function Web3Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <StoryProviderWrapper>{children}</StoryProviderWrapper>
        </RainbowKitProvider>
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
