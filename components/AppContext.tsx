import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { custom, useWalletClient } from "wagmi";

// Update the context type to expect an object with a client property
interface AppContextType {
  client: StoryClient | null;
}

// Create a context with the updated type
const AppContext = createContext<AppContextType | null>(null);

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};

export default function AppProvider({ children }: PropsWithChildren) {
  const { data: wallet } = useWalletClient();
  const [client, setClient] = useState<StoryClient | null>(null);

  // Define the function you want to expose
  const setupStoryClient: () => StoryClient = () => {
    const config: StoryConfig = {
      account: wallet!.account,
      transport: custom(wallet!.transport),
      chainId: "iliad",
    };
    const client = StoryClient.newClient(config);
    return client;
  };

  useEffect(() => {
    if (!client && wallet?.account.address) {
      let newClient = setupStoryClient();
      setClient(newClient);
    }
  }, [wallet]);

  return (
    <AppContext.Provider value={{ client }}>{children}</AppContext.Provider>
  );
}
