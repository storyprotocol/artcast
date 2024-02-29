'use server';
const pinataSDK = require('@pinata/sdk');

export async function uploadJSONToIPFS(name: string, prompt: string, imageURL: string) {
    const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

    const json = {
        name,
        description: 'Prompt: ' + prompt,
        image: imageURL
    }

    const res = await pinata.pinJSONToIPFS(json);
    console.log({ res })
    return `ipfs://${res.IpfsHash}`;
}