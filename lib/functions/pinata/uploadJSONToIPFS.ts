"use server";

const pinataSDK = require("@pinata/sdk");

export async function uploadJSONToIPFS(
  name: string,
  prompt: string,
  imageIpfsHash: string
) {
  const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

  const json = {
    name,
    description: "Prompt: " + prompt,
    image: imageIpfsHash,
  };

  const res = await pinata.pinJSONToIPFS(json);
  return `ipfs://${res.IpfsHash}`;
}
