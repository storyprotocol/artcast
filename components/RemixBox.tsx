"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Cast } from "@/lib/types/cast.interface";
import { storeCast } from "@/lib/functions/supabase/storeCast";
import { handleGenerateImage } from "@/lib/functions/api/handleGenerateImage";
import { useRouter } from "next/navigation";
import { useWalletClient } from "wagmi";
import { Address, WalletClient } from "viem";
import { uploadJSONToIPFS } from "@/lib/functions/pinata/uploadJSONToIPFS";
import { mintNFT } from "@/lib/functions/story-beta/mintNFT";
import { updateCastWithNftId } from "@/lib/functions/supabase/updateCastWithNftId";
import { useIpAsset } from "react-sdk57";
import { handleModifyImage } from "@/lib/functions/api/handleModifyImage";

export function RemixBox({ cast }: { cast: Cast }) {
  const router = useRouter();
  const [createdStatus, setCreatedStatus] = useState("not started");
  const [message, setMessage] = useState("");
  const { data: wallet } = useWalletClient();
  const { registerDerivativeIp } = useIpAsset();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatedStatus("pending");
    setMessage("Storing your Artcast information...");
    const formData = new FormData(event.currentTarget);
    let prompt = formData.get("prompt") as string;
    let createdArtcastId = (await storeCast(
      cast.name,
      null,
      cast.id,
      cast.branch_num + 1,
      prompt,
      wallet?.account.address as Address,
      true
    )) as number;
    setMessage("Modifying the image...");
    const imageIpfsHash = await handleModifyImage(
      (cast.image_path as string).replace("ipfs://", ""),
      prompt,
      createdArtcastId
    );
    setMessage("Minting your image as an NFT...");
    const ipfsUri = await uploadJSONToIPFS(cast.name, prompt, imageIpfsHash);
    const mintedNFTTokenId = await mintNFT(wallet as WalletClient, ipfsUri);
    setMessage("Registering your Artcast on Story Protocol...");
    const registeredIpAsset = await registerDerivativeIp({
      nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address,
      tokenId: mintedNFTTokenId,
      derivData: {
        parentIpIds: [cast.ip_id as Address],
        licenseTermsIds: ["2"],
      },
      txOptions: { waitForTransaction: true },
    });
    console.log(
      `Completed at transaction hash ${registeredIpAsset.txHash}, IPA ID: ${registeredIpAsset.ipId}`
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
    <form
      onSubmit={submit}
      className="rounded-xl border bg-card text-card-foreground shadow p-10"
    >
      <div className="flex flex-col space-y-1.5 mb-5">
        <h3 className="font-semibold leading-none tracking-tight">
          Create Remix
        </h3>
        <p className="text-sm text-muted-foreground">
          Continue this Artcast&apos;s storyline by creating a remix.
        </p>
      </div>
      <div className="space-y-2 mb-5">
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
          Your additional prompt.
        </p>
      </div>
      {!wallet ? (
        <div>
          <Button disabled>Create</Button>
          <p className="text-[0.8rem] text-muted-foreground text-yellow-400">
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
            Creating...
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
