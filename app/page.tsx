"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { handleGenerateImage } from "@/lib/functions/api/handleGenerateImage";
import { storeCast } from "@/lib/functions/supabase/storeCast";
import { useRouter } from "next/navigation";
import { uploadJSONToIPFS } from "@/lib/functions/pinata/uploadJSONToIPFS";
import { Address, WalletClient } from "viem";
import { updateCastWithNftId } from "@/lib/functions/supabase/updateCastWithNftId";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HomepageList from "@/components/HomepageList";
import { useApp } from "@/components/AppContext";
import { useWalletClient } from "wagmi";
import { PIL_TYPE } from "@story-protocol/core-sdk";
import { generateIpMetadata } from "@/lib/functions/generateIpMetadata";

export default function HomepageForm() {
  const router = useRouter();
  const [createdStatus, setCreatedStatus] = useState("not started");
  const [message, setMessage] = useState("");
  const { client } = useApp();
  const { data: wallet } = useWalletClient();

  async function createWithAi(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) {
      return;
    }

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
      wallet?.account.address as Address,
      true
    )) as number;
    setMessage("Generating your image...");
    const imageIpfsHash = await handleGenerateImage(prompt, createdArtcastId);
    const ipMetadata = await generateIpMetadata(
      client,
      imageIpfsHash,
      name,
      prompt
    );

    setMessage("Registering your Artcast on Story Protocol...");
    const registeredIpAsset =
      await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address,
        pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
        ipMetadata,
        txOptions: { waitForTransaction: true },
      });
    console.log(
      `Root IPA created at transaction hash ${registeredIpAsset.txHash}, IPA ID: ${registeredIpAsset.ipId}`
    );
    await updateCastWithNftId(
      registeredIpAsset.ipId as Address,
      registeredIpAsset.tokenId!.toString(),
      createdArtcastId
    );
    setCreatedStatus("finished");
    router.push(`/cast/${createdArtcastId}`);
  }

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) {
      return;
    }

    setCreatedStatus("pending");
    setMessage("Storing your Artcast information...");
    const formData = new FormData(event.currentTarget);
    let name = formData.get("name") as string;
    let prompt = formData.get("prompt") as string;
    const response = await fetch("/api/upload-to-ipfs", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    const imageIpfsHash = data.ipfsHash;
    let createdArtcastId = (await storeCast(
      name,
      imageIpfsHash,
      null,
      0,
      prompt,
      wallet?.account.address as Address,
      false
    )) as number;
    const ipMetadata = await generateIpMetadata(
      client,
      imageIpfsHash,
      name,
      prompt
    );
    setMessage("Registering your Artcast on Story Protocol...");
    const registeredIpAsset =
      await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address,
        pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
        ipMetadata,
        txOptions: { waitForTransaction: true },
      });
    console.log(
      `Root IPA created at transaction hash ${registeredIpAsset.txHash}, IPA ID: ${registeredIpAsset.ipId}`
    );
    await updateCastWithNftId(
      registeredIpAsset.ipId as Address,
      registeredIpAsset.tokenId!.toString(),
      createdArtcastId
    );
    setCreatedStatus("finished");
    router.push(`/cast/${createdArtcastId}`);
  }

  return (
    <div className="flex flex-col justify-center items-center gap-[100px]">
      <Tabs defaultValue="ai" className="w-[300px] md:w-[400px] mt-[50px]">
        <TabsList>
          <TabsTrigger value="ai">Using AI</TabsTrigger>
          <TabsTrigger value="no-ai">Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>Using AI</CardTitle>
              <CardDescription>
                Create your own Artcast using AI.
              </CardDescription>
            </CardHeader>
            <form onSubmit={createWithAi}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Shiba"
                    required
                  />
                  <p
                    id=":r4:-form-item-description"
                    className="text-[0.8rem] text-muted-foreground"
                  >
                    The name of your Artcast.
                  </p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Prompt</Label>
                  <Input
                    id="prompt"
                    name="prompt"
                    type="text"
                    placeholder="A shiba dog..."
                    required
                  />
                  <p
                    id=":r4:-form-item-description"
                    className="text-[0.8rem] text-muted-foreground"
                  >
                    Your prompt.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
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
                      Creating
                    </Button>
                    <p className="text-[0.8rem] text-muted-foreground">
                      {message}
                    </p>
                    <p className="text-[0.8rem] text-muted-foreground">
                      This may take up to a minute.
                    </p>
                  </div>
                ) : (
                  <Button type="submit">Create</Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="no-ai">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Create an Artcast by uploading your own image.
              </CardDescription>
            </CardHeader>
            <form onSubmit={create}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Shiba"
                    required
                  />
                  <p
                    id=":r4:-form-item-description"
                    className="text-[0.8rem] text-muted-foreground"
                  >
                    The name of your Artcast.
                  </p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Description</Label>
                  <Input
                    id="prompt"
                    name="prompt"
                    type="text"
                    placeholder="A shiba dog..."
                    required
                  />
                  <p
                    id=":r4:-form-item-description"
                    className="text-[0.8rem] text-muted-foreground"
                  >
                    Your description.
                  </p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="image">Image</Label>
                  <Input id="image" name="image" type="file" required />
                  <p
                    id=":r4:-form-item-description"
                    className="text-[0.8rem] text-muted-foreground"
                  >
                    Upload your image.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
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
                      Creating
                    </Button>
                    <p className="text-[0.8rem] text-muted-foreground">
                      {message}
                    </p>
                    <p className="text-[0.8rem] text-muted-foreground">
                      This may take up to a minute.
                    </p>
                  </div>
                ) : (
                  <Button type="submit">Create</Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
      <HomepageList />
    </div>
  );
}
