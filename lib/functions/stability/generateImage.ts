"use server";
import fetch from "node-fetch";
import FormData from "form-data";
import sharp from "sharp";
import { uploadImage } from "../supabase/uploadImage";
import { updateImagePathOnCast } from "../supabase/updateImagePathOnCast";
import { getSupabaseImagePath } from "../../utils/getSupabaseImagePath";
import { uploadFileToIpfs } from "../pinata/uploadFileToIPFS";
import axios from "axios";

async function blobToBuffer(blob: any) {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function base64ToBlob(base64: any, mimeType: any) {
  // Decode Base64 string
  const byteCharacters = atob(base64);

  // Create an array of byte values
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // Convert to a binary representation
  const byteArray = new Uint8Array(byteNumbers);

  // Create and return a Blob with the binary data and MIME type
  return new Blob([byteArray], { type: mimeType });
}

async function textToImage(prompt: string) {
  const payload = {
    prompt,
    output_format: "png",
  };

  const response = await axios.postForm(
    `https://api.stability.ai/v2beta/stable-image/generate/core`,
    axios.toFormData(payload, new FormData()),
    {
      headers: {
        // "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      },
      method: "POST",
    }
  );

  if (response.status !== 200) {
    throw new Error(`${response.status}: ${await response.data.toString()}`);
  }

  const result = await response.data;
  console.log(result);
  return result;
}

async function imageToImage(cid: string, prompt: string) {
  const imageResponse = await fetch(`https://ipfs.io/ipfs/${cid}`);
  const buffer = await blobToBuffer(imageResponse);
  console.log({ buffer });

  const payload = {
    image: buffer,
    prompt,
    strength: 0.8,
    output_format: "png",
    mode: "image-to-image",
  };

  const response = await axios.postForm(
    `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
    axios.toFormData(payload, new FormData()),
    {
      headers: {
        // "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      },
      method: "POST",
    }
  );

  if (response.status !== 200) {
    throw new Error(`${response.status}: ${await response.data.toString()}`);
  }

  const result = await response.data;
  console.log({ result });
  return result;
}

export async function generateImage(prompt: string, createdArtcastId: number) {
  const result = await textToImage(prompt);
  //@ts-ignore
  let imageBlob = base64ToBlob(result.image, "image/jpeg");
  // const imageBuffer = await blobToBuffer(imageBlob);
  // const consenscedImageBuffer = await sharp(imageBuffer)
  //   .jpeg({ quality: 10 }) // Adjust the quality value as needed (between 0 and 100)
  //   .toBuffer();
  // imageBlob = new Blob([consenscedImageBuffer], { type: "image/jpeg" });
  const imageIPFSHash = await uploadFileToIpfs(imageBlob);
  await updateImagePathOnCast(imageIPFSHash, createdArtcastId);
  return imageIPFSHash;
}

export async function modifyImage(
  cid: string,
  prompt: string,
  createdArtcastId: number
) {
  console.log("Calling image...");
  const result = await imageToImage(cid, prompt);
  console.log("Result has been finalized...");
  //@ts-ignore
  let imageBlob = base64ToBlob(result.image, "image/jpeg");
  // const imageBuffer = await blobToBuffer(imageBlob);
  // const consenscedImageBuffer = await sharp(imageBuffer)
  //   .jpeg({ quality: 10 }) // Adjust the quality value as needed (between 0 and 100)
  //   .toBuffer();
  // imageBlob = new Blob([consenscedImageBuffer], { type: "image/jpeg" });
  const imageIPFSHash = await uploadFileToIpfs(imageBlob);
  console.log({ imageIPFSHash });
  return;
  await updateImagePathOnCast(imageIPFSHash, createdArtcastId);
  return imageIPFSHash;
}
