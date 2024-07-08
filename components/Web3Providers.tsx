"use client";
import { http, createConfig, WagmiProvider, useWalletClient } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "wagmi/chains";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { PropsWithChildren } from "react";
import { StoryProvider } from "react-sdk57";

const config = createConfig({
  chains: [sepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [sepolia.id]: http(),
  },
});
const queryClient = new QueryClient();
const evmNetworks = [
  {
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    chainId: 11155111,
    iconUrls: ["https://app.dynamic.xyz/assets/networks/sepolia.svg"],
    name: "Sepolia",
    nativeCurrency: {
      decimals: 18,
      name: "Sepolia Ether",
      symbol: "ETH",
    },
    networkId: 11155111,
    rpcUrls: [process.env.NEXT_PUBLIC_RPC_PROVIDER_URL as string],
    vanityName: "Sepolia",
  },
];

export default function Web3Providers({ children }: PropsWithChildren) {
  return (
    <DynamicContextProvider
      settings={{
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        appName: "Artcast",
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID as string,
        walletConnectors: [EthereumWalletConnectors],
        overrides: { evmNetworks },
        networkValidationMode: "always",
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <StoryProviderWrapper>{children}</StoryProviderWrapper>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}

// we use this component to pass in our
// wallet from wagmi
function StoryProviderWrapper({ children }: PropsWithChildren) {
  const { data: wallet } = useWalletClient();

  // react sdk will throw an error if wallet is
  // undefined, meaning user has not logged in yet
  // using the DynamicWidget login
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
