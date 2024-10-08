"use server";

const pinataSDK = require("@pinata/sdk");

export async function uploadJSONToIPFS(json: any) {
  const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });
  const res = await pinata.pinJSONToIPFS(json);
  return res.IpfsHash;
}
