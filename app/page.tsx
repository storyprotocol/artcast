"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { handleGenerateImage } from "@/lib/functions/api/handleGenerateImage";
import { storeCast } from "@/lib/functions/supabase/storeCast";
import { useRouter } from "next/navigation";
import { useWalletClient } from "wagmi";
import { uploadJSONToIPFS } from "@/lib/functions/pinata/uploadJSONToIPFS";
import { mintNFT } from "@/lib/functions/story-beta/mintNFT";
import { useIpAsset } from "react-sdk57";
import { Address, WalletClient } from "viem";
import { updateCastWithNftId } from "@/lib/functions/supabase/updateCastWithNftId";

export default function HomepageForm() {
  const router = useRouter();
  const [createdStatus, setCreatedStatus] = useState("not started");
  const [message, setMessage] = useState("");
  const { data: wallet } = useWalletClient();
  const { register } = useIpAsset();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatedStatus("pending");
    setMessage("Storing your Artcast information...");
    const formData = new FormData(event.currentTarget);
    let name = formData.get("name") as string;
    let prompt = formData.get("prompt") as string;
    let createdArtcastId = (await storeCast(
      name,
      null,
      null,
      0,
      prompt,
      wallet?.account.address as Address
    )) as number;
    setMessage("Generating your image...");
    const imageIpfsHash = await handleGenerateImage([prompt], createdArtcastId);
    setMessage("Minting your image as an NFT...");
    const ipfsUri = await uploadJSONToIPFS(name, prompt, imageIpfsHash);
    const mintedNFTTokenId = await mintNFT(wallet as WalletClient, ipfsUri);
    setMessage("Registering your Artcast on Story Protocol...");
    const registeredIpAsset = await register({
      nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address,
      tokenId: mintedNFTTokenId,
      txOptions: { waitForTransaction: true },
    });
    console.log(
      `Root IPA created at transaction hash ${registeredIpAsset.txHash}, IPA ID: ${registeredIpAsset.ipId}`
    );
    await updateCastWithNftId(
      registeredIpAsset.ipId as Address,
      mintedNFTTokenId,
      createdArtcastId
    );
    setCreatedStatus("finished");
    router.push(`/cast/${createdArtcastId}`);
  }

  return (
    <form onSubmit={submit} className="space-y-6 p-10 pb-16 max-w-lg mx-auto">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Create Artcast</h2>
        <p className="text-muted-foreground">
          Create your own collaborative AI-generated story, registered on Story
          Protocol.
        </p>
      </div>
      <div
        data-orientation="horizontal"
        role="none"
        className="shrink-0 bg-border h-[1px] w-full my-6"
      ></div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" placeholder="Shiba" />
        <p
          id=":r4:-form-item-description"
          className="text-[0.8rem] text-muted-foreground"
        >
          The name of your Artcast.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Input
          id="prompt"
          name="prompt"
          type="text"
          placeholder="A shiba dog..."
        />
        <p
          id=":r4:-form-item-description"
          className="text-[0.8rem] text-muted-foreground"
        >
          Your prompt.
        </p>
      </div>

      {!wallet ? (
        <div>
          <Button disabled>Create</Button>
          <p className="text-[0.8rem] text-muted-foreground text-yellow-100">
            Please log in to create an Artcast.
          </p>
        </div>
      ) : createdStatus === "finished" ? (
        <div className="flex gap-2 items-center">
          <Button disabled>
            <CheckIcon className="mr-2 h-4 w-4" />
            Created
          </Button>
          <p className="text-[0.8rem] text-muted-foreground">
            Redirecting now...
          </p>
        </div>
      ) : createdStatus === "pending" ? (
        <div>
          <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Creating
          </Button>
          <p className="text-[0.8rem] text-muted-foreground">{message}</p>
          <p className="text-[0.8rem] text-muted-foreground">
            This may take up to a minute.
          </p>
        </div>
      ) : (
        <Button type="submit">Create</Button>
      )}
    </form>
  );
}
