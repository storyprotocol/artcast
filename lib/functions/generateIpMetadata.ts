import { IpMetadata, StoryClient } from "@story-protocol/core-sdk";
import { uploadJSONToIPFS } from "./pinata/uploadJSONToIPFS";
import CryptoJS from "crypto-js";

export async function generateIpMetadata(
  client: StoryClient,
  imageIpfsHash: string,
  name: string,
  prompt: string
) {
  const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
    title: "My IP Asset",
    description: "This is a test IP asset",
    attributes: [
      {
        key: "Rarity",
        value: "Legendary",
      },
    ],
  });

  const nftMetadata = {
    name,
    description: "Prompt: " + prompt,
    image: `https://ipfs.io/ipfs/${imageIpfsHash}`,
  };

  const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
  const ipHash = CryptoJS.SHA256(JSON.stringify(ipMetadata)).toString();
  const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
  const nftHash = CryptoJS.SHA256(JSON.stringify(nftMetadata)).toString();

  return {
    ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
    ipMetadataHash: `0x${ipHash}` as `0x${string}`,
    nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
    nftMetadataHash: `0x${nftHash}` as `0x${string}`,
  };
}
